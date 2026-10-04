<template>
  <div>
    <PageHero
      title="Speakers"
      :lede="`${people.length} people have shared what they know on the Web Zürich stage. Pick someone to see their talks.`"
    >
      <label class="filter">
        <LucideSearch :size="18" class="text-zh-blue" aria-hidden="true" />
        <span class="sr-only">Search speakers</span>
        <input v-model="query" type="search" placeholder="Search by name, company or talk" autocomplete="off" />
      </label>
      <nav v-if="!terms.length" class="letters" aria-label="Jump to a letter">
        <a v-for="g in groups" :key="g.letter" :href="`#letter-${g.letter}`" class="letters__link">{{ g.letter }}</a>
      </nav>
    </PageHero>

    <div class="list">
      <!-- Searching shows one flat list of matches -->
      <template v-if="terms.length">
        <p class="status" aria-live="polite">
          {{ plural(matches.length, "speaker") }} match “{{ query.trim() }}”
          <button type="button" class="status__clear" @click="query = ''">
            <LucideX :size="14" aria-hidden="true" /> Clear
          </button>
        </p>
        <ul v-if="matches.length" class="grid">
          <li v-for="p in matches" :key="p.id"><SpeakerTile :person="p" /></li>
        </ul>
        <div v-else class="empty">
          <p class="heading text-2xl">Nobody matches that.</p>
          <p class="mt-2 text-zh-muted">Check the spelling, or try a company or a word from a talk title.</p>
        </div>
      </template>

      <template v-else>
        <!-- The people who keep coming back to the stage -->
        <section class="regulars" aria-labelledby="regulars-title">
          <h2 id="regulars-title" class="section-head">
            <span class="display section-head__title">Regulars</span>
            <span class="section-head__count">{{ regulars.length }} people with {{ REGULAR }} or more talks</span>
          </h2>
          <ul class="regulars__grid">
            <li v-for="p in regulars" :key="p.id">
              <NuxtLink :to="`/speakers/${p.id}`" class="regular">
                <span class="regular__photo" :style="{ '--tone': p.tone }">
                  <img
                    v-if="p.photo"
                    :src="thumb(p.photo, 360)"
                    :alt="p.name"
                    width="180"
                    height="180"
                    loading="lazy"
                    :style="{ viewTransitionName: `speaker-${p.id}` }"
                  />
                  <span v-else aria-hidden="true">{{ initials(p.name) }}</span>
                  <span class="regular__count" aria-hidden="true">{{ p.talks.length }}</span>
                </span>
                <span class="regular__body">
                  <span class="regular__name">{{ p.name }}<span class="sr-only">, {{ p.talks.length }} talks</span></span>
                  <span v-if="p.roleLine" class="regular__role">{{ p.roleLine }}</span>
                  <span class="regular__talks">
                    <span v-for="t in p.talks.slice(0, 3)" :key="t.id" class="regular__talk">
                      <LucidePlay v-if="t.youtubecode" :size="11" fill="currentColor" class="regular__play" aria-label="Recorded" />
                      <span class="regular__talk-name">{{ t.name.trim() }}</span>
                      <span class="regular__year">{{ yearOf(t) }}</span>
                    </span>
                  </span>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <section class="everyone" aria-labelledby="everyone-title">
          <h2 id="everyone-title" class="section-head">
            <span class="display section-head__title">Everyone</span>
            <span class="section-head__count">A to Z by first name</span>
          </h2>
          <section v-for="g in groups" :id="`letter-${g.letter}`" :key="g.letter" class="letter" :aria-label="g.letter">
            <h3 class="letter__head" aria-hidden="true">{{ g.letter }}</h3>
            <ul class="grid">
              <li v-for="p in g.people" :key="p.id"><SpeakerTile :person="p" /></li>
            </ul>
          </section>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from "vue";
import { NuxtLink } from "#components";
import { Play } from "lucide-vue-next";
import speakersQuery from "~/services/apollo/queries/speakers.gql";
import PageHero from "~/components/PageHero.vue";
import { normalize } from "~/composables/useSiteSearch";
import { initials } from "~/utils/assets";

interface Talk {
  id: string;
  name: string;
  youtubecode: string | null;
  createdAt: string;
  event: { date: string } | null;
}
interface Speaker {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  speakerPicture: { url: string; fileName: string | null } | null;
  talks: Talk[];
}
interface Person {
  id: string;
  name: string;
  roleLine: string;
  photo: string | null;
  tone: string;
  talks: Talk[];
  videos: number;
  latest: string;
  haystack: string;
}

