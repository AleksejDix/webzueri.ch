<template>
  <div>
    <section class="frame hero">
      <div class="hero__inner">
        <h1 class="hero__title"><HandwrittenTitle /></h1>
        <p class="lede hero__lede">Talks, speakers and meetups. Whatever you're looking for, start here.</p>
        <div class="hero__card">
          <HeroGallery :photos="gallery" />
          <div class="hero__ask">
            <AskBar variant="hero" />
          </div>
        </div>
      </div>
    </section>

    <!-- The one scroll-driven moment on the page -->
    <section class="statement" aria-label="Web Zürich in numbers">
      <RevealStatement :parts="statement" />
    </section>

    <section class="rows" aria-label="What you'll find here">
      <article class="row">
        <NuxtLink to="/speakers" class="row__tile tile faces" tabindex="-1" aria-hidden="true">
          <img v-for="s in faces" :key="s.id" :src="thumb(s.speakerPicture?.url, 160)" alt="" width="80" height="80" loading="lazy" />
        </NuxtLink>
        <div class="row__text">
          <h2 class="heading row__title">The people behind the talks.</h2>
          <p class="row__body">
            {{ speakerCount }} people have shared what they know on our stage. Find them and everything they presented.
          </p>
          <NuxtLink to="/speakers" class="row__link">Meet the speakers</NuxtLink>
        </div>
      </article>

      <article v-if="event" class="row">
        <a :href="event.meetupLink || MEETUP_URL" target="_blank" rel="noopener" class="row__tile tile datecard" tabindex="-1" aria-hidden="true">
          <span class="datecard__month">{{ fmt(event.date, { month: "long", year: "numeric" }) }}</span>
          <span class="datecard__day">{{ fmt(event.date, { day: "numeric" }) }}</span>
          <span class="datecard__venue">{{ event.venue ? [event.venue.name, event.venue.city].filter(Boolean).join(", ") : "Zürich" }}</span>
        </a>
        <div class="row__text">
          <h2 class="heading row__title">
            {{ upcoming ? "Next meetup" : "Last meetup" }}, {{ fmt(event.date, { weekday: "long", day: "numeric", month: "long" }) }}.
          </h2>
          <ul class="row__talks">
            <li v-for="talk in event.talks" :key="talk.id">
              <NuxtLink :to="`/talks/${talk.id}`" class="row__talk">
                <span class="row__talk-title">{{ talk.name.trim() }}</span>
                <span class="text-zh-muted">{{ talk.speakers.map((s) => s.name).join(", ") }}</span>
              </NuxtLink>
            </li>
          </ul>
          <a :href="event.meetupLink || MEETUP_URL" target="_blank" rel="noopener" class="row__link">
            {{ upcoming ? "Register on Meetup" : "Get notified about the next one" }}
          </a>
        </div>
      </article>

      <article class="row">
        <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="row__tile tile stage" tabindex="-1" aria-hidden="true">
          <span class="stage__mic"><LucideMic :size="36" /></span>
        </a>
        <div class="row__text">
          <h2 class="heading row__title">Your turn on stage.</h2>
          <p class="row__body">
            Anyone can apply to speak, whether it's your first talk or your fiftieth. Send us your idea through a short form.
          </p>
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="row__link">Submit a talk</a>
        </div>
      </article>
    </section>

    <SpeakerSpotlight :total="speakerCount" />

    <HomeSponsors :sponsors="data?.sponsors ?? []" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import homeQuery from "~/services/apollo/queries/home.gql";
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/composables/useSiteSearch";
import AskBar from "~/components/AskBar.vue";
import RevealStatement from "~/components/RevealStatement.vue";
import SpeakerSpotlight from "~/components/SpeakerSpotlight.vue";
import HomeSponsors from "~/components/HomeSponsors.vue";

const thumb = useThumb();
const { data } = await useAsyncQuery<any>(homeQuery);

const event = computed(() => data.value?.events?.[0] ?? null);
const talkCount = computed(() => data.value?.talksConnection?.aggregate?.count ?? 0);
const speakerCount = computed(() => data.value?.speakersConnection?.aggregate?.count ?? 0);
const eventCount = computed(() => data.value?.eventsConnection?.aggregate?.count ?? 0);
const since = computed(() => data.value?.firstEvent?.[0]?.date?.slice(0, 4) ?? "2016");

