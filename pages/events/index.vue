<template>
  <div>
    <PageHero title="Events" :lede="`Every Web Zürich meetup since ${firstYear}, newest first. ${eventsCount} so far.`">
      <!-- Next meetup, or an honest note when none is scheduled -->
      <div class="next">
        <template v-if="next">
          <span class="next__date">
            <span>{{ fmt(next.date, { month: "short" }) }}</span>
            <strong>{{ fmt(next.date, { day: "numeric" }) }}</strong>
          </span>
          <span class="next__text">
            <strong>Next meetup: {{ fmt(next.date, { weekday: "long", day: "numeric", month: "long" }) }}</strong>
            <span>{{ [next.time && clock(next.time), venueName(next.venue)].filter(Boolean).join(", ") }}</span>
          </span>
          <a :href="next.meetupLink || MEETUP_URL" target="_blank" rel="noopener" class="btn btn-primary">Register on Meetup</a>
        </template>
        <template v-else>
          <span class="next__text">
            <strong>No meetup scheduled yet</strong>
            <span v-if="lastDate">The last one was on {{ fmt(lastDate, { day: "numeric", month: "long", year: "numeric" }) }}.</span>
          </span>
          <a :href="MEETUP_URL" target="_blank" rel="noopener" class="btn btn-primary">Get notified on Meetup</a>
        </template>
      </div>

      <nav class="years" aria-label="Jump to a year">
        <a v-for="g in groups" :key="g.year" :href="`#year-${g.year}`" class="chip">
          {{ g.year }}
          <span class="chip__count">{{ g.events.length }}</span>
        </a>
      </nav>
    </PageHero>

    <div class="band">
      <div class="list">
        <section v-for="group in groups" :id="`year-${group.year}`" :key="group.year" class="year">
          <h2 class="year__head">
            <span class="display year__title">{{ group.year }}</span>
            <span class="year__count">{{ group.events.filter((e) => !isPlaceholder(e)).length }} meetups</span>
          </h2>

          <template v-for="event in group.events" :key="event.id">
            <!-- Placeholders like "No event in June" stay a quiet line -->
            <p v-if="isPlaceholder(event)" class="skip">
              <span class="skip__month">{{ fmt(event.date, { month: "long" }) }}</span>
              No meetup this month.
            </p>

            <article v-else class="event">
              <header class="event__head">
                <div class="event__date" aria-hidden="true">
                  <span class="event__month">{{ fmt(event.date, { month: "short" }) }}</span>
                  <span class="event__day">{{ fmt(event.date, { day: "numeric" }) }}</span>
                </div>
                <div class="event__heading">
                  <h3 class="heading event__title"><NuxtLink :to="`/events/${event.date}`" class="event__link">{{ eventTitle(event) }}</NuxtLink></h3>
                  <p class="event__meta">
                    <span>{{ fmt(event.date, { weekday: "long", day: "numeric", month: "long" }) }}</span>
                    <span v-if="event.time">{{ clock(event.time) }}</span>
                    <a v-if="event.venue?.googleMapsUrl" :href="event.venue.googleMapsUrl" target="_blank" rel="noopener" class="event__venue">
                      <LucideMapPin :size="14" aria-hidden="true" />{{ venueName(event.venue) }}
                    </a>
                    <span v-else-if="event.venue" class="event__venue"><LucideMapPin :size="14" aria-hidden="true" />{{ venueName(event.venue) }}</span>
                    <span v-if="event.eventType === 'Digital'" class="event__online">Online</span>
                  </p>
                </div>
                <!-- The evening's speakers: faces make the list feel like people, not a log -->
                <div v-if="faces(event).length" class="event__faces" aria-hidden="true">
                  <Avatar v-for="f in faces(event)" :key="f.id" :url="f.speakerPicture?.url" :name="f.name" :size="52" />
                </div>
              </header>

              <ul v-if="videos(event).length" class="event__videos" aria-label="Recordings">
                <li v-for="talk in videos(event)" :key="talk.id">
                  <NuxtLink :to="`/talks/${talk.id}`" class="video">
                    <span class="video__thumb"><YtThumb :id="talk.youtubecode!" alt="" /></span>
                    <span class="video__play" aria-hidden="true"><LucidePlay :size="12" fill="currentColor" /></span>
                    <span class="sr-only">Watch: {{ talk.name }}</span>
                  </NuxtLink>
                </li>
              </ul>

              <ul v-if="realTalks(event).length" class="event__talks">
                <li v-for="talk in realTalks(event)" :key="talk.id">
                  <TalkRow :talk="talk" compact />
                </li>
              </ul>

              <footer v-if="event.sponsors?.length || event.meetupLink || event.streamLink" class="event__foot">
                <div v-if="event.sponsors?.length" class="event__sponsors">
                  <span class="event__label">Supported by</span>
                  <a
                    v-for="sp in event.sponsors.filter((x) => x.logo?.url)"
                    :key="sp.id"
                    :href="sp.website"
                    target="_blank"
                    rel="noopener"
                    class="event__sponsor"
                    :title="sp.name"
                  >
                    <SponsorLogo :src="sp.logo!.url" :alt="sp.name" :area="900" :max-width="90" />
                  </a>
                </div>
                <div class="event__links">
                  <a v-if="event.streamLink" :href="event.streamLink" target="_blank" rel="noopener" class="row-link">Watch the stream</a>
                  <a v-if="event.meetupLink" :href="event.meetupLink" target="_blank" rel="noopener" class="row-link">Meetup page</a>
                </div>
              </footer>
            </article>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import publishedEventsQuery from "~/services/apollo/queries/publishedEvents.gql";
