<template>
  <div>
    <PageHero title="Communities" :lede="lede">
      <div class="filters">
        <label class="filters__search">
          <LucideSearch :size="18" class="text-zh-blue" aria-hidden="true" />
          <span class="sr-only">Search communities</span>
          <input v-model="search" type="search" placeholder="Search by name, topic or city" autocomplete="off" />
        </label>
        <div class="filters__chips" role="group" aria-label="Filter by topic">
          <button type="button" class="chip" :aria-pressed="!topic" @click="topic = null">
            All <span class="chip__count">{{ topicCounts.All }}</span>
          </button>
          <button
            v-for="t in topics"
            :key="t"
            type="button"
            class="chip"
            :aria-pressed="topic === t"
            @click="topic = topic === t ? null : t"
          >
            {{ t }} <span class="chip__count">{{ topicCounts[t] ?? 0 }}</span>
          </button>
        </div>
        <div v-if="cities.length > 1" class="filters__chips" role="group" aria-label="Filter by city">
          <button
            v-for="c in cities"
            :key="c"
            type="button"
            class="chip chip--city"
            :aria-pressed="city === c"
            @click="city = city === c ? null : c"
          >
            <LucideMapPin :size="12" aria-hidden="true" /> {{ c }}
          </button>
        </div>
      </div>
    </PageHero>

    <div class="list">
      <p class="status" aria-live="polite">
        <span>{{ plural(visible.length, "community", "communities") }}{{ isFiltered ? " match" : "" }}</span>
        <button v-if="isFiltered" type="button" class="status__clear" @click="clearFilters">
          <LucideX :size="14" aria-hidden="true" /> Clear filters
        </button>
      </p>

      <section v-for="group in groups" :key="group.topic" class="group" :aria-labelledby="slug(group.topic)">
        <h2 :id="slug(group.topic)" class="group__head">
          <span class="display group__title">{{ group.topic }}</span>
          <span class="group__count">{{ group.items.length }}</span>
        </h2>
        <ul class="grid">
          <li v-for="c in group.items" :key="c.url">
            <a :href="c.url" target="_blank" rel="noopener" class="card">
              <span class="card__top">
                <span class="card__mark" :style="{ background: toneOf(c.name) }" aria-hidden="true">{{ mark(c.name) }}</span>
                <span class="card__city"><LucideMapPin :size="12" aria-hidden="true" />{{ c.city }}</span>
              </span>
              <span class="card__name">{{ c.name }}</span>
              <span class="card__text">{{ c.description }}</span>
              <span class="card__link">
                {{ host(c.url) }}
                <LucideArrowUpRight :size="16" class="card__arrow" aria-hidden="true" />
                <span class="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </li>
        </ul>
      </section>

      <div v-if="!visible.length" class="empty">
        <p class="heading text-2xl">No communities match.</p>
        <p class="mt-2 text-zh-muted">Try another word, or suggest the one you're looking for below.</p>
        <button type="button" class="btn btn-quiet mt-6" @click="clearFilters">Clear filters</button>
      </div>

      <aside class="suggest">
        <div>
          <h2 class="display suggest__title">Missing a community?</h2>
          <p class="suggest__text">
            If you run or love a tech group in Switzerland that meets regularly, email us at info@webzurich.ch and we'll add it here.
          </p>
        </div>
        <a :href="COMMUNITY_SUGGEST_URL" class="btn suggest__btn">
          <LucideMail :size="16" aria-hidden="true" /> Suggest a community
        </a>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import PageHero from "~/components/PageHero.vue";
import { COMMUNITIES, COMMUNITY_SUGGEST_URL, COMMUNITY_TOPICS, type Community } from "~/utils/communities";
import { normalize } from "~/composables/useSiteSearch";

const search = ref("");
const topic = ref<string | null>(null);
const city = ref<string | null>(null);

const sorted = [...COMMUNITIES].sort((a, b) => a.name.localeCompare(b.name, "de"));
const topics = COMMUNITY_TOPICS.filter((t) => sorted.some((c) => c.topic === t));

// Cities by how many groups meet there; "Switzerland" (nationwide) goes last
const cities = [...new Set(sorted.map((c) => c.city))].sort((a, b) => {
  if (a === "Switzerland") return 1;
  if (b === "Switzerland") return -1;
  const count = (x: string) => sorted.filter((c) => c.city === x).length;
  return count(b) - count(a) || a.localeCompare(b, "de");
});

const terms = computed(() => normalize(search.value.trim()).split(/\s+/).filter(Boolean));
const matchesSearch = (c: Community) => {
  if (!terms.value.length) return true;
  const haystack = normalize([c.name, c.city, c.topic, c.description].join(" "));
  return terms.value.every((term) => haystack.includes(term));
};
const matchesCity = (c: Community) => !city.value || c.city === city.value;

