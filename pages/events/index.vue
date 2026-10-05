<template>
  <div>
    <PageHero title="Events" :lede="`Every Web Zürich meetup since ${firstYear}, newest first. ${eventsCount} so far.`">
      <!-- Next meetup, or an honest note when none is scheduled -->
      <div class="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-4 rounded-[1.75rem] bg-raised py-3 pr-3 pl-5 text-left shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
        <template v-if="next">
          <span class="grid size-14 place-items-center rounded-2xl bg-accent text-[0.75rem] leading-none font-semibold text-white">
            <span>{{ fmt(next.date, { month: "short" }) }}</span>
            <strong class="text-[1.375rem] font-semibold tracking-[-0.04em]">{{ fmt(next.date, { day: "numeric" }) }}</strong>
          </span>
          <span class="grid gap-0.5">
            <strong class="font-semibold text-heading">Next meetup: {{ fmt(next.date, { weekday: "long", day: "numeric", month: "long" }) }}</strong>
            <span class="text-[0.9375rem] text-muted">{{ [next.time && clock(next.time), venueName(next.venue)].filter(Boolean).join(", ") }}</span>
          </span>
          <a :href="next.meetupLink || MEETUP_URL" target="_blank" rel="noopener" class="btn btn-primary">Register on Meetup</a>
        </template>
        <template v-else>
          <span class="grid gap-0.5">
            <strong class="font-semibold text-heading">No meetup scheduled yet</strong>
            <span v-if="lastDate" class="text-[0.9375rem] text-muted">The last one was on {{ fmt(lastDate, { day: "numeric", month: "long", year: "numeric" }) }}.</span>
          </span>
          <a :href="MEETUP_URL" target="_blank" rel="noopener" class="btn btn-primary">Get notified on Meetup</a>
        </template>
      </div>

      <nav class="mt-7 flex flex-wrap justify-center gap-1.5" aria-label="Jump to a year">
        <a v-for="g in groups" :key="g.year" :href="`#year-${g.year}`" class="chip">
          {{ g.year }}
          <span class="text-[0.75rem] text-muted tabular-nums">{{ g.events.length }}</span>
        </a>
      </nav>
    </PageHero>

    <div class="mt-[clamp(3rem,5vw,4.5rem)] pt-2 pb-[clamp(5rem,8vw,8rem)]">
      <div class="mx-auto max-w-[62rem] px-4">
        <section v-for="group in groups" :id="`year-${group.year}`" :key="group.year" class="scroll-mt-4 pt-[clamp(3rem,5vw,4.5rem)]">
          <h2 class="mx-2 mb-5 flex items-baseline gap-4">
            <span class="display text-[clamp(3rem,6vw,5rem)] leading-none tabular-nums">{{ group.year }}</span>
            <span class="text-[1rem] font-semibold text-muted">{{ group.events.filter((e) => !isPlaceholder(e)).length }} meetups</span>
          </h2>

          <template v-for="event in group.events" :key="event.id">
            <!-- Placeholders like "No event in June" stay a quiet line -->
            <p v-if="isPlaceholder(event)" class="mx-2 mb-4 rounded-[1.25rem] border border-dashed border-line px-6 py-4 text-muted">
              <span class="mr-2 font-semibold text-ink">{{ fmt(event.date, { month: "long" }) }}</span>
              No meetup this month.
            </p>

            <article v-else class="mb-4 rounded-4xl bg-raised p-[clamp(1.25rem,2.5vw,2rem)] shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_1px_2px_rgb(var(--wz-shadow)/0.04),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)]">
              <header class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 [@media(max-width:720px)]:grid-cols-[auto_minmax(0,1fr)]">
                <!-- Zürich blue gives every evening a colour anchor -->
                <div class="grid size-19 place-items-center content-center rounded-[1.375rem] bg-accent leading-none text-white" aria-hidden="true">
                  <span class="text-[0.8125rem] font-semibold text-[rgb(255_255_255/0.85)]">{{ fmt(event.date, { month: "short" }) }}</span>
                  <span class="mt-1 text-[2rem] font-semibold tracking-[-0.05em]">{{ fmt(event.date, { day: "numeric" }) }}</span>
                </div>
                <div>
                  <h3 class="heading text-[clamp(1.25rem,2vw,1.625rem)] font-medium"><NuxtLink :to="`/events/${event.date}`" class="transition-[color] duration-200 ease-[ease] hover:text-(--wz-link)">{{ eventTitle(event) }}</NuxtLink></h3>
                  <p class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] text-muted">
                    <span>{{ fmt(event.date, { weekday: "long", day: "numeric", month: "long" }) }}</span>
                    <span v-if="event.time">{{ clock(event.time) }}</span>
                    <a v-if="event.venue?.googleMapsUrl" :href="event.venue.googleMapsUrl" target="_blank" rel="noopener" class="inline-flex items-center gap-1 hover:text-(--wz-link)">
                      <LucideMapPin :size="14" aria-hidden="true" />{{ venueName(event.venue) }}
                    </a>
                    <span v-else-if="event.venue" class="inline-flex items-center gap-1"><LucideMapPin :size="14" aria-hidden="true" />{{ venueName(event.venue) }}</span>
                    <span v-if="event.eventType === 'Digital'" class="rounded-full bg-soft px-2 py-0.5 text-[0.8125rem] font-semibold text-heading">Online</span>
                  </p>
                </div>
                <!-- The evening's speakers: faces make the list feel like people, not a log -->
                <div v-if="faces(event).length" class="flex pl-3 *:-ml-3 *:shadow-[0_0_0_3px_var(--wz-raised)] [@media(max-width:720px)]:col-span-full" aria-hidden="true">
                  <Avatar v-for="f in faces(event)" :key="f.id" :url="f.speakerPicture?.url" :name="f.name" :size="52" />
                </div>
              </header>

              <!-- Recordings in full colour -->
              <ul v-if="videos(event).length" class="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,10.5rem),1fr))] gap-2.5" aria-label="Recordings">
                <li v-for="talk in videos(event)" :key="talk.id">
                  <NuxtLink :to="`/talks/${talk.id}`" class="group relative block">
                    <span class="block aspect-video overflow-hidden rounded-2xl bg-deep *:transition-transform *:duration-500 *:ease-out-soft group-hover:*:scale-105"><YtThumb :id="talk.youtubecode!" alt="" /></span>
                    <span class="absolute bottom-2.5 left-2.5 grid size-7 place-items-center rounded-full bg-raised pl-[2px] text-(--wz-link)" aria-hidden="true"><LucidePlay :size="12" fill="currentColor" /></span>
                    <span class="sr-only">Watch: {{ talk.name }}</span>
                  </NuxtLink>
                </li>
              </ul>

              <ul v-if="realTalks(event).length" class="mt-5 grid gap-0.5">
                <li v-for="talk in realTalks(event)" :key="talk.id">
                  <TalkRow :talk="talk" compact />
                </li>
              </ul>

              <footer v-if="event.sponsors?.length || event.meetupLink || event.streamLink" class="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-5">
                <div v-if="event.sponsors?.length" class="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <span class="text-[0.8125rem] font-semibold text-muted">Supported by</span>
                  <a
                    v-for="sp in event.sponsors.filter((x) => x.logo?.url)"
                    :key="sp.id"
                    :href="sp.website"
                    target="_blank"
                    rel="noopener"
                    class="event__sponsor grid h-7 place-items-center"
                    :title="sp.name"
                  >
                    <SponsorLogo :src="sp.logo!.url" :alt="sp.name" :area="900" :max-width="90" />
                  </a>
                </div>
                <div class="flex gap-5">
                  <a v-if="event.streamLink" :href="event.streamLink" target="_blank" rel="noopener" class="text-[0.9375rem] font-bold tracking-[-0.01em] text-heading transition-[color] duration-200 ease-[ease] hover:text-(--wz-link)">Watch the stream</a>
                  <a v-if="event.meetupLink" :href="event.meetupLink" target="_blank" rel="noopener" class="text-[0.9375rem] font-bold tracking-[-0.01em] text-heading transition-[color] duration-200 ease-[ease] hover:text-(--wz-link)">Meetup page</a>
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
/* Sponsor logos are dimmed inside SponsorLogo; full strength on hover */
.event__sponsor:hover :deep(img) {
  opacity: 1;
}
</style>
