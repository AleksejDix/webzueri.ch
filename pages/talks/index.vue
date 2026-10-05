<template>
  <div>
    <PageHero title="Talks" :lede="lede">
      <div class="mt-8 grid w-full justify-items-center gap-4">
        <label
          class="flex h-13 w-[min(100%,30rem)] items-center gap-2.5 rounded-full border border-line bg-raised px-5 [transition:border-color_0.2s,box-shadow_0.2s] focus-within:border-link focus-within:ring-4 focus-within:ring-link/15"
        >
          <LucideSearch :size="18" class="text-link" aria-hidden="true" />
          <span class="sr-only">Search talks or speakers</span>
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search talks or speakers"
            autocomplete="off"
            class="h-full min-w-0 flex-1 bg-transparent text-[1rem] focus:outline-none"
          />
        </label>
        <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter talks">
          <button
            v-for="c in categories"
            :key="c"
            type="button"
            class="chip group/chip"
            :aria-pressed="activeCategory === c"
            @click="filters.category = c === 'All' ? false : c"
          >
            {{ c }}
            <span class="text-[0.75rem] text-muted tabular-nums group-aria-pressed/chip:text-on-strong/70">{{ categoryCounts[c] ?? 0 }}</span>
          </button>
          <button type="button" class="chip group/chip" :aria-pressed="!!filters.recored" @click="filters.recored = !filters.recored">
            <LucidePlay :size="12" fill="currentColor" aria-hidden="true" />
            With video
            <span class="text-[0.75rem] text-muted tabular-nums group-aria-pressed/chip:text-on-strong/70">{{ videoCount }}</span>
          </button>
        </div>
      </div>
    </PageHero>

    <div class="mt-[clamp(3rem,5vw,4.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(5rem,8vw,8rem)]">
      <div class="mx-auto max-w-[78rem] px-4">
        <p class="mx-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] font-medium text-muted" aria-live="polite">
          <span v-if="isFiltered">{{ plural(visible.length, "talk") }} match</span>
          <span v-else>{{ plural(visible.length, "talk") }}, newest first</span>
          <button
            v-if="isFiltered"
            type="button"
            class="inline-flex items-center gap-1 font-semibold text-link hover:text-accent-hover hover:underline hover:underline-offset-[0.2em]"
            @click="clearFilters"
          >
            <LucideX :size="14" aria-hidden="true" /> Clear filters
          </button>
        </p>

        <section v-for="group in groups" :key="group.year" class="pt-[clamp(2.5rem,4.5vw,4rem)]" :aria-labelledby="`year-${group.year}`">
          <h2 :id="`year-${group.year}`" class="mx-2 mb-5 flex items-baseline gap-4">
            <span class="display text-[clamp(3rem,6vw,5rem)] leading-none tabular-nums">{{ group.year }}</span>
            <span class="text-[1rem] font-semibold text-muted">{{ plural(group.talks.length, "talk") }}</span>
          </h2>

          <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,17.5rem),1fr))] gap-4">
            <li v-for="talk in group.talks" :key="talk.id" class="flex">
              <TalkTile :talk="talk" />
            </li>
          </ul>
        </section>

        <div v-if="!visible.length" class="py-16 text-center">
          <p class="heading text-2xl">No talks match these filters.</p>
          <p class="mt-2 text-muted">Try a shorter search, or clear the filters to see all {{ all.length }} talks.</p>
          <button type="button" class="btn btn-quiet mt-6" @click="clearFilters">Clear filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import QueryPublishedTalks from "~/services/apollo/queries/publishedTalks.gql";
import PageHero from "~/components/PageHero.vue";
import TalkTile from "~/components/TalkTile.vue";
import { normalize } from "~/composables/useSiteSearch";

interface Talk {
  id: string;
  name: string;
  category: string | null;
  youtubecode: string | null;
  createdAt: string;
  speakers: { id: string; name: string; speakerPicture: { url: string } | null }[];
  event: { id: string; date: string } | null;
}

const route = useRoute();
const router = useRouter();

// Filters are mirrored in the query string (?category=&search=&recored=&timeAgo=)
// so links shared from the old site keep working. The old site also wrote
// "false" and "null" into unused keys, so those count as empty.
const param = (v: unknown) => (typeof v === "string" && v && v !== "false" && v !== "null" ? v : false);
const filters = reactive({
  category: param(route.query.category) as string | false,
  search: param(route.query.search) as string | false,
  recored: route.query.recored === "true",
  timeAgo: param(route.query.timeAgo) as string | false,
});

