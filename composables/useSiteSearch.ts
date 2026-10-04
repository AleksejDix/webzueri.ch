import { SPONSOR_EMAIL, SPONSOR_PRICES } from "~/utils/sponsoring";

export interface SearchTalk {
  id: string;
  name: string;
  category: string | null;
  video: boolean;
  about: string;
  date: string | null;
  speakers: string[];
}
export interface SearchSpeaker {
  id: string;
  name: string;
  picture: string;
  role: string;
  talkCount: number;
}
export interface SearchEvent {
  id: string;
  date: string;
  time: string | null;
  title: string | null;
  meetupLink: string | null;
  venue: string | null;
  talkCount: number;
}
interface SearchIndex {
  talks: SearchTalk[];
  speakers: SearchSpeaker[];
  events: SearchEvent[];
}

export interface SearchPage {
  title: string;
  description: string;
  to: string;
  external?: boolean;
  keywords: string;
}

/** A direct answer to a question, shown above the results */
export interface SearchAnswer {
  key: string;
  text: string;
  link: string;
  to: string;
  external?: boolean;
}

export const SUBMIT_TALK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1";
export const MEETUP_URL = "https://www.meetup.com/web-zurich/";
const WHATSAPP_URL = "https://chat.whatsapp.com/FxOfVTK9nf431xHtVl3eGK";

const PAGES: SearchPage[] = [
  { title: "Events", description: "Every meetup since 2016", to: "/events", keywords: "events meetups past history archive" },
  { title: "Talks", description: "Browse and filter every talk", to: "/talks", keywords: "talks videos recordings presentations" },
  { title: "Speakers", description: "People who have spoken at Web Zürich", to: "/speakers", keywords: "speakers people presenters" },
  { title: "Submit a talk", description: "Tell us what you'd like to present", to: SUBMIT_TALK_URL, external: true, keywords: "submit speak propose talk cfp call for papers present apply" },
  { title: "Communities", description: "Other tech meetups in Switzerland", to: "/communities", keywords: "communities groups meetups other javascript python ai" },
  { title: "Sponsors", description: "Companies that host and support us", to: "/sponsors", keywords: "sponsors sponsoring host venue partner companies" },
  { title: "Code of Conduct", description: "How we treat each other", to: "/code-of-conduct", keywords: "code of conduct coc rules behaviour harassment report" },
  { title: "Advertising rules", description: "How hosts, sponsors and members may promote things", to: "/advertising-rules", keywords: "advertising ads rules sponsors recruiting jobs promotion pitch selling" },
  { title: "About", description: "Who we are", to: "/about", keywords: "about team organizers founders history who" },
];

const CATEGORIES = ["frontend", "backend", "design", "others"];
const VIDEO_WORDS = ["video", "videos", "recorded", "recording", "recordings", "youtube", "watch"];
const NEXT_WORDS = ["next", "upcoming", "when", "today", "tonight", "where"];
// Words that shape a question but don't describe what to find
const FILLER = new Set(
  "talk talks with about on the a an of in at from for to and or is are was were any all show me find list what which who there some".split(" ")
);

// Different words people use for the same topic
const SYNONYMS: Record<string, string[]> = {
  js: ["javascript", "js"],
  javascript: ["javascript", "js"],
  ts: ["typescript"],
  typescript: ["typescript"],
  a11y: ["accessibility", "a11y", "accessible"],
  accessibility: ["accessibility", "a11y", "accessible"],
  ux: ["ux", "user experience", "usability"],
  ui: ["ui", "interface"],
  ai: ["ai", "llm", "gpt", "machine learning", "artificial intelligence", "neural"],
  ml: ["machine learning", "ml", "tensorflow", "neural"],
  llm: ["llm", "gpt", "ai", "language model"],
  perf: ["performance", "perf", "fast", "speed"],
  performance: ["performance", "perf", "fast", "speed"],
  "3d": ["3d", "webgl", "three", "webgpu"],
  webgl: ["webgl", "3d", "three", "shader"],
  css: ["css", "style", "styles", "styling"],
  security: ["security", "secure", "auth", "authentication", "privacy"],
  test: ["test", "testing", "tests"],
  testing: ["test", "testing", "tests"],
  node: ["node", "nodejs", "node.js"],
  serverless: ["serverless", "lambda", "edge"],
  pwa: ["pwa", "progressive web app", "service worker", "offline"],
};

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export const normalize = (s: string | null | undefined) => (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const wordsOf = (s: string) => normalize(s).split(/[^a-z0-9.+#]+/).filter(Boolean);

// Damerau-Levenshtein distance, stopping early once it's clearly too far
function distance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2]![j - 2]! + 1);
      d[i]![j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length]![b.length]!;
}

