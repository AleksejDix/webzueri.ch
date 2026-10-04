<template>
  <div v-if="event">
    <section class="frame hero">
      <div class="hero__inner">
        <NuxtLink to="/events" class="back">
          <LucideArrowLeft :size="16" aria-hidden="true" />
          All meetups
        </NuxtLink>

        <div class="hero__main">
          <div class="datetile" aria-hidden="true">
            <span class="datetile__month">{{ fmt({ month: "short" }) }}</span>
            <span class="datetile__day">{{ fmt({ day: "numeric" }) }}</span>
            <span class="datetile__year">{{ fmt({ year: "numeric" }) }}</span>
          </div>
          <div class="hero__text">
            <p v-if="event.edition" class="hero__edition">Meetup #{{ event.edition }}</p>
            <h1 class="display hero__title">{{ title }}</h1>
            <ul class="facts">
              <li>
                <LucideCalendarDays :size="18" aria-hidden="true" />
                <time :datetime="times.start">{{ fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }) }}</time>
              </li>
              <li v-if="time">
                <LucideClock :size="18" aria-hidden="true" />
                Doors open {{ time }}
              </li>
              <li v-if="event.venue">
                <LucideMapPin :size="18" aria-hidden="true" />
                {{ venueLine(event.venue) }}
              </li>
              <li v-else-if="online">
                <LucideMonitor :size="18" aria-hidden="true" />
                Online
              </li>
            </ul>
          </div>
        </div>

        <div class="actions">
          <a v-if="upcoming && event.meetupLink" :href="event.meetupLink" target="_blank" rel="noopener" class="btn btn-primary">
            RSVP on Meetup <LucideArrowUpRight :size="16" aria-hidden="true" />
          </a>
          <a v-if="upcoming" :href="calendarPath(event.date)" class="btn btn-quiet" download>
            <LucideCalendarPlus :size="16" aria-hidden="true" /> Add to calendar
          </a>
          <a v-if="event.venue?.googleMapsUrl" :href="event.venue.googleMapsUrl" target="_blank" rel="noopener" class="btn btn-quiet">
            <LucideNavigation :size="16" aria-hidden="true" /> Directions
          </a>
          <a v-if="event.streamLink" :href="event.streamLink" target="_blank" rel="noopener" class="btn btn-quiet">
            <LucidePlay :size="14" fill="currentColor" aria-hidden="true" /> Watch the stream
          </a>
          <a v-if="!upcoming && event.meetupLink" :href="event.meetupLink" target="_blank" rel="noopener" class="btn btn-quiet">
            Meetup page <LucideArrowUpRight :size="16" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <div class="content">
      <!-- The evening in order: a real sequence, so the talks are numbered -->
      <section class="programme" aria-labelledby="programme-title">
        <h2 id="programme-title" class="section-title">Programme</h2>
        <ol class="agenda">
          <li class="agenda__item agenda__item--quiet">
            <span class="agenda__when">{{ time || "Evening" }}</span>
            <div>
              <h3 class="agenda__title">Doors open</h3>
              <p class="agenda__text">Grab a drink, find a seat and say hello.</p>
            </div>
          </li>

          <li v-for="(talk, i) in talks" :key="talk.id" class="agenda__item">
            <span class="agenda__when agenda__when--number" aria-hidden="true">{{ i + 1 }}</span>
            <div class="agenda__body">
              <h3 class="agenda__title">
                <NuxtLink :to="`/talks/${talk.id}`" class="agenda__link">{{ talk.name.trim() }}</NuxtLink>
              </h3>
              <ul class="agenda__speakers">
                <li v-for="s in talk.speakers" :key="s.id">
                  <NuxtLink :to="`/speakers/${s.id}`" class="speaker">
                    <Avatar :url="photoOf(s.speakerPicture)" :name="s.name" :size="40" />
                    <span>
                      <span class="speaker__name">{{ s.name.trim() }}</span>
                      <span v-if="s.role || s.company" class="speaker__role">{{ [s.role, s.company].filter(Boolean).join(", ") }}</span>
                    </span>
                  </NuxtLink>
                </li>
              </ul>
              <p v-if="summary(talk.abstract)" class="agenda__text">{{ summary(talk.abstract) }}</p>
              <NuxtLink v-if="talk.youtubecode" :to="`/talks/${talk.id}`" class="agenda__video">
                <LucidePlay :size="12" fill="currentColor" aria-hidden="true" /> Watch the recording
              </NuxtLink>
            </div>
          </li>

          <li v-if="!talks.length" class="agenda__item agenda__item--quiet">
            <span class="agenda__when">Talks</span>
            <div>
              <h3 class="agenda__title">To be announced</h3>
              <p class="agenda__text">
                Want to be on stage?
                <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="text-link">Submit a talk</a>.
              </p>
            </div>
          </li>

          <li class="agenda__item agenda__item--quiet">
            <span class="agenda__when">After</span>
            <div>
              <h3 class="agenda__title">Food, drinks and conversation</h3>
              <p class="agenda__text">Stay as long as you like. This is where most of the community happens.</p>
            </div>
          </li>
        </ol>
      </section>

      <aside class="side">
        <section v-if="event.venue" class="panel" aria-labelledby="venue-title">
          <h2 id="venue-title" class="panel__title">Venue</h2>
          <p class="panel__name">{{ event.venue.name }}</p>
          <p v-if="venueAddress(event.venue)" class="panel__text">{{ venueAddress(event.venue) }}</p>
          <a v-if="event.venue.googleMapsUrl" :href="event.venue.googleMapsUrl" target="_blank" rel="noopener" class="text-link panel__link">
            Open in Maps
          </a>
        </section>

        <section v-if="sponsors.length" class="panel" aria-labelledby="sponsors-title">
          <h2 id="sponsors-title" class="panel__title">Made possible by</h2>
          <ul class="logos">
            <li v-for="sp in sponsors" :key="sp.id">
              <a :href="sp.website" target="_blank" rel="noopener" class="logos__link" :title="sp.name">
                <SponsorLogo :src="sp.logo!.url" :alt="sp.name" :area="1800" :max-width="120" />
              </a>
            </li>
          </ul>
        </section>

        <section class="panel panel--free">
          <p class="panel__text">Free to attend, and everyone follows our <NuxtLink to="/code-of-conduct" class="text-link">Code of Conduct</NuxtLink>.</p>
        </section>
      </aside>
    </div>

    <section v-if="photos.length" class="photos" aria-labelledby="photos-title">
      <h2 id="photos-title" class="section-title">Photos</h2>
      <ul class="photos__grid">
        <li v-for="p in photos" :key="p.id">
          <NuxtImg :src="p.image.url" :alt="p.caption || ''" sizes="100vw sm:50vw lg:33vw" format="webp" quality="72" loading="lazy" class="photos__img" />
        </li>
      </ul>
    </section>

    <nav class="pager" aria-label="Other meetups">
      <NuxtLink v-if="previous" :to="meetupPath(previous.date)" class="pager__link">
        <LucideArrowLeft :size="16" aria-hidden="true" />
        <span>
          <span class="pager__label">Previous meetup</span>
          <span class="pager__title">{{ meetupTitle(previous) }}</span>
        </span>
      </NuxtLink>
      <NuxtLink v-if="next" :to="meetupPath(next.date)" class="pager__link pager__link--next">
        <span>
          <span class="pager__label">Next meetup</span>
          <span class="pager__title">{{ meetupTitle(next) }}</span>
        </span>
        <LucideArrowRight :size="16" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </div>

  <div v-else>
    <PageHero title="Meetup not found" lede="There was no Web Zürich meetup on this date. Every meetup since 2016 is on the events page.">
      <NuxtLink to="/events" class="btn btn-primary mt-8">All meetups</NuxtLink>
    </PageHero>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import meetupQuery from "~/services/apollo/queries/meetup.gql";