const visible = computed(() =>
  sorted.filter((c) => matchesSearch(c) && matchesCity(c) && (!topic.value || c.topic === topic.value))
);

// Each topic chip counts what you'd get by pressing it
const topicCounts = computed(() => {
  const base = sorted.filter((c) => matchesSearch(c) && matchesCity(c));
  const counts: Record<string, number> = { All: base.length };
  for (const c of base) counts[c.topic] = (counts[c.topic] ?? 0) + 1;
  return counts;
});

const groups = computed(() =>
  topics.map((t) => ({ topic: t, items: visible.value.filter((c) => c.topic === t) })).filter((g) => g.items.length)
);

const isFiltered = computed(() => !!(topic.value || city.value || search.value.trim()));
function clearFilters() {
  search.value = "";
  topic.value = null;
  city.value = null;
}

// A two-letter mark from the meaningful part of the name: "ZurichJS" becomes JS,
// "PyData Zurich" becomes PD, ".NET User Group Zürich" becomes NET
const FILLER = new Set(["zurich", "zürich", "swiss", "switzerland", "suisse", "user", "group", "meetup", "the", "of", "on", "and", "for", "in"]);
function mark(name: string) {
  const words = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w && !FILLER.has(w.toLowerCase()));
  const [first, second] = words.length ? words : [name];
  if (!second) return /^[A-Z]{2,3}$/.test(first!) ? first! : first!.slice(0, 2).replace(/^./, (c) => c.toUpperCase());
  return (first![0]! + second[0]!).toUpperCase();
}

// Three Zürich blues, picked from the name so a group keeps its colour
const TONES = ["#0070b4", "#00407c", "#2b8fd3"];
const toneOf = (name: string) => TONES[[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % TONES.length];

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const slug = (s: string) => `topic-${s.toLowerCase().replace(/[^a-z]+/g, "-")}`;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const lede = `Web Zürich is one evening a month. These ${COMMUNITIES.length} groups across Switzerland fill the rest of the calendar, from JavaScript to security.`;

useHead({ title: "Communities" });
</script>

<style scoped>
.filters {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-top: 2rem;
}
.filters__search {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: min(100%, 30rem);
  height: 3.25rem;
  margin-bottom: 0.25rem;
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
/* Cities are the secondary filter: no border until hovered or picked */
.chip--city:not([aria-pressed="true"]) {
  border-color: transparent;
  background: transparent;
  color: var(--color-zh-muted);
}
.chip--city:not([aria-pressed="true"]):hover {
  color: var(--color-zh-blue);
}

.list {
  max-width: 78rem;
  margin: clamp(3rem, 5vw, 4.5rem) auto 0;
  padding: 0 1rem clamp(5rem, 8vw, 8rem);
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

.group {
  padding-top: clamp(2.5rem, 4.5vw, 4rem);
}
.group__head {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0 0.5rem 1.25rem;
}
.group__title {
  font-size: clamp(2rem, 3.6vw, 3.25rem);
  line-height: 1.05;
}
.group__count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  gap: 1rem;
}
.grid > li {
  display: flex;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
  padding: 1.5rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 1px 2px rgb(0 12 31 / 0.04), 0 8px 24px -16px rgb(0 12 31 / 0.18);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.08),
    0 1px 2px rgb(0 12 31 / 0.05),
    0 14px 28px -14px rgb(0 12 31 / 0.28);
}
.card:focus-visible {
  border-radius: 1.75rem;
}
.card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.card__mark {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.125rem;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: transform 0.4s var(--ease-out-soft);
}
.card:hover .card__mark {
  transform: rotate(-6deg) scale(1.05);
}
.card__city {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.card__name {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.card:hover .card__name {
  color: var(--color-zh-blue);
}
.card__text {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-zh-muted);
  text-wrap: pretty;
}
.card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: auto;
  padding-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.card__arrow {
  transition: transform 0.3s var(--ease-out-soft);
}
.card:hover .card__arrow {
  transform: translate(2px, -2px);
}

.empty {
  padding-block: 4rem;
  text-align: center;
}

/* The one invitation on the page, in Zürich blue */
.suggest {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem 3rem;
  margin-top: clamp(4rem, 7vw, 6rem);
  padding: clamp(2rem, 4vw, 3.5rem);
  border-radius: var(--radius-frame);
  background: var(--color-zh-blue);
  color: #fff;
}
.suggest__title {
  font-size: clamp(2rem, 3.6vw, 3.25rem);
  line-height: 1.05;
  color: #fff;
}
.suggest__text {
  max-width: 34rem;
  margin-top: 0.75rem;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: rgb(255 255 255 / 0.85);
}
.suggest__btn {
  background: #fff;
  color: var(--color-zh-navy);
}
.suggest__btn:hover {
  background: var(--color-zh-soft);
}
</style>