// Filtering happens in the browser (there are only a few hundred talks), so
// results follow every keystroke; the URL catches up after a short pause
const searchInput = ref(filters.search || "");
let debounce: ReturnType<typeof setTimeout>;
watch(searchInput, (value) => {
  clearTimeout(debounce);
  debounce = setTimeout(() => (filters.search = value.trim() || false), 250);
});

watch(
  filters,
  (f) => {
    const query = Object.fromEntries(Object.entries(f).filter(([, v]) => v).map(([k, v]) => [k, String(v)]));
    router.replace({ query });
  },
  { deep: true }
);

const { data } = await useAsyncQuery<{ talks: Talk[] }>(QueryPublishedTalks);

const dateOf = (t: Talk) => t.event?.date ?? t.createdAt;
// "Organising team" entries are notices (a cancelled evening), not talks
const isNotice = (t: Talk) => t.speakers.length > 0 && t.speakers.every((s) => s.name === "Organising team");
const all = computed(() =>
  (data.value?.talks ?? []).filter((t) => !isNotice(t)).sort((a, b) => dateOf(b).localeCompare(dateOf(a)))
);

const categories = ["All", "Frontend", "Backend", "Design", "Others"];
// Talks without a category belong with "Others"
const categoryOf = (t: Talk) => t.category || "Others";
const activeCategory = computed(() => (filters.category && categories.includes(filters.category) ? filters.category : "All"));

const terms = computed(() => normalize(searchInput.value.trim()).split(/\s+/).filter(Boolean));
const matchesSearch = (t: Talk) => {
  if (!terms.value.length) return true;
  const haystack = normalize([t.name, ...t.speakers.map((s) => s.name)].join(" "));
  return terms.value.every((term) => haystack.includes(term));
};
const matchesTime = (t: Talk) => !filters.timeAgo || t.createdAt >= filters.timeAgo;
const matchesVideo = (t: Talk) => !filters.recored || !!t.youtubecode;
const matchesCategory = (t: Talk) => activeCategory.value === "All" || categoryOf(t) === activeCategory.value;

const visible = computed(() =>
  all.value.filter((t) => matchesSearch(t) && matchesTime(t) && matchesVideo(t) && matchesCategory(t))
);

// Each chip counts what you'd get by pressing it, given the other filters
const categoryCounts = computed(() => {
  const base = all.value.filter((t) => matchesSearch(t) && matchesTime(t) && matchesVideo(t));
  const counts: Record<string, number> = { All: base.length };
  for (const t of base) counts[categoryOf(t)] = (counts[categoryOf(t)] ?? 0) + 1;
  return counts;
});
const videoCount = computed(
  () => all.value.filter((t) => t.youtubecode && matchesSearch(t) && matchesTime(t) && matchesCategory(t)).length
);

const groups = computed(() => {
  const byYear = new Map<string, Talk[]>();
  for (const t of visible.value) {
    const year = dateOf(t).slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), t]);
  }
  return [...byYear].map(([year, talks]) => ({ year, talks }));
});

const isFiltered = computed(() => !!(filters.category || filters.recored || filters.timeAgo || searchInput.value.trim()));

function clearFilters() {
  searchInput.value = "";
  Object.assign(filters, { category: false, search: false, recored: false, timeAgo: false });
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const lede = computed(() => {
  const talks = all.value;
  if (!talks.length) return "Everything presented at Web Zürich, newest first.";
  const speakers = new Set(talks.flatMap((t) => t.speakers.map((s) => s.id))).size;
  const since = dateOf(talks.at(-1)!).slice(0, 4);
  const videos = talks.filter((t) => t.youtubecode).length;
  return `${talks.length} talks by ${speakers} speakers since ${since}. ${videos} of them are recorded, so you can watch them here.`;
});

useHead(() => ({ title: `${all.value.length} Talks` }));
useSeoMeta({
  description: () =>
    `All ${all.value.length} talks given at Web Zürich since 2016, on frontend, backend and design. Filter by topic, speaker or year, and watch the recordings.`,
});
defineOgImage("Page", {
  title: `${all.value.length} talks`,
  description: "Every talk given at Web Zürich since 2016, on frontend, backend and design, with recordings.",
});
</script>