import PageHero from "~/components/PageHero.vue";
import TalkRow from "~/components/TalkRow.vue";
import SponsorLogo from "~/components/SponsorLogo.vue";
import Avatar from "~/components/Avatar.vue";
import YtThumb from "~/components/YtThumb.vue";
import { MEETUP_URL } from "~/composables/useSiteSearch";

interface Venue {
  name: string;
  city: string | null;
  googleMapsUrl?: string | null;
}
interface Event {
  id: string;
  date: string;
  time: string | null;
  title: string | null;
  eventType: string | null;
  meetupLink: string | null;
  streamLink: string | null;
  venue: Venue | null;
  talks: { id: string; name: string; youtubecode: string | null; category: string | null; speakers: { id: string; name: string; speakerPicture: { url: string } | null }[] }[];
  sponsors: { id: string; name: string; website: string; logo: { url: string } | null }[];
}

const today = new Date().toISOString().split("T")[0];

const { data } = await useAsyncQuery<{
  events: Event[];
  next: (Omit<Event, "talks" | "sponsors"> & { venue: Venue | null })[];
}>(publishedEventsQuery, { date: today });

// All meetups on one page, newest first, grouped by year
const events = computed(() => data.value?.events ?? []);
const eventsCount = computed(() => events.value.filter((e) => !isPlaceholder(e)).length);
const next = computed(() => data.value?.next?.[0] ?? null);
const lastDate = computed(() => events.value[0]?.date ?? null);
const firstYear = computed(() => events.value.at(-1)?.date.slice(0, 4) ?? "2016");

const groups = computed(() => {
  const out: { year: string; events: Event[] }[] = [];
  for (const e of events.value) {
    const year = e.date.slice(0, 4);
    const last = out.at(-1);
    if (last?.year === year) last.events.push(e);
    else out.push({ year, events: [e] });
  }
  return out;
});

// Old links like /events?page=3 (10 meetups per page) land on the year that page started with
const route = useRoute();
onMounted(() => {
  const oldPage = Number(route.query.page);
  if (!oldPage || oldPage < 2 || route.hash) return;
  const first = events.value[(oldPage - 1) * 10];
  if (first) document.getElementById(`year-${first.date.slice(0, 4)}`)?.scrollIntoView();
});

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
const venueName = (v: Venue | null) => (v ? [v.name, v.city && !v.name.includes(v.city) ? v.city : null].filter(Boolean).join(", ") : "");
// Hygraph has times as "1900" and as "18:30"
const clock = (t: string) => (t.includes(":") ? t : `${t.slice(0, 2)}:${t.slice(2)}`);
const isPlaceholder = (e: Event) => /^no event/i.test(e.title ?? "");
const eventTitle = (e: Event) => e.title || `Web Zürich, ${fmt(e.date, { month: "long", year: "numeric" })}`;
// Up to five distinct speakers of the evening, photos first
const faces = (e: Event) => {
  const seen = new Map<string, Event["talks"][number]["speakers"][number]>();
  for (const t of realTalks(e)) for (const sp of t.speakers) if (!seen.has(sp.id)) seen.set(sp.id, sp);
  return [...seen.values()].sort((a, b) => Number(!!b.speakerPicture) - Number(!!a.speakerPicture)).slice(0, 5);
};
const videos = (e: Event) => realTalks(e).filter((t) => t.youtubecode);
// "Organising team" entries are notices, not talks
const realTalks = (e: Event) => e.talks.filter((t) => !t.speakers.some((s) => /organising team/i.test(s.name)));

