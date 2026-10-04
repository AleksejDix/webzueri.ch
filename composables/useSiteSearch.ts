export interface SearchTalk {
  id: string;
  name: string;
  category: string | null;
  video: boolean;
  date: string | null;
  speakers: string[];
}
export interface SearchSpeaker {
  id: string;
  name: string;
  picture: string;
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

export const SUBMIT_TALK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1";
export const MEETUP_URL = "https://www.meetup.com/web-zurich/";

const PAGES: SearchPage[] = [
  { title: "Events", description: "Every meetup since 2016", to: "/events", keywords: "events meetups past history archive" },
  { title: "Talks", description: "Browse and filter every talk", to: "/talks", keywords: "talks videos recordings presentations" },
  { title: "Speakers", description: "People who have spoken at Web Zürich", to: "/speakers", keywords: "speakers people presenters" },
  { title: "Submit a talk", description: "Tell us what you'd like to present", to: SUBMIT_TALK_URL, external: true, keywords: "submit speak propose talk cfp call for papers present apply" },
  { title: "Communities", description: "Other tech meetups in Zürich", to: "/communities", keywords: "communities groups meetups other javascript python ai" },
  { title: "Sponsors", description: "Companies that host and support us", to: "/sponsors", keywords: "sponsors sponsoring host venue partner companies" },
  { title: "Code of Conduct", description: "How we treat each other", to: "/code-of-conduct", keywords: "code of conduct coc rules behaviour harassment report" },
  { title: "Advertising rules", description: "How hosts, sponsors and members may promote things", to: "/advertising-rules", keywords: "advertising ads rules sponsors recruiting jobs promotion pitch selling" },
  { title: "About", description: "Who we are", to: "/about", keywords: "about team organizers history who" },
];

const CATEGORIES = ["frontend", "backend", "design", "others"];
const VIDEO_WORDS = ["video", "videos", "recorded", "recording", "recordings", "youtube", "watch"];
const NEXT_WORDS = ["next", "upcoming", "when", "meetup", "today", "tonight"];

export const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function score(haystack: string, tokens: string[]): number {
  const h = normalize(haystack);
  let total = 0;
  for (const t of tokens) {
    const i = h.indexOf(t);
    if (i === -1) return 0;
    total += i === 0 ? 3 : /\W/.test(h[i - 1] ?? "") ? 2 : 1;
  }
  return total;
}

export function useSiteSearch() {
  const index = useState<SearchIndex | null>("search-index", () => null);
  const query = useState("search-query", () => "");
  const loading = useState("search-loading", () => false);

  async function load() {
    if (index.value || loading.value) return;
    loading.value = true;
    try {
      index.value = await $fetch<SearchIndex>("/api/search-index");
    } finally {
      loading.value = false;
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const nextEvent = computed(() => {
    const events = index.value?.events ?? [];
    return [...events].reverse().find((e) => e.date >= today) ?? null;
  });
  const lastEvent = computed(() => index.value?.events.find((e) => e.date < today) ?? null);

  const results = computed(() => {
    const raw = normalize(query.value.trim());
    const empty = { pages: [], speakers: [], talks: [], events: [], showNext: false, talkTotal: 0, filters: { video: false, category: null as string | null }, words: "" };
    if (!raw) return empty;

    const tokens = raw.split(/\s+/).filter(Boolean);
    const video = tokens.some((t) => VIDEO_WORDS.includes(t));
    const category = tokens.find((t) => CATEGORIES.includes(t)) ?? null;
    const showNext = tokens.some((t) => NEXT_WORDS.includes(t));
    // Intent words filter results instead of matching text
    const free = tokens.filter((t) => !VIDEO_WORDS.includes(t) && t !== category && !NEXT_WORDS.includes(t) && !["talk", "talks", "with", "about", "on", "the", "a"].includes(t));

    const pages = PAGES.map((p) => ({ p, s: score(`${p.title} ${p.keywords}`, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.p);

    if (!index.value) return { ...empty, pages, showNext };

    const speakers = free.length
      ? index.value.speakers
          .map((sp) => ({ sp, s: score(sp.name, free) }))
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s || b.sp.talkCount - a.sp.talkCount)
          .map((x) => x.sp)
      : [];

    const talkMatches = index.value.talks
      .filter((t) => (!video || t.video) && (!category || normalize(t.category ?? "") === category))
      .map((t) => ({ t, s: free.length ? score(`${t.name} ${t.speakers.join(" ")}`, free) : 1 }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || (b.t.date ?? "").localeCompare(a.t.date ?? ""))
      .map((x) => x.t);

    const anyFilter = video || category || free.length;
    const events = free.length
      ? index.value.events
          .filter((e) => score(`${e.title ?? ""} ${e.venue ?? ""} ${e.date}`, free) > 0)
          .slice(0, 3)
      : [];

    return {
      pages,
      speakers: speakers.slice(0, 4),
      talks: anyFilter ? talkMatches.slice(0, 6) : [],
      talkTotal: anyFilter ? talkMatches.length : 0,
      events,
      showNext,
      filters: { video, category },
      words: free.join(" "),
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