// Three or more talks makes you a regular
const REGULAR = 3;
const TONES = ["#0070b4", "#00407c", "#2b8fd3"];

const thumb = useThumb();
const { data } = await useAsyncQuery<{ speakers: Speaker[] }>(speakersQuery);

const yearOf = (t: Talk) => (t.event?.date ?? t.createdAt).slice(0, 4);
const toneOf = (id: string) => TONES[[...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7) % TONES.length]!;

const people = computed<Person[]>(() =>
  (data.value?.speakers ?? [])
    .map((s) => {
      const talks = [...s.talks].sort((a, b) => (b.event?.date ?? b.createdAt).localeCompare(a.event?.date ?? a.createdAt));
      const roleLine = [s.role, s.company].filter(Boolean).join(", ");
      return {
        id: s.id,
        name: s.name.trim(),
        roleLine,
        // unicorn.jpg is the stand-in picture for speakers without a photo
        photo: s.speakerPicture?.url && s.speakerPicture.fileName !== "unicorn.jpg" ? s.speakerPicture.url : null,
        tone: toneOf(s.id),
        talks,
        videos: talks.filter((t) => t.youtubecode).length,
        latest: talks[0] ? yearOf(talks[0]) : "",
        haystack: normalize([s.name, roleLine, ...talks.map((t) => t.name)].join(" ")),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "de"))
);

// Most talks first, then the most recent
const regulars = computed(() =>
  people.value
    .filter((p) => p.talks.length >= REGULAR)
    .sort((a, b) => b.talks.length - a.talks.length || b.latest.localeCompare(a.latest))
);

const groups = computed(() => {
  const byLetter = new Map<string, Person[]>();
  for (const p of people.value) {
    const letter = normalize(p.name[0] ?? "#").toUpperCase();
    byLetter.set(letter, [...(byLetter.get(letter) ?? []), p]);
  }
  return [...byLetter].map(([letter, list]) => ({ letter, people: list }));
});

const query = ref("");
const terms = computed(() => normalize(query.value.trim()).split(/\s+/).filter(Boolean));
const matches = computed(() => people.value.filter((p) => terms.value.every((t) => p.haystack.includes(t))));

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// One tile in the grid: photo (or initials on Zürich blue), name, role and talks
const SpeakerTile = defineComponent({
  props: { person: { type: Object as () => Person, required: true } },
  setup(props) {
    return () => {
      const p = props.person;
      return h(NuxtLink, { to: `/speakers/${p.id}`, class: "tile-card" }, () => [
        h("span", { class: "tile-card__photo", style: { "--tone": p.tone } }, [
          p.photo
            ? h("img", {
                src: thumb(p.photo, 320),
                alt: p.name,
                width: 160,
                height: 160,
                loading: "lazy",
                style: { viewTransitionName: `speaker-${p.id}` },
              })
            : h("span", { "aria-hidden": "true" }, initials(p.name)),
        ]),
        h("span", { class: "tile-card__name" }, p.name),
        p.roleLine ? h("span", { class: "tile-card__role" }, p.roleLine) : null,
        h("span", { class: "tile-card__meta" }, [
          h("span", plural(p.talks.length, "talk")),
          p.videos ? h("span", { class: "tile-card__video" }, [h(Play, { size: 10, fill: "currentColor", "aria-hidden": "true" }), " Video"]) : null,
          p.latest ? h("span", { class: "tile-card__year" }, p.latest) : null,
        ]),
      ]);
    };
  },
});

useSeoMeta({
  title: () => `${people.value.length} Speakers`,
  description: "Everyone who has given a talk at Web Zürich, with their talks and recordings.",
  ogTitle: () => `${people.value.length} Speakers - Web Zürich`,
  ogDescription: "Everyone who has given a talk at Web Zürich, with their talks and recordings.",
});
</script>

<style scoped>
.filter {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: min(100%, 30rem);
  height: 3.25rem;
  margin-top: 2rem;
  padding-inline: 1.25rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--color-zh-line);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.filter:focus-within {
  border-color: var(--color-zh-blue);
  box-shadow: 0 0 0 4px rgb(0 112 180 / 0.15);
}
.filter input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  font-size: 1rem;
}
.filter input:focus {
  outline: none;
}