/**
 * How well one search word matches a list of words: 3 for an exact word,
 * 2 for the start of a word, 1 for a close spelling, 0 for nothing.
 * Phrases ("machine learning") are matched against the joined text.
 */
function matchWord(term: string, words: string[], text: string) {
  if (term.includes(" ")) return text.includes(term) ? 3 : 0;
  let best = 0;
  const allowed = term.length >= 7 ? 2 : term.length >= 4 ? 1 : 0;
  for (const w of words) {
    if (w === term) return 3;
    if (w.startsWith(term)) best = Math.max(best, 2);
    else if (allowed && best < 1 && distance(term, w.slice(0, term.length + allowed), allowed) <= allowed) best = 1;
  }
  return best;
}

// A search word matches if it or any of its synonyms does
const variants = (term: string) => SYNONYMS[term] ?? [term];
function matchTerm(term: string, words: string[], text: string) {
  return Math.max(...variants(term).map((v) => matchWord(v, words, text)));
}

/**
 * Scores a record against every search word; each word must match somewhere.
 * Fields carry weights, so a match in a title counts more than in a description.
 */
function scoreFields(terms: string[], fields: { words: string[]; text: string; weight: number }[]) {
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const f of fields) best = Math.max(best, matchTerm(term, f.words, f.text) * f.weight);
    if (!best) return 0;
    total += best;
  }
  return total;
}

interface Prepared {
  talks: { t: SearchTalk; title: string[]; titleText: string; people: string[]; peopleText: string; about: string[]; aboutText: string }[];
  speakers: { s: SearchSpeaker; name: string[]; nameText: string; role: string[]; roleText: string }[];
}

function prepare(index: SearchIndex): Prepared {
  return {
    talks: index.talks.map((t) => ({
      t,
      title: wordsOf(`${t.name} ${t.category ?? ""}`),
      titleText: normalize(t.name),
      people: wordsOf(t.speakers.join(" ")),
      peopleText: normalize(t.speakers.join(" ")),
      // Older cached indexes may not have descriptions or roles yet
      about: wordsOf(t.about ?? ""),
      aboutText: normalize(t.about ?? ""),
    })),
    speakers: index.speakers.map((s) => ({
      s,
      name: wordsOf(s.name),
      nameText: normalize(s.name),
      role: wordsOf(s.role ?? ""),
      roleText: normalize(s.role ?? ""),
    })),
  };
}

const has = (tokens: string[], ...words: string[]) => words.some((w) => tokens.includes(w));
const hasPhrase = (raw: string, ...phrases: string[]) => phrases.some((p) => raw.includes(p));

