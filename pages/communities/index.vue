<template>
  <div>
    <PageHero title="Communities" :lede="lede">
      <div class="mt-8 grid w-full justify-items-center gap-3">
        <label
          class="mb-1 flex h-13 w-[min(100%,30rem)] items-center gap-2.5 rounded-full border border-line bg-raised px-5 transition-[border-color,box-shadow] duration-200 ease-[ease] focus-within:border-link focus-within:ring-4 focus-within:ring-link/15"
        >
          <LucideSearch :size="18" class="text-link" aria-hidden="true" />
          <span class="sr-only">Search communities</span>
          <input
            v-model="search"
            type="search"
            placeholder="Search by name, topic or city"
            autocomplete="off"
            class="h-full min-w-0 flex-1 bg-transparent text-[1rem] focus:outline-none"
          />
        </label>
        <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by topic">
          <button type="button" class="chip group" :aria-pressed="!topic" @click="topic = null">
            All <span class="text-[0.75rem] text-muted tabular-nums group-aria-pressed:text-on-strong/70">{{ topicCounts.All }}</span>
          </button>
          <button
            v-for="t in topics"
            :key="t"
            type="button"
            class="chip group"
            :aria-pressed="topic === t"
            @click="topic = topic === t ? null : t"
          >
            {{ t }} <span class="text-[0.75rem] text-muted tabular-nums group-aria-pressed:text-on-strong/70">{{ topicCounts[t] ?? 0 }}</span>
          </button>
        </div>
        <div v-if="cities.length > 1" class="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by city">
          <!-- Cities are the secondary filter: no border until hovered or picked -->
          <button
            v-for="c in cities"
            :key="c"
            type="button"
            class="chip not-aria-pressed:border-transparent not-aria-pressed:bg-transparent not-aria-pressed:text-muted not-aria-pressed:hover:text-link"
            :aria-pressed="city === c"
            @click="city = city === c ? null : c"
          >
            <LucideMapPin :size="12" aria-hidden="true" /> {{ c }}
          </button>
        </div>
      </div>
    </PageHero>

    <div class="mx-auto mt-[clamp(3rem,5vw,4.5rem)] max-w-312 px-4 pb-[clamp(5rem,8vw,8rem)]">
      <p class="mx-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] font-medium text-muted" aria-live="polite">
        <span>{{ plural(visible.length, "community", "communities") }}{{ isFiltered ? " match" : "" }}</span>
        <button
          v-if="isFiltered"
          type="button"
          class="inline-flex items-center gap-1 font-semibold text-link hover:text-accent-hover hover:underline hover:underline-offset-[0.2em]"
          @click="clearFilters"
        >
          <LucideX :size="14" aria-hidden="true" /> Clear filters
        </button>
      </p>

      <section v-for="group in groups" :key="group.topic" class="pt-[clamp(2.5rem,4.5vw,4rem)]" :aria-labelledby="slug(group.topic)">
        <h2 :id="slug(group.topic)" class="mx-2 mb-5 flex items-baseline gap-3">
          <span class="display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05]">{{ group.topic }}</span>
          <span class="text-[1rem] font-semibold text-muted tabular-nums">{{ group.items.length }}</span>
        </h2>
        <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-4">
          <li v-for="c in group.items" :key="c.url" class="flex">
            <a
              :href="c.url"
              target="_blank"
              rel="noopener"
              class="group flex w-full flex-col gap-2.5 rounded-tile bg-raised p-6 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_1px_2px_rgb(var(--wz-shadow)/0.04),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)] [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08),0_1px_2px_rgb(var(--wz-shadow)/0.05),0_14px_28px_-14px_rgb(var(--wz-shadow)/0.28)]"
            >
              <span class="mb-2 flex items-start justify-between gap-4">
                <span
                  class="grid size-14 place-items-center rounded-[1.125rem] text-[1.125rem] font-semibold tracking-[-0.02em] text-white transition-transform duration-400 ease-out-soft group-hover:scale-105 group-hover:-rotate-6"
                  :style="{ background: toneOf(c.name) }"
                  aria-hidden="true"
                >{{ mark(c.name) }}</span>
                <span class="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-[0.8125rem] font-semibold text-heading"><LucideMapPin :size="12" aria-hidden="true" />{{ c.city }}</span>
              </span>
              <span class="text-[1.25rem] leading-tight font-semibold tracking-[-0.015em] text-heading transition-colors duration-200 ease-[ease] group-hover:text-link">{{ c.name }}</span>
              <span class="text-[0.9375rem] leading-[1.55] text-pretty text-muted">{{ c.description }}</span>
              <span class="mt-auto inline-flex items-center gap-1 pt-3 text-[0.875rem] font-semibold text-link">
                {{ host(c.url) }}
                <LucideArrowUpRight
                  :size="16"
                  class="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span class="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </li>
        </ul>
      </section>

      <div v-if="!visible.length" class="py-16 text-center">
        <p class="heading text-2xl">No communities match.</p>
        <p class="mt-2 text-muted">Try another word, or suggest the one you're looking for below.</p>
        <button type="button" class="btn btn-quiet mt-6" @click="clearFilters">Clear filters</button>
      </div>

      <!-- The one invitation on the page, in Zürich blue -->
      <aside
        class="mt-[clamp(4rem,7vw,6rem)] flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-frame bg-accent p-[clamp(2rem,4vw,3.5rem)] text-white"
      >
        <div>
          <h2 class="display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] text-white">Missing a community?</h2>
          <p class="mt-3 max-w-136 text-[1.0625rem] leading-[1.55] text-[rgb(255_255_255/0.85)]">
            If you run or love a tech group in Switzerland that meets regularly, email us at info@webzurich.ch and we'll add it here.
          </p>
        </div>
        <a :href="COMMUNITY_SUGGEST_URL" class="btn bg-raised text-heading hover:bg-soft">
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
useSeoMeta({
  description: "Other tech meetups and communities in Switzerland, from JavaScript and design to data and AI, and how to find them.",
});
defineOgImage("Page", {
  kicker: "Web Zürich recommends",
  title: "Tech communities in Switzerland",
  description: "Other meetups worth your evening, from JavaScript and design to data and AI.",
});
</script>

