<template>
  <div v-if="speaker">
    <section class="frame profile">
      <div class="profile__inner">
        <div class="profile__photo" :style="{ '--tone': tone }">
          <img
            v-if="photo"
            :src="thumb(photo, 720)"
            :alt="name"
            width="360"
            height="360"
            :style="{ viewTransitionName: `speaker-${speaker.id}` }"
          />
          <span v-else aria-hidden="true">{{ initials(name) }}</span>
        </div>

        <div class="profile__text">
          <NuxtLink to="/speakers" class="back">
            <LucideArrowLeft :size="16" aria-hidden="true" />
            All speakers
          </NuxtLink>
          <h1 class="display profile__name">{{ name }}</h1>
          <p v-if="roleLine" class="lede profile__role">{{ roleLine }}</p>

          <ul class="stats">
            <li class="stat">
              <strong>{{ talks.length }}</strong> {{ talks.length === 1 ? "talk" : "talks" }}
            </li>
            <li v-if="videos" class="stat">
              <LucidePlay :size="12" fill="currentColor" class="text-zh-blue" aria-hidden="true" />
              <strong>{{ videos }}</strong> recorded
            </li>
            <li v-if="firstYear" class="stat">
              On stage since <strong>{{ firstYear }}</strong>
            </li>
          </ul>

          <ul class="links">
            <li v-for="link in links" :key="link.href">
              <a :href="link.href" target="_blank" rel="noopener me" class="pill">
                <component :is="link.icon" :size="16" aria-hidden="true" />
                {{ link.label }}
              </a>
            </li>
            <li>
              <button type="button" class="pill pill--ink" @click="share">
                <LucideShare2 :size="16" aria-hidden="true" />
                {{ shared ? "Link copied" : "Share profile" }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="content">
      <section v-if="bio" class="about" aria-labelledby="about-title">
        <h2 id="about-title" class="section-title">About</h2>
        <div>
          <p class="about__bio">{{ bio }}</p>
          <details v-if="sources.length" class="about__sources">
            <summary>Compiled from public sources<template v-if="speaker.profileAsOf"> ({{ speaker.profileAsOf }})</template></summary>
            <ul>
              <li v-for="src in sources" :key="src">
                <a :href="src" target="_blank" rel="noopener">{{ prettyUrl(src) }}</a>
              </li>
            </ul>
            <p>Something out of date? Write to <a :href="`mailto:${SPONSOR_EMAIL}`">{{ SPONSOR_EMAIL }}</a> and we'll fix it.</p>
          </details>
        </div>
      </section>

      <section class="talks" aria-labelledby="talks-title">
        <h2 id="talks-title" class="section-head">
          <span class="display section-head__title">{{ talks.length === 1 ? "Talk" : "Talks" }}</span>
          <span class="section-head__count">at Web Zürich, newest first</span>
        </h2>
        <ul class="grid">
          <li v-for="talk in talks" :key="talk.id">
            <TalkTile :talk="talk" :exclude="speaker.id" />
          </li>
        </ul>
      </section>

      <!-- The people they shared an evening with, so you can keep exploring -->
      <section v-if="peers.length" class="peers" aria-labelledby="peers-title">
        <h2 id="peers-title" class="section-head">
          <span class="display section-head__title">Shared the stage with</span>
          <span class="section-head__count">{{ peers.length }} {{ peers.length === 1 ? "speaker" : "speakers" }} on the same evenings</span>
        </h2>
        <ul class="peers__list">
          <li v-for="p in peers" :key="p.id">
            <NuxtLink :to="`/speakers/${p.id}`" class="peer">
              <Avatar :url="p.photo" :name="p.name" :size="44" />
              <span class="peer__name">{{ p.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <aside class="invite">
        <p class="invite__text">Have something to share? Web Zürich is always looking for speakers, first-timers included.</p>
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

<style scoped>
/* Hero: a big photo beside the name, stacked on small screens */
.profile__inner {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 4vw, 5rem);
  max-width: 72rem;
  margin-inline: auto;
  padding: clamp(6rem, 6.23vw, 9rem) clamp(1.5rem, 3vw, 3rem) clamp(3rem, 4.5vw, 6rem);
}
@media (max-width: 800px) {
  .profile__inner {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    text-align: center;
  }
}
.profile__photo {
  display: grid;
  place-items: center;
  width: clamp(12rem, 24vw, 24rem);
  aspect-ratio: 1;
  border-radius: clamp(1.75rem, 3vw, 3rem);
  overflow: hidden;
  background: var(--tone);
  color: #fff;
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.05), 0 7px 3.5px rgb(0 0 0 / 0.04), 0 15px 4.5px rgb(0 0 0 / 0.03), 0 27px 5.5px rgb(0 0 0 / 0.01);
}
.profile__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
.profile__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
@media (max-width: 800px) {
  .profile__text {
    align-items: center;
  }
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.back:hover {
  color: var(--color-zh-blue);
}
.profile__name {
  font-size: clamp(2.75rem, 5.5vw, 6.5rem);
  line-height: 1;
  text-wrap: balance;
}
.profile__role {
  margin-top: 1rem;
  font-size: clamp(1.125rem, 1.5vw, 1.75rem);
  line-height: 1.25;
  text-wrap: balance;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.75rem;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.7);
  font-size: 0.9375rem;
  color: var(--color-zh-muted);
}
.stat strong {
  font-weight: 600;
  color: var(--color-zh-navy);
  font-variant-numeric: tabular-nums;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
@media (max-width: 800px) {
  .stats,
  .links {
    justify-content: center;
  }
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.75rem;
  padding: 0 1.125rem;
  border-radius: 999px;
  background: #fff;
  font-weight: 500;
  color: var(--color-zh-navy);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
  transition: color 0.2s, background-color 0.2s;
}
.pill:hover {
  color: var(--color-zh-blue);
}
.pill--ink {
  background: var(--color-zh-navy);
  color: #fff;
}
.pill--ink:hover {
  background: var(--color-zh-ink);
  color: #fff;
}

.content {
  max-width: 78rem;
  margin: clamp(4rem, 7vw, 6rem) auto 0;
  padding: 0 1rem clamp(5rem, 8vw, 8rem);
}

/* About: a label column beside a large, readable bio */
.about {
  display: grid;
  grid-template-columns: 14rem minmax(0, 46rem);
  gap: 1rem 2rem;
  margin-inline: 0.5rem;
}
@media (max-width: 800px) {
  .about {
    grid-template-columns: minmax(0, 1fr);
  }
}
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.about__bio {
  font-size: clamp(1.25rem, 1.6vw, 1.5rem);
  line-height: 1.55;
  letter-spacing: -0.01em;
  color: var(--color-zh-ink);
  text-wrap: pretty;
}
.about__sources {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
.about__sources summary {
  width: fit-content;
  cursor: pointer;
}
.about__sources ul {
  display: grid;
  gap: 0.25rem;
  margin-block: 0.75rem;
}
.about__sources a {
  text-decoration: underline;
  text-underline-offset: 3px;
  word-break: break-all;
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 1rem;
  margin: 0 0.5rem 1.5rem;
}
.section-head__title {
  font-size: clamp(2.25rem, 4.5vw, 4rem);
  line-height: 1;
}
.section-head__count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}

.talks {
  margin-top: clamp(4rem, 7vw, 6rem);
}
.about + .talks {
  margin-top: clamp(5rem, 8vw, 7rem);
}
.content > .talks:first-child {
  margin-top: 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}
.grid > li {
  display: flex;
}

/* Peers as name pills with a face */
.peers {
  margin-top: clamp(5rem, 8vw, 7rem);
}
.peers__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-inline: 0.5rem;
}
.peer {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 1rem 0.25rem 0.25rem;
  border-radius: 999px;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.08);
  transition: background-color 0.2s, box-shadow 0.2s;
}
.peer:hover {
  background: var(--color-zh-soft);
  box-shadow: 0 0 0 1px transparent;
}
.peer :deep(.avatar) {
  max-width: none;
}
.peer__name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.peer:hover .peer__name {
  color: var(--color-zh-blue);
}

.invite {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-top: clamp(5rem, 8vw, 7rem);
  padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 3vw, 2.5rem);
  border-radius: 1.75rem;
  background: var(--color-zh-soft);
}
.invite__text {
  max-width: 36rem;
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--color-zh-navy);
}
</style>