import PageHero from "~/components/PageHero.vue";
import Avatar from "~/components/Avatar.vue";
import SponsorLogo from "~/components/SponsorLogo.vue";
import { SUBMIT_TALK_URL } from "~/composables/useSiteSearch";
import {
  calendarPath,
  clock,
  isPlaceholder,
  meetupPath,
  meetupTimes,
  meetupTitle,
  venueAddress,
  venueLine,
  type MeetupVenue,
} from "~/utils/meetups";

interface Picture {
  url: string;
  fileName?: string | null;
}
interface Talk {
  id: string;
  name: string;
  abstract: string | null;
  youtubecode: string | null;
  speakers: { id: string; name: string; role: string | null; company: string | null; speakerPicture: Picture | null }[];
}
interface Meetup {
  id: string;
  date: string;
  time: string | null;
  title: string | null;
  eventType: string | null;
  edition: number | null;
  meetupLink: string | null;
  streamLink: string | null;
  venue: MeetupVenue | null;
  talks: Talk[];
  sponsors: { id: string; name: string; website: string; logo: { url: string } | null }[];
}
interface Result {
  events: Meetup[];
  previous: { date: string; title: string | null }[];
  next: { date: string; title: string | null }[];
  photos: { id: string; caption: string | null; image: { url: string; width: number; height: number } }[];
}

