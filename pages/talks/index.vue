<template>
  <div>
    <PageHero title="Talks" :lede="lede">
      <div class="filters">
        <label class="filters__search">
          <LucideSearch :size="18" class="text-zh-blue" aria-hidden="true" />
          <span class="sr-only">Search talks or speakers</span>
          <input v-model="searchInput" type="search" placeholder="Search talks or speakers" autocomplete="off" />
        </label>
        <div class="filters__chips" role="group" aria-label="Filter talks">
          <button
            v-for="c in categories"
            :key="c"
            type="button"
            class="chip"
            :aria-pressed="activeCategory === c"
            @click="filters.category = c === 'All' ? false : c"
          >
            {{ c }}
            <span class="chip__count">{{ categoryCounts[c] ?? 0 }}</span>
          </button>
          <button type="button" class="chip" :aria-pressed="!!filters.recored" @click="filters.recored = !filters.recored">
            <LucidePlay :size="12" fill="currentColor" aria-hidden="true" />
            With video
            <span class="chip__count">{{ videoCount }}</span>
          </button>
        </div>
      </div>
    </PageHero>

    <div class="band">
      <div class="list">
        <p class="status" aria-live="polite">
          <span v-if="isFiltered">{{ plural(visible.length, "talk") }} match</span>
          <span v-else>{{ plural(visible.length, "talk") }}, newest first</span>
          <button v-if="isFiltered" type="button" class="status__clear" @click="clearFilters">
            <LucideX :size="14" aria-hidden="true" /> Clear filters
          </button>
        </p>

        <section v-for="group in groups" :key="group.year" class="year" :aria-labelledby="`year-${group.year}`">
          <h2 :id="`year-${group.year}`" class="year__head">
            <span class="display year__title">{{ group.year }}</span>
            <span class="year__count">{{ plural(group.talks.length, "talk") }}</span>
          </h2>

          <ul class="grid">
            <li v-for="talk in group.talks" :key="talk.id">
              <TalkTile :talk="talk" />
            </li>
          </ul>
        </section>

        <div v-if="!visible.length" class="empty">
          <p class="heading text-2xl">No talks match these filters.</p>
          <p class="mt-2 text-zh-muted">Try a shorter search, or clear the filters to see all {{ all.length }} talks.</p>
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
</script>

<style scoped>
.filters {
  display: grid;
  justify-items: center;
  gap: 1rem;
  width: 100%;
  margin-top: 2rem;
}
.filters__search {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: min(100%, 30rem);
  height: 3.25rem;
  padding-inline: 1.25rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--color-zh-line);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.filters__search:focus-within {
  border-color: var(--color-zh-blue);
  box-shadow: 0 0 0 4px rgb(0 112 180 / 0.15);
}
.filters__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  font-size: 1rem;
}
.filters__search input:focus {
  outline: none;
}
.filters__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.chip__count {
  font-size: 0.75rem;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}
.chip[aria-pressed="true"] .chip__count {
  color: rgb(255 255 255 / 0.7);
}

.band {
  margin-top: clamp(3rem, 5vw, 4.5rem);
  padding-block: clamp(1.5rem, 3vw, 2.5rem) clamp(5rem, 8vw, 8rem);
}
.list {
  max-width: 78rem;
  margin: 0 auto;
  padding-inline: 1rem;
}

.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-inline: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-zh-muted);
}
.status__clear {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.status__clear:hover {
  color: var(--color-zh-blue-hover);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.year {
  padding-top: clamp(2.5rem, 4.5vw, 4rem);
}
.year__head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin: 0 0.5rem 1.25rem;
}
.year__title {
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.year__count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17.5rem), 1fr));
  gap: 1rem;
}
.grid > li {
  display: flex;
}

.empty {
  padding-block: 4rem;
  text-align: center;
}
</style>