/* A to Z jump links */
.letters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  max-width: 40rem;
  margin-top: 1.25rem;
}
.letters__link {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: background-color 0.2s, color 0.2s;
}
.letters__link:hover {
  background: var(--color-zh-blue);
  color: #fff;
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
  margin: 0 0.5rem 1.5rem;
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
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.empty {
  padding-block: 4rem;
  text-align: center;
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 1rem;
  margin: 0 0.5rem 1.5rem;
}
.section-head__title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1;
}
.section-head__count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}

/* Regulars: bigger cards with their latest talks */
.regulars__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
  gap: 1rem;
}
.regulars__grid > li {
  display: flex;
}
.regular {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.25rem;
  width: 100%;
  padding: 0.75rem 1.5rem 0.75rem 0.75rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 1px 2px rgb(0 12 31 / 0.04), 0 8px 24px -16px rgb(0 12 31 / 0.18);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s;
}
.regular:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.08),
    0 1px 2px rgb(0 12 31 / 0.05),
    0 14px 28px -14px rgb(0 12 31 / 0.28);
}
.regular:focus-visible {
  border-radius: 1.75rem;
}
.regular__photo {
  position: relative;
  display: grid;
  place-items: center;
  width: 8.5rem;
  aspect-ratio: 1;
  border-radius: 1.25rem;
  background: var(--tone);
  color: #fff;
  font-size: 2rem;
  font-weight: 600;
}
.regular__photo img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
  object-position: top;
}
/* Talk count as a blue badge on the photo */
.regular__count {
  position: absolute;
  right: -0.375rem;
  bottom: -0.375rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--color-zh-blue);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 0 0 4px #fff;
}
.regular__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding-block: 0.5rem;
}
.regular__name {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.regular:hover .regular__name {
  color: var(--color-zh-blue);
}
.regular__role {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-zh-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.regular__talks {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.25rem;
  margin-top: auto;
  padding-top: 0.625rem;
}
.regular__talk {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-zh-ink);
}
.regular__play {
  flex: none;
  color: var(--color-zh-blue);
}
.regular__talk-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.regular__year {
  flex: none;
  margin-left: auto;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}

/* Everyone */
.everyone {
  margin-top: clamp(5rem, 8vw, 7rem);
}
.letter {
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 1rem;
  padding-top: 2rem;
  scroll-margin-top: 1rem;
}
@media (max-width: 640px) {
  .letter {
    grid-template-columns: minmax(0, 1fr);
  }
}
.letter__head {
  position: sticky;
  top: 1rem;
  align-self: start;
  padding-left: 0.5rem;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-zh-blue);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12.5rem), 1fr));
  gap: 1rem;
}
.grid > li {
  display: flex;
}

/* Tiles are rendered by SpeakerTile, so they're styled through :deep */
.grid :deep(.tile-card) {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5rem 0.5rem 1rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 1px 2px rgb(0 12 31 / 0.04), 0 8px 24px -16px rgb(0 12 31 / 0.18);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s;
}
.grid :deep(.tile-card:hover) {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.08),
    0 1px 2px rgb(0 12 31 / 0.05),
    0 14px 28px -14px rgb(0 12 31 / 0.28);
}
.grid :deep(.tile-card:focus-visible) {
  border-radius: 1.75rem;
}
.grid :deep(.tile-card__photo) {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  margin-bottom: 0.875rem;
  border-radius: 1.25rem;
  overflow: hidden;
  background: var(--tone);
  color: #fff;
  font-size: 2.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.grid :deep(.tile-card__photo img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.5s var(--ease-out-soft);
}
.grid :deep(.tile-card:hover .tile-card__photo img) {
  transform: scale(1.05);
}
.grid :deep(.tile-card__name) {
  padding-inline: 0.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.grid :deep(.tile-card:hover .tile-card__name) {
  color: var(--color-zh-blue);
}
.grid :deep(.tile-card__role) {
  margin-top: 0.25rem;
  padding-inline: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--color-zh-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.grid :deep(.tile-card__meta) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.625rem;
  margin-top: auto;
  padding: 0.75rem 0.5rem 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.grid :deep(.tile-card__video) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: rgb(0 112 180 / 0.1);
  color: var(--color-zh-blue);
}
.grid :deep(.tile-card__year) {
  margin-left: auto;
  font-weight: 500;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}
</style>
