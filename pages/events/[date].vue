<template>
  <div v-if="event">
    <section class="frame">
      <div class="mx-auto max-w-6xl px-[clamp(1.5rem,3vw,3rem)] pt-[clamp(6rem,6.23vw,9rem)] pb-[clamp(3rem,4.5vw,5rem)]">
        <NuxtLink to="/events" class="inline-flex items-center gap-1.5 rounded-full bg-raised px-3.5 py-1.5 text-[0.875rem] font-semibold text-heading transition-[color] duration-200 ease-[ease] hover:text-(--wz-link)">
          <LucideArrowLeft :size="16" aria-hidden="true" />
          All meetups
        </NuxtLink>

        <div class="mt-8 flex flex-wrap items-center gap-[clamp(1.5rem,3vw,3rem)]">
          <!-- A big Zürich-blue calendar leaf -->
          <div class="grid aspect-square w-[clamp(8rem,12vw,11rem)] place-items-center content-center rounded-[clamp(1.75rem,2.5vw,2.5rem)] bg-accent leading-none text-white shadow-[0_2px_2px_rgb(0_0_0/0.05),0_7px_3.5px_rgb(0_0_0/0.04),0_15px_4.5px_rgb(0_0_0/0.03)]" aria-hidden="true">
            <span class="text-[clamp(1rem,1.4vw,1.25rem)] font-semibold text-[rgb(255_255_255/0.85)]">{{ fmt({ month: "short" }) }}</span>
            <span class="mt-1.5 text-[clamp(3.5rem,6vw,5rem)] font-semibold tracking-[-0.05em]">{{ fmt({ day: "numeric" }) }}</span>
            <span class="mt-1.5 text-[0.9375rem] font-medium text-[rgb(255_255_255/0.75)]">{{ fmt({ year: "numeric" }) }}</span>
          </div>
          <div class="min-w-[min(100%,20rem)] flex-1">
            <p v-if="event.edition" class="font-semibold text-(--wz-link)">Meetup #{{ event.edition }}</p>
            <h1 class="display mt-1 text-[clamp(2.5rem,5vw,5.5rem)] leading-none text-balance">{{ title }}</h1>
            <ul class="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[clamp(1rem,1.3vw,1.25rem)] text-ink *:inline-flex *:items-center *:gap-2 [&_svg]:text-(--wz-link)">
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

        <div class="mt-8 flex flex-wrap gap-2">
          <a v-if="upcoming && event.meetupLink" :href="event.meetupLink" target="_blank" rel="noopener" class="btn btn-primary">
            RSVP on Meetup <LucideArrowUpRight :size="16" aria-hidden="true" />
          </a>
          <a v-if="upcoming" :href="calendarPath(event.date)" class="btn btn-quiet" download>
            <LucideCalendarPlus :size="16" aria-hidden="true" /> Add to calendar
          </a>
          <a v-if="event.venue?.googleMapsUrl" :href="event.venue.googleMapsUrl" target="_blank" rel="noopener" class="btn btn-quiet">
            <LucideNavigation :size="16" aria-hidden="true" /> Directions
          </a>
          <a v-if="webLink(event.streamLink)" :href="webLink(event.streamLink)!" target="_blank" rel="noopener" class="btn btn-quiet">
            <LucidePlay :size="14" fill="currentColor" aria-hidden="true" /> Watch the stream
          </a>
          <a v-if="!upcoming && event.meetupLink" :href="event.meetupLink" target="_blank" rel="noopener" class="btn btn-quiet">
            Meetup page <LucideArrowUpRight :size="16" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <div class="mx-auto mt-[clamp(4rem,7vw,6rem)] grid max-w-6xl grid-cols-[minmax(0,1fr)_20rem] gap-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,3vw,3rem)] [@media(max-width:900px)]:grid-cols-[minmax(0,1fr)]">
      <!-- The evening in order: a real sequence, so the talks are numbered -->
      <section aria-labelledby="programme-title">
        <h2 id="programme-title" class="text-[1.125rem] font-semibold text-(--wz-link)">Programme</h2>
        <!-- Programme: a timeline with the time or the talk number on the left -->
        <ol class="relative mt-6 grid gap-9 before:absolute before:top-6 before:bottom-6 before:left-[calc(2.25rem-1px)] before:w-[2px] before:rounded-[2px] before:bg-line">
          <li class="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-5">
            <span class="z-1 h-fit justify-self-center rounded-full bg-page px-2 py-1 text-[0.875rem] font-semibold text-muted tabular-nums shadow-[0_0_0_6px_var(--wz-page)]">{{ time || "Evening" }}</span>
            <div>
              <h3 class="text-lg leading-tight font-semibold tracking-[-0.015em] text-balance text-heading">Doors open</h3>
              <p class="mt-1 max-w-[40rem] text-base/[1.6] text-muted">Grab a drink, find a seat and say hello.</p>
            </div>
          </li>

          <li v-for="(talk, i) in talks" :key="talk.id" class="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-5">
            <span class="z-1 grid size-11 place-items-center justify-self-center rounded-full bg-accent text-[1.125rem] font-semibold text-white tabular-nums shadow-[0_0_0_6px_var(--wz-page)]" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3 class="text-[clamp(1.25rem,2vw,1.625rem)] leading-tight font-semibold tracking-[-0.015em] text-balance text-heading">
                <NuxtLink :to="`/talks/${talk.id}`" class="transition-[color] duration-200 ease-[ease] hover:text-(--wz-link)">{{ talk.name.trim() }}</NuxtLink>
              </h3>
              <ul class="mt-3.5 flex flex-wrap gap-x-6 gap-y-2">
                <li v-for="s in talk.speakers" :key="s.id">
                  <NuxtLink :to="`/speakers/${s.id}`" class="group inline-flex items-center gap-2.5">
                    <Avatar :url="photoOf(s.speakerPicture)" :name="s.name" :size="40" />
                    <span class="grid">
                      <span class="font-semibold text-heading transition-[color] duration-200 ease-[ease] group-hover:text-(--wz-link)">{{ s.name.trim() }}</span>
                      <span v-if="s.role || s.company" class="text-[0.8125rem] text-muted">{{ [s.role, s.company].filter(Boolean).join(", ") }}</span>
                    </span>
                  </NuxtLink>
                </li>
              </ul>
              <p v-if="summary(talk.abstract)" class="mt-3 max-w-[40rem] text-base/[1.6] text-muted">{{ summary(talk.abstract) }}</p>
              <NuxtLink v-if="talk.youtubecode" :to="`/talks/${talk.id}`" class="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--wz-accent)_10%,transparent)] px-3.5 py-1.5 text-[0.875rem] font-semibold text-(--wz-link) transition-[background-color,color] duration-200 ease-[ease] hover:bg-accent hover:text-white">
                <LucidePlay :size="12" fill="currentColor" aria-hidden="true" /> Watch the recording
              </NuxtLink>
            </div>
          </li>

          <li v-if="!talks.length" class="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-5">
            <span class="z-1 h-fit justify-self-center rounded-full bg-page px-2 py-1 text-[0.875rem] font-semibold text-muted tabular-nums shadow-[0_0_0_6px_var(--wz-page)]">Talks</span>
            <div>
              <h3 class="text-lg leading-tight font-semibold tracking-[-0.015em] text-balance text-heading">To be announced</h3>
              <p class="mt-1 max-w-[40rem] text-base/[1.6] text-muted">
                Want to be on stage?
                <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="inline-link">Submit a talk</a>.
              </p>
            </div>
          </li>

          <li class="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-5">
            <span class="z-1 h-fit justify-self-center rounded-full bg-page px-2 py-1 text-[0.875rem] font-semibold text-muted tabular-nums shadow-[0_0_0_6px_var(--wz-page)]">After</span>
            <div>
              <h3 class="text-lg leading-tight font-semibold tracking-[-0.015em] text-balance text-heading">Food, drinks and conversation</h3>
              <p class="mt-1 max-w-[40rem] text-base/[1.6] text-muted">Stay as long as you like. This is where most of the community happens.</p>
            </div>
          </li>
        </ol>
      </section>

      <aside class="grid content-start gap-4">
        <section v-if="event.venue" class="rounded-3xl bg-soft p-6" aria-labelledby="venue-title">
          <h2 id="venue-title" class="text-[0.875rem] font-semibold text-(--wz-link)">Venue</h2>
          <p class="mt-2 text-[1.125rem] font-semibold text-heading">{{ event.venue.name }}</p>
          <p v-if="venueAddress(event.venue)" class="mt-1 leading-normal text-ink">{{ venueAddress(event.venue) }}</p>
          <a v-if="event.venue.googleMapsUrl" :href="event.venue.googleMapsUrl" target="_blank" rel="noopener" class="inline-link mt-3 inline-block">
            Open in Maps
          </a>
        </section>

        <section v-if="sponsors.length" class="rounded-3xl bg-soft p-6" aria-labelledby="sponsors-title">
          <h2 id="sponsors-title" class="text-[0.875rem] font-semibold text-(--wz-link)">Made possible by</h2>
          <ul class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <li v-for="sp in sponsors" :key="sp.id">
              <a :href="sp.website" target="_blank" rel="noopener" class="flex h-10 items-center" :title="sp.name">
                <SponsorLogo :src="sp.logo!.url" :alt="sp.name" :area="1800" :max-width="120" />
              </a>
            </li>
          </ul>
        </section>

        <section class="rounded-3xl bg-soft p-6">
          <p class="text-[0.9375rem] leading-normal text-ink">Free to attend, and everyone follows our <NuxtLink to="/code-of-conduct" class="inline-link">Code of Conduct</NuxtLink>.</p>
        </section>
      </aside>
    </div>

    <section v-if="photos.length" class="mx-auto mt-[clamp(4rem,7vw,6rem)] max-w-6xl px-[clamp(1rem,3vw,3rem)]" aria-labelledby="photos-title">
      <h2 id="photos-title" class="text-[1.125rem] font-semibold text-(--wz-link)">Photos</h2>
      <ul class="mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-3">
        <li v-for="p in photos" :key="p.id">
          <NuxtImg :src="p.image.url" :alt="p.caption || ''" sizes="100vw sm:50vw lg:33vw" format="webp" quality="72" loading="lazy" class="aspect-[3/2] w-full rounded-[1.25rem] object-cover" />
        </li>
      </ul>
    </section>

    <nav class="mx-auto mt-[clamp(4rem,7vw,6rem)] flex max-w-6xl flex-wrap justify-between gap-4 px-[clamp(1rem,3vw,3rem)] pb-[clamp(5rem,8vw,8rem)]" aria-label="Other meetups">
      <NuxtLink v-if="previous" :to="meetupPath(previous.date)" class="inline-flex items-center gap-3 rounded-[1.25rem] px-5 py-4 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08)] transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-soft hover:shadow-[0_0_0_1px_transparent]">
        <LucideArrowLeft :size="16" aria-hidden="true" />
        <span class="grid">
          <span class="text-[0.8125rem] text-muted">Previous meetup</span>
          <span class="font-semibold text-heading">{{ meetupTitle(previous) }}</span>
        </span>
      </NuxtLink>
      <NuxtLink v-if="next" :to="meetupPath(next.date)" class="ml-auto inline-flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-right shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08)] transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-soft hover:shadow-[0_0_0_1px_transparent]">
        <span class="grid">
          <span class="text-[0.8125rem] text-muted">Next meetup</span>
          <span class="font-semibold text-heading">{{ meetupTitle(next) }}</span>
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
  webLink,
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
const today = useToday();
const upcoming = computed(() => date >= today.value);

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

// Share card for LinkedIn, X and Slack previews
if (event.value) {
  const names = talks.value.flatMap((t) => t.speakers.map((s) => s.name.trim()));
  defineOgImage("Meetup", {
    date: fmt({ day: "numeric", month: "long", year: "numeric" }),
    title: event.value.title?.trim() ?? "",
    venue: venueLine(event.value.venue) ?? "",
    speakers: names.length ? `Talks by ${names.join(", ")}` : "",
    talkCount: talks.value.length,
    upcoming: upcoming.value,
  });
}

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
      ? { "@type": "VirtualLocation", url: webLink(e.streamLink) || e.meetupLink || url }
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