const route = useRoute();
const date = String(route.params.date);
const valid = /^\d{4}-\d{2}-\d{2}$/.test(date);

const { data } = valid ? await useAsyncQuery<Result>(meetupQuery, { date }) : { data: ref<Result | null>(null) };

const event = computed(() => {
  const e = data.value?.events?.[0];
  return e && !isPlaceholder(e) ? e : null;
});
if (import.meta.server && !event.value) setResponseStatus(useRequestEvent(), 404);

const previous = computed(() => data.value?.previous?.[0] ?? null);
const next = computed(() => data.value?.next?.[0] ?? null);
const photos = computed(() => data.value?.photos ?? []);

const title = computed(() => (event.value ? meetupTitle(event.value) : ""));
const time = computed(() => clock(event.value?.time));
const times = computed(() => meetupTimes(date, event.value?.time));
const online = computed(() => event.value?.eventType === "Digital");
const upcoming = computed(() => date >= new Date().toISOString().slice(0, 10));

// "Organising team" entries are notices, not talks
const talks = computed(() => (event.value?.talks ?? []).filter((t) => !t.speakers.some((s) => /organising team/i.test(s.name))));
const sponsors = computed(() => (event.value?.sponsors ?? []).filter((s) => s.logo?.url));

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

// unicorn.jpg is the stand-in picture for speakers without a photo
const photoOf = (p: Picture | null) => (p?.url && p.fileName !== "unicorn.jpg" ? p.url : null);

// First couple of sentences of a talk description
function summary(text: string | null) {
  const plain = (text ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= 260) return plain;
  const cut = plain.slice(0, 260);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(". ") + 1, cut.lastIndexOf(" ")))}…`;
}

const description = computed(() => {
  if (!event.value) return "";
  const who = talks.value.flatMap((t) => t.speakers.map((s) => s.name.trim()));
  const parts = [`${fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" })}`, venueLine(event.value.venue)];
  return `${parts.filter(Boolean).join(", ")}.${who.length ? ` Talks by ${who.join(", ")}.` : ""} Free to attend.`;
});

useSeoMeta({
  title: () => (event.value ? title.value : "Meetup not found"),
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
});

