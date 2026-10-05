<template>
  <div>
    <PageHero
      title="Speakers"
      :lede="`${people.length} people have shared what they know on the Web Zürich stage. Pick someone to see their talks.`"
    >
      <label
        class="mt-8 flex h-13 w-[min(100%,30rem)] items-center gap-2.5 rounded-full border border-line bg-raised px-5 transition-[border-color,box-shadow] duration-200 ease-[ease] focus-within:border-link focus-within:ring-4 focus-within:ring-link/15"
      >
        <LucideSearch :size="18" class="text-link" aria-hidden="true" />
        <span class="sr-only">Search speakers</span>
        <input
          v-model="query"
          type="search"
          placeholder="Search by name, company or talk"
          autocomplete="off"
          class="h-full min-w-0 flex-1 bg-transparent text-[1rem] focus:outline-none"
        />
      </label>
      <!-- A to Z jump links -->
      <nav v-if="!terms.length" class="mt-5 flex max-w-[40rem] flex-wrap justify-center gap-1" aria-label="Jump to a letter">
        <a
          v-for="g in groups"
          :key="g.letter"
          :href="`#letter-${g.letter}`"
          class="grid size-8 place-items-center rounded-full text-[0.875rem] font-semibold text-heading transition-colors duration-200 ease-[ease] hover:bg-accent hover:text-white"
          >{{ g.letter }}</a
        >
      </nav>
    </PageHero>

    <div class="mx-auto mt-[clamp(3rem,5vw,4.5rem)] max-w-[78rem] px-4 pb-[clamp(5rem,8vw,8rem)]">
      <!-- Searching shows one flat list of matches -->
      <template v-if="terms.length">
        <p class="mx-2 mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] font-medium text-muted" aria-live="polite">
          {{ plural(matches.length, "speaker") }} match “{{ query.trim() }}”
          <button
            type="button"
            class="inline-flex items-center gap-1 font-semibold text-link hover:underline hover:underline-offset-[0.2em]"
            @click="query = ''"
          >
            <LucideX :size="14" aria-hidden="true" /> Clear
          </button>
        </p>
        <ul v-if="matches.length" class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,12.5rem),1fr))] gap-4 *:flex">
          <li v-for="p in matches" :key="p.id"><SpeakerTile :person="p" /></li>
        </ul>
        <div v-else class="py-16 text-center">
          <p class="heading text-2xl">Nobody matches that.</p>
          <p class="mt-2 text-muted">Check the spelling, or try a company or a word from a talk title.</p>
        </div>
      </template>

      <template v-else>
        <!-- The people who keep coming back to the stage -->
        <section aria-labelledby="regulars-title">
          <h2 id="regulars-title" class="mx-2 mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span class="display text-[clamp(2.5rem,5vw,4.5rem)] leading-none">Regulars</span>
            <span class="text-[1rem] font-semibold text-muted">{{ regulars.length }} people with {{ REGULAR }} or more talks</span>
          </h2>
          <!-- Regulars: bigger cards with their latest talks -->
          <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,24rem),1fr))] gap-4 *:flex">
            <li v-for="p in regulars" :key="p.id">
              <NuxtLink
                :to="`/speakers/${p.id}`"
                class="group/card grid w-full grid-cols-[auto_minmax(0,1fr)] gap-5 rounded-tile bg-raised py-3 pr-6 pl-3 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_1px_2px_rgb(var(--wz-shadow)/0.04),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)] [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08),0_1px_2px_rgb(var(--wz-shadow)/0.05),0_14px_28px_-14px_rgb(var(--wz-shadow)/0.28)]"
              >
                <span
                  class="relative grid aspect-square w-34 place-items-center rounded-[1.25rem] bg-(--tone) text-[2rem] font-semibold text-white"
                  :style="{ '--tone': p.tone }"
                >
                  <img
                    v-if="p.photo"
                    :src="thumb(p.photo, 360)"
                    :alt="p.name"
                    width="180"
                    height="180"
                    loading="lazy"
                    class="size-full rounded-[inherit] object-cover object-top"
                    :style="{ viewTransitionName: `speaker-${p.id}` }"
                  />
                  <span v-else aria-hidden="true">{{ initials(p.name) }}</span>
                  <!-- Talk count as a blue badge on the photo -->
                  <span
                    class="absolute -right-1.5 -bottom-1.5 grid size-9 place-items-center rounded-full bg-accent text-[1rem] font-bold text-white shadow-[0_0_0_4px_var(--wz-raised)]"
                    aria-hidden="true"
                    >{{ p.talks.length }}</span>
                </span>
                <span class="flex min-w-0 flex-col gap-1 py-2">
                  <span class="text-[1.25rem] font-semibold tracking-[-0.015em] text-heading transition-colors duration-200 ease-[ease] group-hover/card:text-link">{{ p.name }}<span class="sr-only">, {{ p.talks.length }} talks</span></span>
                  <span v-if="p.roleLine" class="line-clamp-2 text-[0.875rem] leading-[1.4] text-muted">{{ p.roleLine }}</span>
                  <span class="mt-auto grid grid-cols-1 gap-1 pt-2.5">
                    <span v-for="t in p.talks.slice(0, 3)" :key="t.id" class="flex min-w-0 items-baseline gap-1.5 text-[0.8125rem] text-ink">
                      <LucidePlay v-if="t.youtubecode" :size="11" fill="currentColor" class="flex-none text-link" aria-label="Recorded" />
                      <span class="min-w-0 truncate">{{ t.name.trim() }}</span>
                      <span class="ml-auto flex-none text-muted tabular-nums">{{ yearOf(t) }}</span>
                    </span>
                  </span>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <section class="mt-[clamp(5rem,8vw,7rem)]" aria-labelledby="everyone-title">
          <h2 id="everyone-title" class="mx-2 mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span class="display text-[clamp(2.5rem,5vw,4.5rem)] leading-none">Everyone</span>
            <span class="text-[1rem] font-semibold text-muted">A to Z by first name</span>
          </h2>
          <section
            v-for="g in groups"
            :id="`letter-${g.letter}`"
            :key="g.letter"
            class="grid scroll-mt-4 grid-cols-[4.5rem_minmax(0,1fr)] gap-4 pt-8 [@media(max-width:640px)]:grid-cols-1"
            :aria-label="g.letter"
          >
            <h3
              class="sticky top-4 self-start pl-2 text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.04em] text-link"
              aria-hidden="true"
            >{{ g.letter }}</h3>
            <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,12.5rem),1fr))] gap-4 *:flex">
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