const today = new Date().toISOString().slice(0, 10);
const upcoming = computed(() => !!event.value && event.value.date >= today);

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

// Unique speaker faces from the latest meetup first, then recent talks
const faces = computed(() => {
  const seen = new Map<string, any>();
  const pool = [
    ...(event.value?.talks ?? []).flatMap((t: any) => t.speakers),
    ...(data.value?.recent ?? []).flatMap((t: any) => t.speakers),
  ];
  for (const s of pool) if (s.speakerPicture?.url && !seen.has(s.id)) seen.set(s.id, s);
  return [...seen.values()].slice(0, 9);
});

const statement = computed(() => [
  `Since ${since.value}, ${speakerCount.value} speakers`,
  { faces: faces.value.slice(0, 3).map((s: any) => thumb(s.speakerPicture.url, 128)) },
  `have given ${talkCount.value} talks at ${eventCount.value} meetups in Zürich. Entry is free, and anyone can apply to speak`,
  { icon: "mic" as const },
]);


// Our own meetup photos (from the Meetup group albums), shown as a slideshow in the hero
const august = "the August 2025 meetup";
const january = "the January 2026 meetup";
const gallery = [
  { src: "/img/people.jpeg", alt: "Web Zürich members talking after a meetup" },
  { src: "/img/gallery/01-2025-08.webp", alt: `Attendees laughing together at ${august}` },
  { src: "/img/gallery/02-2026-01.webp", alt: `Attendees chatting at ${january}` },
  { src: "/img/gallery/03-2025-08.webp", alt: `A full room listening at ${august}` },
  { src: "/img/gallery/04-2026-01.webp", alt: `Drinks and conversation at ${january}` },
  { src: "/img/gallery/05-2025-08.webp", alt: `A group talking on the stairs at ${august}` },
  { src: "/img/gallery/06-2026-01.webp", alt: `The audience listening at ${january}` },
  { src: "/img/gallery/07-2025-08.webp", alt: `The audience reacting to a talk at ${august}` },
  { src: "/img/gallery/08-2026-01.webp", alt: `Attendees in conversation at ${january}` },
  { src: "/img/gallery/09-2025-08.webp", alt: `Two attendees talking at ${august}` },
  { src: "/img/gallery/10-2026-01.webp", alt: `A packed room at ${january}` },
  { src: "/img/gallery/11-2025-08.webp", alt: `Smiling faces in the audience at ${august}` },
  { src: "/img/gallery/12-2026-01.webp", alt: `Two attendees in conversation at ${january}` },
  { src: "/img/gallery/13-2025-08.webp", alt: `The audience on the stairs at ${august}` },
  { src: "/img/gallery/14-2026-01.webp", alt: `The audience at ${january}` },
  { src: "/img/gallery/15-2025-08.webp", alt: `Conversations over drinks at ${august}` },
  { src: "/img/gallery/16-2026-01.webp", alt: `An attendee listening closely at ${january}` },
  { src: "/img/gallery/17-2025-08.webp", alt: `People standing and talking at ${august}` },
  { src: "/img/gallery/18-2026-01.webp", alt: `A speaker presenting at ${january}` },
  { src: "/img/gallery/19-2025-08.webp", alt: `The audience at ${august}` },
  { src: "/img/gallery/20-2025-08.webp", alt: `Listening to a talk at ${august}` },
];

useSeoMeta({
  title: "Web Zürich: meetups, talks and speakers",
  description:
    "Zürich's web community: free monthly meetups and the people who give the talks. Find a talk, a speaker or the next meetup.",
  ogTitle: "Web Zürich",
  ogDescription: "Free monthly meetups and the people who give the talks.",
  ogImage: "https://webzurich.ch/icon.png",
  twitterCard: "summary_large_image",
});
</script>

