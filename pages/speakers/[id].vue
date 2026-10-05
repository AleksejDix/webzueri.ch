<template>
  <div v-if="speaker">
    <section class="frame">
      <!-- Hero: a big photo beside the name, stacked on small screens -->
      <div
        class="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)] items-center gap-[clamp(2rem,4vw,5rem)] px-[clamp(1.5rem,3vw,3rem)] pt-[clamp(6rem,6.23vw,9rem)] pb-[clamp(3rem,4.5vw,6rem)] [@media(max-width:800px)]:grid-cols-1 [@media(max-width:800px)]:justify-items-center [@media(max-width:800px)]:text-center"
      >
        <div
          class="grid aspect-square w-[clamp(12rem,24vw,24rem)] place-items-center overflow-hidden rounded-[clamp(1.75rem,3vw,3rem)] bg-(--tone) text-[clamp(3rem,6vw,6rem)] font-semibold tracking-[-0.03em] text-white shadow-[0_2px_2px_rgb(var(--wz-shadow)/0.05),0_7px_3.5px_rgb(var(--wz-shadow)/0.04),0_15px_4.5px_rgb(var(--wz-shadow)/0.03),0_27px_5.5px_rgb(var(--wz-shadow)/0.01)]"
          :style="{ '--tone': tone }"
        >
          <img
            v-if="photo"
            :src="thumb(photo, 720)"
            :alt="name"
            width="360"
            height="360"
            class="size-full object-cover object-top"
            :style="{ viewTransitionName: `speaker-${speaker.id}` }"
          />
          <span v-else aria-hidden="true">{{ initials(name) }}</span>
        </div>

        <div class="flex min-w-0 flex-col items-start [@media(max-width:800px)]:items-center">
          <NuxtLink
            to="/speakers"
            class="mb-6 inline-flex items-center gap-1.5 rounded-full bg-raised px-3.5 py-1.5 text-[0.875rem] font-semibold text-heading transition-colors duration-200 ease-[ease] hover:text-link"
          >
            <LucideArrowLeft :size="16" aria-hidden="true" />
            All speakers
          </NuxtLink>
          <h1 class="display text-[clamp(2.75rem,5.5vw,6.5rem)] leading-none text-balance">{{ name }}</h1>
          <p v-if="roleLine" class="lede mt-4 text-[clamp(1.125rem,1.5vw,1.75rem)] leading-[1.25] text-balance">{{ roleLine }}</p>

          <ul class="mt-7 flex flex-wrap gap-2 [@media(max-width:800px)]:justify-center">
            <li class="inline-flex items-center gap-1.5 rounded-full bg-raised/70 px-3.5 py-2 text-[0.9375rem] text-muted">
              <strong class="font-semibold text-heading tabular-nums">{{ talks.length }}</strong> {{ talks.length === 1 ? "talk" : "talks" }}
            </li>
            <li v-if="videos" class="inline-flex items-center gap-1.5 rounded-full bg-raised/70 px-3.5 py-2 text-[0.9375rem] text-muted">
              <LucidePlay :size="12" fill="currentColor" class="text-link" aria-hidden="true" />
              <strong class="font-semibold text-heading tabular-nums">{{ videos }}</strong> recorded
            </li>
            <li v-if="firstYear" class="inline-flex items-center gap-1.5 rounded-full bg-raised/70 px-3.5 py-2 text-[0.9375rem] text-muted">
              On stage since <strong class="font-semibold text-heading tabular-nums">{{ firstYear }}</strong>
            </li>
          </ul>

          <ul class="mt-4 flex flex-wrap gap-2 [@media(max-width:800px)]:justify-center">
            <li v-for="link in links" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener me"
                class="inline-flex h-11 items-center gap-2 rounded-full bg-raised px-4.5 font-medium text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.06)] transition-[color,background-color] duration-200 ease-[ease] hover:text-link"
              >
                <component :is="link.icon" :size="16" aria-hidden="true" />
                {{ link.label }}
              </a>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex h-11 items-center gap-2 rounded-full bg-deep px-4.5 font-medium text-white shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.06)] transition-[color,background-color] duration-200 ease-[ease]"
                @click="share"
              >
                <LucideShare2 :size="16" aria-hidden="true" />
                {{ shared ? "Link copied" : "Share profile" }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="mx-auto mt-[clamp(4rem,7vw,6rem)] max-w-[78rem] px-4 pb-[clamp(5rem,8vw,8rem)]">
      <!-- About: a label column beside a large, readable bio -->
      <section
        v-if="bio"
        class="about mx-2 grid grid-cols-[14rem_minmax(0,46rem)] gap-x-8 gap-y-4 [@media(max-width:800px)]:grid-cols-1"
        aria-labelledby="about-title"
      >
        <h2 id="about-title" class="text-[1.125rem] font-semibold text-link">About</h2>
        <div>
          <p class="text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.55] tracking-[-0.01em] text-pretty text-ink">{{ bio }}</p>
          <details v-if="sources.length" class="mt-5 text-[0.875rem] text-muted">
            <summary class="w-fit cursor-pointer">Compiled from public sources<template v-if="speaker.profileAsOf"> ({{ speaker.profileAsOf }})</template></summary>
            <ul class="my-3 grid gap-1">
              <li v-for="src in sources" :key="src">
                <a :href="src" target="_blank" rel="noopener" class="break-all underline underline-offset-[3px]">{{ prettyUrl(src) }}</a>
              </li>
            </ul>
            <p>Something out of date? Write to <a :href="`mailto:${SPONSOR_EMAIL}`" class="break-all underline underline-offset-[3px]">{{ SPONSOR_EMAIL }}</a> and we'll fix it.</p>
          </details>
        </div>
      </section>

      <!-- Closer to the bio when there is one, flush at the top when there is not -->
      <section
        class="mt-[clamp(4rem,7vw,6rem)] first:mt-0 [.about+&]:mt-[clamp(5rem,8vw,7rem)]"
        aria-labelledby="talks-title"
      >
        <h2 id="talks-title" class="mx-2 mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span class="display text-[clamp(2.25rem,4.5vw,4rem)] leading-none">{{ talks.length === 1 ? "Talk" : "Talks" }}</span>
          <span class="text-[1rem] font-semibold text-muted">at Web Zürich, newest first</span>
        </h2>
        <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-4 *:flex">
          <li v-for="talk in talks" :key="talk.id">
            <TalkTile :talk="talk" :exclude="speaker.id" />
          </li>
        </ul>
      </section>

      <!-- The people they shared an evening with, so you can keep exploring: name pills with a face -->
      <section v-if="peers.length" class="mt-[clamp(5rem,8vw,7rem)]" aria-labelledby="peers-title">
        <h2 id="peers-title" class="mx-2 mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span class="display text-[clamp(2.25rem,4.5vw,4rem)] leading-none">Shared the stage with</span>
          <span class="text-[1rem] font-semibold text-muted">{{ peers.length }} {{ peers.length === 1 ? "speaker" : "speakers" }} on the same evenings</span>
        </h2>
        <ul class="mx-2 flex flex-wrap gap-2">
          <li v-for="p in peers" :key="p.id">
            <NuxtLink
              :to="`/speakers/${p.id}`"
              class="group/peer inline-flex items-center gap-2.5 rounded-full py-1 pr-4 pl-1 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08)] transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-soft hover:shadow-[0_0_0_1px_transparent]"
            >
              <Avatar :url="p.photo" :name="p.name" :size="44" class="max-w-none" />
              <span class="text-[0.9375rem] font-semibold text-heading transition-colors duration-200 ease-[ease] group-hover/peer:text-link">{{ p.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <aside
        class="mt-[clamp(5rem,8vw,7rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-tile bg-soft px-[clamp(1.5rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.25rem)]"
      >
        <p class="max-w-[36rem] text-[1.125rem] leading-[1.5] text-heading">Have something to share? Web Zürich is always looking for speakers, first-timers included.</p>
        <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="btn btn-primary">
          Submit a talk <LucideArrowUpRight :size="16" aria-hidden="true" />
        </a>
      </aside>
    </div>
  </div>

  <div v-else>
    <PageHero title="Speaker not found" lede="This speaker doesn't exist or was removed. Find them by name on the speakers page.">
      <NuxtLink to="/speakers" class="btn btn-primary mt-8">Browse all speakers</NuxtLink>
    </PageHero>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { AtSign, Cloud, Github, Globe, Linkedin, Twitter } from "lucide-vue-next";
import speakerQuery from "~/services/apollo/queries/speaker.gql";
import PageHero from "~/components/PageHero.vue";
import Avatar from "~/components/Avatar.vue";
import TalkTile from "~/components/TalkTile.vue";
import { SUBMIT_TALK_URL } from "~/composables/useSiteSearch";
import { SPONSOR_EMAIL } from "~/utils/sponsoring";
import { initials } from "~/utils/assets";

interface Picture {
  url: string;
  fileName?: string | null;
}
interface Person {
  id: string;
  name: string;
  speakerPicture: Picture | null;
}
interface Talk {
  id: string;
  name: string;
  youtubecode: string | null;
  category: string | null;
  createdAt: string;
  event: { id: string; date: string; talks: { speakers: Person[] }[] } | null;
  speakers: Person[];
}
interface Speaker extends Person {
  bio: string | null;
  twitterHandle: string | null;
  github: string | null;
  role: string | null;
  company: string | null;
  website: string | null;
  linkedIn: string | null;
  mastodon: string | null;
  bluesky: string | null;
  profileAsOf: string | null;
  profileSources: string | null;
  talks: Talk[];
}

const route = useRoute();
const id = route.params.id as string;
const thumb = useThumb();

const { data, error } = await useAsyncQuery<{ speaker: Speaker | null }>(speakerQuery, { id });
const speaker = computed(() => data.value?.speaker ?? null);

if (import.meta.server && !speaker.value && !error.value) {
  setResponseStatus(useRequestEvent(), 404);
}

// unicorn.jpg is the stand-in picture for speakers without a photo
const realPhoto = (p?: Picture | null) => (p?.url && p.fileName !== "unicorn.jpg" ? p.url : null);

const name = computed(() => speaker.value?.name.trim() ?? "");
const photo = computed(() => realPhoto(speaker.value?.speakerPicture));
const TONES = ["#0070b4", "#00407c", "#2b8fd3"];
const tone = computed(() => TONES[[...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % TONES.length]);

const dateOf = (t: Talk) => t.event?.date ?? t.createdAt;
// Newest first
const talks = computed(() => [...(speaker.value?.talks ?? [])].sort((a, b) => dateOf(b).localeCompare(dateOf(a))));
const videos = computed(() => talks.value.filter((t) => t.youtubecode).length);
const firstYear = computed(() => talks.value.map((t) => dateOf(t).slice(0, 4)).sort()[0]);

const bio = computed(() => (speaker.value?.bio ?? "").replace(/<[^>]+>/g, "").trim());
const roleLine = computed(() => [speaker.value?.role, speaker.value?.company].filter(Boolean).join(", "));
const sources = computed(() =>
  (speaker.value?.profileSources ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
);

// Everyone who spoke at the same meetups, most shared evenings first
const peers = computed(() => {
  const seen = new Map<string, { id: string; name: string; photo: string | null; together: number }>();
  for (const t of talks.value) {
    const evening = new Set<string>();
    for (const other of t.event?.talks ?? []) {
      for (const p of other.speakers) {
        if (p.id === id || p.name === "Organising team" || evening.has(p.id)) continue;
        evening.add(p.id);
        const entry = seen.get(p.id) ?? { id: p.id, name: p.name.trim(), photo: realPhoto(p.speakerPicture), together: 0 };
        entry.together++;
        seen.set(p.id, entry);
      }
    }
  }
  return [...seen.values()].sort((a, b) => b.together - a.together || a.name.localeCompare(b.name, "de")).slice(0, 24);
});

// twitterHandle holds either a bare handle or a full profile URL
function twitterUrl(handle: string) {
  if (handle.startsWith("http")) return handle.replace("twitter.com/@", "twitter.com/");
  return `https://twitter.com/${handle.replace("@", "")}`;
}

const links = computed(() => {
  const s = speaker.value;
  if (!s) return [];
  const out: { label: string; href: string; icon: unknown }[] = [];
  const github = s.github ? `https://github.com/${s.github.replace(/^.*github\.com\//, "")}` : "";
  if (s.website) out.push({ label: "Website", href: s.website, icon: Globe });
  if (s.linkedIn) out.push({ label: "LinkedIn", href: s.linkedIn, icon: Linkedin });
  if (github) out.push({ label: "GitHub", href: github, icon: Github });
  if (s.twitterHandle) out.push({ label: "X / Twitter", href: twitterUrl(s.twitterHandle), icon: Twitter });
  if (s.mastodon) out.push({ label: "Mastodon", href: s.mastodon, icon: AtSign });
  if (s.bluesky) out.push({ label: "Bluesky", href: s.bluesky, icon: Cloud });
  return out;
});

const prettyUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const shared = ref(false);
async function share() {
  const url = window.location.href;
  const title = `${name.value} at Web Zürich`;
  try {
    if (navigator.share) await navigator.share({ title, url });
    else {
      await navigator.clipboard.writeText(url);
      shared.value = true;
      setTimeout(() => (shared.value = false), 2500);
    }
  } catch {
    // The share sheet was dismissed
  }
}

const description = computed(
  () => bio.value || `${name.value} has given ${talks.value.length === 1 ? "a talk" : `${talks.value.length} talks`} at Web Zürich.`
);

// schema.org: a speaker's page is a profile of that person
if (speaker.value) {
  useSchemaOrg([
    defineWebPage({ "@type": "ProfilePage" }),
    definePerson({
      name: name.value,
      description: description.value,
      image: photo.value || undefined,
      jobTitle: roleLine.value || undefined,
    }),
  ]);
}

useSeoMeta({
  title: () => name.value || "Speaker not found",
  description: () => description.value,
  ogTitle: () => `${name.value} at Web Zürich`,
  ogDescription: () => description.value,
});

// Share card for LinkedIn, X and Slack previews
if (speaker.value) {
  defineOgImage("Speaker", {
    name: name.value,
    role: roleLine.value,
    photo: photo.value ?? "",
    talkCount: talks.value.length,
    latestTalk: talks.value[0]?.name?.trim() ?? "",
  });
}
</script>