useSeoMeta({
  title: "Events",
  description: () => `Every Web Zürich meetup since ${firstYear.value}: talks, speakers, venues and sponsors.`,
});
defineOgImage("Page", {
  title: "Every meetup",
  description: `Every Web Zürich meetup since ${firstYear.value}: talks, speakers, venues and sponsors.`,
});
</script>

<style scoped>
.next {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem 1.25rem;
  margin-top: 2rem;
  padding: 0.75rem 0.75rem 0.75rem 1.25rem;
  border-radius: 1.75rem;
  background: #fff;
  text-align: left;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}
.next__date {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: var(--color-zh-blue);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}
.next__date strong {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}
.next__text {
  display: grid;
  gap: 0.125rem;
}
.next__text strong {
  font-weight: 600;
  color: var(--color-zh-navy);
}
.next__text span {
  font-size: 0.9375rem;
  color: var(--color-zh-muted);
}

.years {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1.75rem;
}
.chip__count {
  font-size: 0.75rem;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}

.band {
  margin-top: clamp(3rem, 5vw, 4.5rem);
  padding-block: 0.5rem clamp(5rem, 8vw, 8rem);
}
.list {
  max-width: 62rem;
  margin: 0 auto;
  padding-inline: 1rem;
}
.year {
  padding-top: clamp(3rem, 5vw, 4.5rem);
  scroll-margin-top: 1rem;
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

.event {
  margin-bottom: 1rem;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 1px 2px rgb(0 12 31 / 0.04), 0 8px 24px -16px rgb(0 12 31 / 0.18);
}
.event__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.25rem;
}
@media (max-width: 720px) {
  .event__head {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .event__faces {
    grid-column: 1 / -1;
  }
}
/* Zürich blue gives every evening a colour anchor */
.event__date {
  display: grid;
  place-items: center;
  align-content: center;
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 1.375rem;
  background: var(--color-zh-blue);
  color: #fff;
  line-height: 1;
}
.event__month {
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.85);
}
.event__day {
  margin-top: 0.25rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.05em;
}
.event__title {
  font-size: clamp(1.25rem, 2vw, 1.625rem);
  font-weight: 500;
}
.event__link {
  transition: color 0.2s;
}
.event__link:hover {
  color: var(--color-zh-blue);
}
.event__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 1rem;
  margin-top: 0.375rem;
  font-size: 0.9375rem;
  color: var(--color-zh-muted);
}
.event__venue {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
a.event__venue:hover {
  color: var(--color-zh-blue);
}
.event__online {
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.event__faces {
  display: flex;
  padding-left: 0.75rem;
}
.event__faces > * {
  margin-left: -0.75rem;
  box-shadow: 0 0 0 3px #fff;
}

/* Recordings in full colour */
.event__videos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 10.5rem), 1fr));
  gap: 0.625rem;
  margin-top: 1.5rem;
}
.video {
  position: relative;
  display: block;
}
.video__thumb {
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--color-zh-navy);
}
.video__thumb :deep(img) {
  transition: transform 0.5s var(--ease-out-soft);
}
.video:hover .video__thumb :deep(img) {
  transform: scale(1.05);
}
.video__play {
  position: absolute;
  left: 0.625rem;
  bottom: 0.625rem;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  padding-left: 2px;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-blue);
}

.event__talks {
  display: grid;
  gap: 0.125rem;
  margin-top: 1.25rem;
}
.event__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-zh-line);
}
.event__sponsors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
}
.event__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}
.event__sponsor {
  display: grid;
  place-items: center;
  height: 1.75rem;
}
.event__sponsor:hover :deep(img) {
  opacity: 1;
}
.event__links {
  display: flex;
  gap: 1.25rem;
}
.row-link {
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.row-link:hover {
  color: var(--color-zh-blue);
}

.skip {
  margin: 0 0.5rem 1rem;
  padding: 1rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px dashed var(--color-zh-line);
  color: var(--color-zh-muted);
}
.skip__month {
  margin-right: 0.5rem;
  font-weight: 600;
  color: var(--color-zh-ink);
}

</style>