<style scoped>
.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 144px above and below, as on america.gov. Their controls row only exists with several photos */
  padding: clamp(6rem, 6.23vw, 9rem) clamp(1rem, 1.38vw, 2rem);
  text-align: center;
}
/* The title is drawn by hand, so its size is a width rather than a font size */
.hero__title {
  width: min(100%, clamp(18rem, 50vw, 64rem));
  margin-inline: auto;
}
.hero__lede {
  margin-top: clamp(1.25rem, 1.8vw, 2.5rem);
  font-size: clamp(1.125rem, 1.44vw, 2.25rem);
  line-height: 1.1;
  animation: rise 1s var(--ease-out-soft) 0.1s both;
}
/* 56vw wide at 3:2, radius 64px and the search bar 16px from the top, as on america.gov */
.hero__card {
  position: relative;
  /* Room for the slideshow buttons under the card */
  margin-bottom: 3.5rem;
  width: min(100%, max(40rem, 56.34vw));
  aspect-ratio: 3 / 2;
  margin-top: clamp(2rem, 2.6vw, 3.75rem);
  border-radius: clamp(1.5rem, 2.77vw, 4rem);
  box-shadow:
    0 2px 2px rgb(0 0 0 / 0.05),
    0 7px 3.5px rgb(0 0 0 / 0.04),
    0 15px 4.5px rgb(0 0 0 / 0.03),
    0 27px 5.5px rgb(0 0 0 / 0.01);
  animation: rise 1.1s var(--ease-out-soft) 0.2s both;
}
.hero__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
.hero__ask {
  position: absolute;
  inset: 1rem 7.68% auto;
  z-index: 2;
}
@media (max-width: 640px) {
  .hero__card {
    aspect-ratio: 4 / 5;
  }
  .hero__ask {
    inset-inline: 0.75rem;
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
}

.statement {
  padding: clamp(5rem, 11.86vw, 17.125rem) 1.5rem clamp(5rem, 14.6vw, 21.125rem);
}

/* 448px tile, 136px gutter, 308px text and 120px between rows */
.rows {
  display: grid;
  gap: clamp(4rem, 5.2vw, 7.5rem);
  padding-inline: 1.5rem;
}
.row {
  display: grid;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}
@media (min-width: 768px) {
  .row {
    grid-template-columns: minmax(0, 28rem) minmax(0, 19.25rem);
    column-gap: clamp(2.5rem, 5.9vw, 8.5rem);
  }
}
.row__tile {
  display: block;
  aspect-ratio: 1;
  border-radius: 19.2%;
  transition: transform 0.5s var(--ease-out-soft);
}
.row__tile:hover {
  transform: translateY(-4px);
}
.row__title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.row__body {
  margin-block: 1.5rem 2rem;
  font-size: 1.125rem;
  line-height: 1.45;
  color: var(--color-zh-muted);
}
.row__link {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.row__link:hover {
  color: var(--color-zh-blue);
}
.row__talks {
  display: grid;
  gap: 0.875rem;
  margin-block: 1.25rem 1.5rem;
}
.row__talk {
  display: grid;
  line-height: 1.4;
}
.row__talk-title {
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.row__talk:hover .row__talk-title {
  color: var(--color-zh-blue);
}

/* Tile contents */
.faces {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
  padding: 1.75rem;
  background: var(--color-zh-soft);
}
.faces img {
  width: 82%;
  aspect-ratio: 1;
  border-radius: 999px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 10px 24px -12px rgb(0 12 31 / 0.45);
}
.datecard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: var(--color-zh-blue);
  color: #fff;
  text-align: center;
}
.datecard__month {
  font-size: 1.0625rem;
  font-weight: 600;
}
.datecard__day {
  font-variation-settings: "opsz" 32;
  font-size: clamp(7rem, 17vw, 10.5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.06em;
}
.datecard__venue {
  max-width: 15rem;
  font-size: 0.9375rem;
  color: rgb(255 255 255 / 0.85);
}
.stage {
  display: grid;
  place-items: center;
  background: var(--color-zh-soft);
}
.stage__mic {
  display: grid;
  place-items: center;
  width: 6rem;
  height: 6rem;
  border-radius: 999px;
  background: var(--color-zh-blue);
  color: #fff;
  box-shadow: 0 0 0 1.25rem rgb(0 112 180 / 0.08), 0 0 0 2.5rem rgb(0 112 180 / 0.05);
}

</style>