// One tile in the grid: photo (or initials on Zürich blue), name, role and talks.
// Rendered with h(), so the Tailwind classes live in these strings
const tile = {
  card: "group/tile flex w-full flex-col rounded-tile bg-raised px-2 pt-2 pb-4 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_1px_2px_rgb(var(--wz-shadow)/0.04),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)] [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08),0_1px_2px_rgb(var(--wz-shadow)/0.05),0_14px_28px_-14px_rgb(var(--wz-shadow)/0.28)]",
  photo: "mb-3.5 grid aspect-square place-items-center overflow-hidden rounded-[1.25rem] bg-(--tone) text-[2.25rem] font-semibold tracking-[-0.02em] text-white",
  img: "size-full object-cover object-top transition-transform duration-500 ease-out-soft group-hover/tile:scale-105",
  name: "px-2 text-[1.0625rem] leading-[1.25] font-semibold tracking-[-0.01em] text-heading transition-colors duration-200 ease-[ease] group-hover/tile:text-link",
  role: "mt-1 line-clamp-2 px-2 text-[0.8125rem] leading-[1.4] text-muted",
  meta: "mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-2 pt-3 text-[0.8125rem] font-semibold text-heading",
  video: "inline-flex items-center gap-1 rounded-full bg-link/10 px-2 py-0.5 text-link",
  year: "ml-auto font-medium text-muted tabular-nums",
};
const SpeakerTile = defineComponent({
  props: { person: { type: Object as () => Person, required: true } },
  setup(props) {
    return () => {
      const p = props.person;
      return h(NuxtLink, { to: `/speakers/${p.id}`, class: tile.card }, () => [
        h("span", { class: tile.photo, style: { "--tone": p.tone } }, [
          p.photo
            ? h("img", {
                src: thumb(p.photo, 320),
                alt: p.name,
                width: 160,
                height: 160,
                loading: "lazy",
                class: tile.img,
                style: { viewTransitionName: `speaker-${p.id}` },
              })
            : h("span", { "aria-hidden": "true" }, initials(p.name)),
        ]),
        h("span", { class: tile.name }, p.name),
        p.roleLine ? h("span", { class: tile.role }, p.roleLine) : null,
        h("span", { class: tile.meta }, [
          h("span", plural(p.talks.length, "talk")),
          p.videos ? h("span", { class: tile.video }, [h(Play, { size: 10, fill: "currentColor", "aria-hidden": "true" }), " Video"]) : null,
          p.latest ? h("span", { class: tile.year }, p.latest) : null,
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
defineOgImage("Page", {
  title: `${people.value.length} speakers`,
  description: "Everyone who has given a talk at Web Zürich, with their talks and recordings.",
});
</script>