export function useSiteSearch() {
  const index = useState<SearchIndex | null>("search-index", () => null);
  const query = useState("search-query", () => "");
  const loading = useState("search-loading", () => false);

  async function load() {
    if (index.value || loading.value) return;
    loading.value = true;
    try {
      // The version busts browser caches whenever the index gains new fields
      index.value = await $fetch<SearchIndex>("/api/search-index", { query: { v: 2 } });
    } finally {
      loading.value = false;
    }
  }

  const prepared = computed(() => (index.value ? prepare(index.value) : null));

  const today = new Date().toISOString().slice(0, 10);
  const thisYear = Number(today.slice(0, 4));

  const nextEvent = computed(() => {
    const events = index.value?.events ?? [];
    return [...events].reverse().find((e) => e.date >= today) ?? null;
  });
  const lastEvent = computed(() => index.value?.events.find((e) => e.date < today) ?? null);

  // Questions we can answer in one sentence
  function answersFor(raw: string, tokens: string[]): SearchAnswer[] {
    const out: SearchAnswer[] = [];
    const aboutSponsoring = has(tokens, "sponsor", "sponsoring", "host", "hosting", "catering", "support");
    // "How much does sponsoring cost" is about sponsoring, not about attending
    if (!aboutSponsoring && has(tokens, "free", "cost", "costs", "price", "ticket", "tickets", "pay", "entry")) {
      out.push({ key: "free", text: "Yes, Web Zürich is free. Sponsors cover the food, drinks and venue.", link: "About Web Zürich", to: "/about" });
    }
    if (has(tokens, "speak", "speaker", "cfp", "submit", "propose", "present") || hasPhrase(raw, "give a talk", "do a talk", "hold a talk")) {
      out.push({ key: "speak", text: "Anyone can propose a talk, first-timers included.", link: "Submit a talk", to: SUBMIT_TALK_URL, external: true });
    }
    if (aboutSponsoring) {
      const prices = SPONSOR_PRICES.map((p) => `${p.short} ${p.price}`).join(", ");
      out.push({ key: "sponsor", text: `Cover part of an evening and get a speaking slot: ${prices}.`, link: "Support an evening", to: "/sponsors#support" });
    }
    if (has(tokens, "job", "jobs", "hiring", "salary", "recruit", "recruiting", "recruiter")) {
      out.push({ key: "jobs", text: "Job posts are free, but they must include the salary.", link: "Advertising rules", to: "/advertising-rules" });
    }
    if (has(tokens, "harassment", "harass", "report", "unsafe", "coc", "conduct")) {
      out.push({ key: "coc", text: `Tell an organiser at the venue or write to ${SPONSOR_EMAIL}. Reports stay confidential.`, link: "Code of Conduct", to: "/code-of-conduct#enforcement" });
    }
    if (has(tokens, "contact", "email", "mail", "organiser", "organisers", "organizer", "organizers")) {
      out.push({ key: "contact", text: `Write to ${SPONSOR_EMAIL}. The organisers read every message.`, link: SPONSOR_EMAIL, to: `mailto:${SPONSOR_EMAIL}`, external: true });
    }
    if (has(tokens, "whatsapp", "slack", "chat", "join", "community", "newsletter")) {
      out.push({ key: "chat", text: "Join the group on Meetup for event announcements, or chat with members on WhatsApp.", link: "WhatsApp group", to: WHATSAPP_URL, external: true });
    }
    if (hasPhrase(raw, "how many") && index.value) {
      const i = index.value;
      out.push({
        key: "count",
        text: `${i.events.length} meetups, ${i.talks.length} talks and ${i.speakers.length} speakers since 2016. ${i.talks.filter((t) => t.video).length} talks are on video.`,
        link: "About Web Zürich",
        to: "/about",
      });
    }
    return out;
  }

  const results = computed(() => {
    const raw = normalize(query.value.trim()).replace(/[?!.,]/g, " ");
    const empty = {
      pages: [] as SearchPage[],
      answers: [] as SearchAnswer[],
      speakers: [] as SearchSpeaker[],
      talks: [] as SearchTalk[],
      events: [] as SearchEvent[],
      showNext: false,
      talkTotal: 0,
      filters: { video: false, category: null as string | null, year: null as number | null },
      words: "",
    };
    if (!raw.trim()) return empty;

    let tokens = raw.split(/\s+/).filter(Boolean);

    // Year: "2019", "this year", "last year"
    let year: number | null = null;
    const yearToken = tokens.find((t) => /^20[1-3]\d$/.test(t));
    if (yearToken) year = Number(yearToken);
    else if (hasPhrase(raw, "this year")) year = thisYear;
    else if (hasPhrase(raw, "last year")) year = thisYear - 1;
    const month = MONTHS.findIndex((m) => tokens.some((t) => t.length >= 3 && m.startsWith(t)));

    // "by Martin", "from Marion": the words after it name a speaker
    const byAt = tokens.findIndex((t) => t === "by");
    const byWords = byAt >= 0 ? tokens.slice(byAt + 1).filter((t) => !FILLER.has(t) && !/^\d+$/.test(t)) : [];

    const video = tokens.some((t) => VIDEO_WORDS.includes(t));
    const category = tokens.find((t) => CATEGORIES.includes(t)) ?? null;
    const showNext = tokens.some((t) => NEXT_WORDS.includes(t)) || hasPhrase(raw, "next meetup", "next event");
    const answers = answersFor(raw, tokens);

    // What's left describes the topic to look for
    const used = new Set([...VIDEO_WORDS, ...NEXT_WORDS, ...(category ? [category] : []), "by", "this", "last", "year", "meetup", "meetups"]);
    tokens = tokens.filter((t) => !used.has(t) && !FILLER.has(t) && t !== yearToken && !(month >= 0 && MONTHS[month]!.startsWith(t) && t.length >= 3));
    const topic = tokens.filter((t) => !byWords.includes(t));

    const pages = PAGES.map((p) => ({ p, s: scoreFields(raw.split(/\s+/).filter((t) => !FILLER.has(t)), [{ words: wordsOf(`${p.title} ${p.keywords}`), text: normalize(p.title), weight: 1 }]) }))
      .filter((x) => x.s > 0 && !answers.length)
      .sort((a, b) => b.s - a.s)
      .slice(0, 2)
      .map((x) => x.p);

    const data = prepared.value;
    if (!data) return { ...empty, pages, answers, showNext };

    const inYear = (d: string | null) => !year || (d ?? "").startsWith(String(year));
    const inMonth = (d: string | null) => month < 0 || Number((d ?? "").slice(5, 7)) === month + 1;

    // Speakers by name, or by company and role ("google", "designer")
    const who = byWords.length ? byWords : topic;
    const speakers = who.length
      ? data.speakers
          .map((x) => ({
            s: x.s,
            score: scoreFields(who, [
              { words: x.name, text: x.nameText, weight: 3 },
              { words: x.role, text: x.roleText, weight: 1.5 },
            ]),
          }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score || b.s.talkCount - a.s.talkCount)
          .map((x) => x.s)
      : [];

    const talkMatches = data.talks
      .filter((x) => (!video || x.t.video) && (!category || normalize(x.t.category ?? "") === category))
      .filter((x) => inYear(x.t.date) && inMonth(x.t.date))
      .filter((x) => !byWords.length || scoreFields(byWords, [{ words: x.people, text: x.peopleText, weight: 1 }]) > 0)
      .map((x) => ({
        t: x.t,
        score: topic.length
          ? scoreFields(topic, [
              { words: x.title, text: x.titleText, weight: 3 },
              { words: x.people, text: x.peopleText, weight: 2.5 },
              { words: x.about, text: x.aboutText, weight: 1 },
            ])
          : 1,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || (b.t.date ?? "").localeCompare(a.t.date ?? ""))
      .map((x) => x.t);

    const anyFilter = video || category || year || month >= 0 || topic.length || byWords.length;

    // Meetups by date ("march 2024"), title or venue
    const events = index.value!.events
      .filter((e) => inYear(e.date) && inMonth(e.date))
      .filter((e) => {
        if (!topic.length) return Boolean(year || month >= 0) && !byWords.length;
        const words = wordsOf(`${e.title ?? ""} ${e.venue ?? ""}`);
        return scoreFields(topic, [{ words, text: words.join(" "), weight: 1 }]) > 0;
      })
      .slice(0, 3);

    return {
      pages,
      answers,
      speakers: speakers.slice(0, 4),
      talks: anyFilter && !(answers.length && !topic.length) ? talkMatches.slice(0, 6) : [],
      talkTotal: anyFilter ? talkMatches.length : 0,
      events,
      showNext,
      filters: { video, category, year },
      words: topic.join(" "),
    };
  });

  return { index, query, loading, load, results, nextEvent, lastEvent };
}

/** Link to the full talks list with the same filters the bar applied */
export function talksLink(r: { filters: { video: boolean; category: string | null }; words: string }) {
  const q: Record<string, string> = {};
  if (r.filters.category) q.category = r.filters.category[0]!.toUpperCase() + r.filters.category.slice(1);
  if (r.words) q.search = r.words;
  if (r.filters.video) q.recored = "true";
  return { path: "/talks", query: q };
}