// schema.org Event, so the meetup can show up in Google's event listings
useHead(() => {
  const e = event.value;
  if (!e) return {};
  const url = `https://webzurich.ch${meetupPath(e.date)}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title.value,
    description: description.value,
    startDate: times.value.start,
    endDate: times.value.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online.value ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: online.value
      ? { "@type": "VirtualLocation", url: e.streamLink || e.meetupLink || url }
      : e.venue
        ? {
            "@type": "Place",
            name: e.venue.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: e.venue.street ?? undefined,
              postalCode: e.venue.zip ?? undefined,
              addressLocality: e.venue.city ?? "Zürich",
              addressCountry: "CH",
            },
          }
        : undefined,
    image: photos.value[0]?.image.url ? [photos.value[0].image.url] : undefined,
    organizer: { "@type": "Organization", name: "Web Zürich", url: "https://webzurich.ch" },
    performer: talks.value.flatMap((t) => t.speakers.map((s) => ({ "@type": "Person", name: s.name.trim() }))),
    offers: { "@type": "Offer", price: 0, priceCurrency: "CHF", availability: "https://schema.org/InStock", url: e.meetupLink || url },
    url,
  };
  return { script: [{ type: "application/ld+json", innerHTML: JSON.stringify(ld) }] };
});
</script>

<style scoped>
.hero__inner {
  max-width: 72rem;
  margin-inline: auto;
  padding: clamp(6rem, 6.23vw, 9rem) clamp(1.5rem, 3vw, 3rem) clamp(3rem, 4.5vw, 5rem);
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
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
.hero__main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);
  margin-top: 2rem;
}
/* A big Zürich-blue calendar leaf */
.datetile {
  display: grid;
  place-items: center;
  align-content: center;
  width: clamp(8rem, 12vw, 11rem);
  aspect-ratio: 1;
  border-radius: clamp(1.75rem, 2.5vw, 2.5rem);
  background: var(--color-zh-blue);
  color: #fff;
  line-height: 1;
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.05), 0 7px 3.5px rgb(0 0 0 / 0.04), 0 15px 4.5px rgb(0 0 0 / 0.03);
}
.datetile__month {
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  font-weight: 600;
  color: rgb(255 255 255 / 0.85);
}
.datetile__day {
  margin-top: 0.375rem;
  font-size: clamp(3.5rem, 6vw, 5rem);
  font-weight: 600;
  letter-spacing: -0.05em;
}
.datetile__year {
  margin-top: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgb(255 255 255 / 0.75);
}
.hero__text {
  flex: 1;
  min-width: min(100%, 20rem);
}
.hero__edition {
  font-weight: 600;
  color: var(--color-zh-blue);
}
.hero__title {
  margin-top: 0.25rem;
  font-size: clamp(2.5rem, 5vw, 5.5rem);
  line-height: 1;
  text-wrap: balance;
}
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin-top: 1.25rem;
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  color: var(--color-zh-ink);
}
.facts li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.facts :deep(svg) {
  color: var(--color-zh-blue);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20rem;
  gap: clamp(2rem, 4vw, 4rem);
  max-width: 72rem;
  margin: clamp(4rem, 7vw, 6rem) auto 0;
  padding-inline: clamp(1rem, 3vw, 3rem);
}
@media (max-width: 900px) {
  .content {
    grid-template-columns: minmax(0, 1fr);
  }
}
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}

/* Programme: a timeline with the time or the talk number on the left */
.agenda {
  position: relative;
  display: grid;
  gap: 2.25rem;
  margin-top: 1.5rem;
}
.agenda::before {
  content: "";
  position: absolute;
  top: 1.5rem;
  bottom: 1.5rem;
  left: calc(2.25rem - 1px);
  width: 2px;
  border-radius: 2px;
  background: var(--color-zh-line);
}
.agenda__item {
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 1.25rem;
}
.agenda__when {
  justify-self: center;
  z-index: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
  box-shadow: 0 0 0 6px #fff;
  height: fit-content;
}
.agenda__when--number {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  background: var(--color-zh-blue);
  color: #fff;
  font-size: 1.125rem;
}
.agenda__title {
  font-size: clamp(1.25rem, 2vw, 1.625rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
  text-wrap: balance;
}
.agenda__item--quiet .agenda__title {
  font-size: 1.125rem;
}
.agenda__link {
  transition: color 0.2s;
}
.agenda__link:hover {
  color: var(--color-zh-blue);
}
.agenda__speakers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin-top: 0.875rem;
}
.speaker {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}
.speaker > span {
  display: grid;
}
.speaker__name {
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.speaker:hover .speaker__name {
  color: var(--color-zh-blue);
}
.speaker__role {
  font-size: 0.8125rem;
  color: var(--color-zh-muted);
}
.agenda__text {
  margin-top: 0.75rem;
  max-width: 40rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-zh-muted);
}
.agenda__item--quiet .agenda__text {
  margin-top: 0.25rem;
}
.agenda__video {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.875rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  background: rgb(0 112 180 / 0.1);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-blue);
  transition: background-color 0.2s, color 0.2s;
}
.agenda__video:hover {
  background: var(--color-zh-blue);
  color: #fff;
}

.side {
  display: grid;
  align-content: start;
  gap: 1rem;
}
.panel {
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: var(--color-zh-soft);
}
.panel__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.panel__name {
  margin-top: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.panel__text {
  margin-top: 0.25rem;
  line-height: 1.5;
  color: var(--color-zh-ink);
}
.panel--free .panel__text {
  margin-top: 0;
  font-size: 0.9375rem;
}
.panel__link {
  display: inline-block;
  margin-top: 0.75rem;
}
.logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 1rem;
}
.logos__link {
  display: flex;
  align-items: center;
  height: 2.5rem;
}

.photos {
  max-width: 72rem;
  margin: clamp(4rem, 7vw, 6rem) auto 0;
  padding-inline: clamp(1rem, 3vw, 3rem);
}
.photos__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.photos__img {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 1.25rem;
  object-fit: cover;
}

.pager {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  max-width: 72rem;
  margin: clamp(4rem, 7vw, 6rem) auto 0;
  padding: 0 clamp(1rem, 3vw, 3rem) clamp(5rem, 8vw, 8rem);
}
.pager__link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.08);
  transition: background-color 0.2s, box-shadow 0.2s;
}
.pager__link:hover {
  background: var(--color-zh-soft);
  box-shadow: 0 0 0 1px transparent;
}
.pager__link--next {
  margin-left: auto;
  text-align: right;
}
.pager__link > span {
  display: grid;
}
.pager__label {
  font-size: 0.8125rem;
  color: var(--color-zh-muted);
}
.pager__title {
  font-weight: 600;
  color: var(--color-zh-navy);
}
</style>
