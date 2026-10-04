// Questions the search bar can't match go to Claude, which answers from the
// site's own talks, speakers and meetups (the same index the bar searches)
// and points at the ones that fit. Needs ANTHROPIC_API_KEY; without it the bar
// simply shows its usual "nothing matches".
import Anthropic from "@anthropic-ai/sdk";
import { SPONSOR_EMAIL, SPONSOR_PRICES } from "~/utils/sponsoring";
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/utils/links";

interface SearchIndex {
  talks: { id: string; name: string; category: string | null; video: boolean; about: string; date: string | null; speakers: string[] }[];
  speakers: { id: string; name: string; role: string; talkCount: number }[];
  events: { id: string; date: string; title: string | null; venue: string | null; talkCount: number }[];
}

export interface AskAnswer {
  answer: string;
  talks: string[];
  speakers: string[];
  events: string[];
}

const SCHEMA = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description: "One or two short sentences answering the question, in the language it was asked in",
    },
    talks: { type: "array", items: { type: "string" }, description: "Ids of up to 6 talks that fit, best first" },
    speakers: { type: "array", items: { type: "string" }, description: "Ids of up to 4 speakers who fit, best first" },
    events: { type: "array", items: { type: "string" }, description: "Dates (YYYY-MM-DD) of up to 3 meetups that fit" },
  },
  required: ["answer", "talks", "speakers", "events"],
  additionalProperties: false,
} as const;

// Everything Claude may answer from, in a stable order so the prompt caches
function catalogue(index: SearchIndex) {
  const prices = SPONSOR_PRICES.map((p) => `${p.short} ${p.price}`).join(", ");
  return [
    "# Web Zürich",
    "A free, community-run web development meetup in Zürich since 2016, usually on a Friday evening at a sponsor's office, in English.",
    `Join on Meetup: ${MEETUP_URL}. Anyone can propose a talk, first-timers included: ${SUBMIT_TALK_URL}.`,
    `Sponsors cover an evening: ${prices}. Contact the organisers: ${SPONSOR_EMAIL}.`,
    "Job posts are free but must include the salary. There is a Code of Conduct; reports go to an organiser or the email above.",
    "",
    "# Talks (id | date | title | speakers | category | video | about)",
    ...index.talks.map((t) =>
      [t.id, t.date ?? "", t.name, t.speakers.join(", "), t.category ?? "", t.video ? "video" : "", t.about.slice(0, 220)].join(" | ")
    ),
    "",
    "# Speakers (id | name | role | talks)",
    ...index.speakers.map((s) => [s.id, s.name, s.role, s.talkCount].join(" | ")),
    "",
    "# Meetups (date | title | venue | talks)",
    ...index.events.map((e) => [e.date, e.title ?? "", e.venue ?? "", e.talkCount].join(" | ")),
  ].join("\n");
}

const INSTRUCTIONS = `You answer questions typed into the search bar of webzurich.ch, the site of the Web Zürich meetup. The site's search found nothing for these, so the question may be vague, phrased loosely, or about something the meetup never covered.

Answer only from the catalogue below; never invent talks, people, dates or facts. Pick the talks, speakers and meetups that genuinely fit, by meaning rather than by matching words (a question about "making sites faster" fits talks on performance, images or caching). If nothing fits, say so plainly in the answer and leave the lists empty, or suggest the closest topic the meetup did cover. Keep the answer to one or two short sentences; the picked items are shown below it as links.`;

// Best effort against a script hammering the endpoint: a few questions per
// visitor per minute on each server instance
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  times.push(now);
  recent.set(ip, times);
  return times.length > 8;
}

export default defineEventHandler(async (event): Promise<AskAnswer> => {
  if (!process.env.ANTHROPIC_API_KEY) throw createError({ statusCode: 503, statusMessage: "Ask is not set up" });

  const body = await readBody<{ question?: unknown }>(event);
  const question = String(body?.question ?? "").trim().slice(0, 200);
  if (question.length < 3) throw createError({ statusCode: 400, statusMessage: "Question too short" });
  if (tooMany(getRequestIP(event, { xForwardedFor: true }) ?? "unknown")) {
    throw createError({ statusCode: 429, statusMessage: "Too many questions" });
  }

  // The same question gets the same answer for a day
  const storage = useStorage("cache");
  const key = `ask:${question.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()}`;
  const cached = await storage.getItem<AskAnswer>(key);
  if (cached) return cached;

  const index = await $fetch<SearchIndex>("/api/search-index");
  const client = new Anthropic();
  let response;
  try {
    response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      // If a safety classifier declines, the request is re-run on Anthropic's recommended fallback model
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: [{ type: "text", text: `${INSTRUCTIONS}\n\n${catalogue(index)}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: question }],
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) throw createError({ statusCode: 429, statusMessage: "Busy, try again" });
    if (error instanceof Anthropic.APIError) throw createError({ statusCode: 502, statusMessage: `Claude: ${error.status}` });
    throw error;
  }

  if (response.stop_reason === "refusal") return { answer: "", talks: [], speakers: [], events: [] };
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw createError({ statusCode: 502, statusMessage: "No answer" });

  // Keep only ids that exist, so the bar never links to something made up
  const parsed = JSON.parse(text.text) as AskAnswer;
  const talkIds = new Set(index.talks.map((t) => t.id));
  const speakerIds = new Set(index.speakers.map((s) => s.id));
  const eventDates = new Set(index.events.map((e) => e.date));
  const answer: AskAnswer = {
    answer: parsed.answer.trim(),
    talks: parsed.talks.filter((id) => talkIds.has(id)).slice(0, 6),
    speakers: parsed.speakers.filter((id) => speakerIds.has(id)).slice(0, 4),
    events: parsed.events.filter((d) => eventDates.has(d)).slice(0, 3),
  };
  await storage.setItem(key, answer, { ttl: 60 * 60 * 24 });
  return answer;
});
