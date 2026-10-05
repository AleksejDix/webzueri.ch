<template>
  <div>
    <PageHero
      title="Sponsors"
      lede="Web Zürich is free to attend because companies host us, feed us and clean up afterwards. Thank you to every one of them."
    >
      <!-- This year's sponsors, front and centre -->
      <ul
        v-if="current.length"
        class="mt-[clamp(2.5rem,4vw,3.5rem)] flex max-w-5xl flex-wrap items-center justify-center gap-x-[clamp(2rem,4.5vw,4.5rem)] gap-y-[clamp(1.5rem,3.5vw,3.5rem)]"
        aria-label="Sponsors this year"
      >
        <li v-for="s in current" :key="s.id">
          <!-- On hover the logo stays an ink mark: some logos are white artwork that would vanish in colour -->
          <a
            :href="s.website"
            target="_blank"
            rel="noopener"
            class="grid h-18 min-w-30 place-items-center transition-transform duration-300 ease-out-soft hover:-translate-y-0.5 [&:hover_img]:opacity-100 [&:not(:hover)_img.is-ink]:opacity-85"
            :title="s.name"
          >
            <SponsorLogo :src="s.logo!.url" :alt="s.name" :area="5200" :max-width="190" />
          </a>
        </li>
      </ul>
      <div class="mt-[clamp(2.5rem,4vw,3.5rem)] flex flex-wrap justify-center gap-2">
        <a href="#support" class="btn btn-ink">Support an evening</a>
        <a :href="`mailto:${SPONSOR_EMAIL}`" class="btn btn-quiet">{{ SPONSOR_EMAIL }}</a>
      </div>
    </PageHero>

    <section v-if="sponsors.length" class="mx-auto mt-[clamp(4rem,7vw,6.5rem)] max-w-352 px-6" aria-labelledby="timeline-title">
      <h2 id="timeline-title" class="heading text-center text-[clamp(1.5rem,2.4vw,2rem)] font-medium">Every evening they made possible</h2>
      <p class="mx-auto mt-3 max-w-136 text-center leading-normal text-muted">
        {{ sponsors.length }} companies have supported {{ sponsoredMeetups }} meetups since {{ since }}. One dot is one meetup.
      </p>
      <SponsorTimeline :rows="sponsors" :recent-from="oneYearAgo" />
    </section>

    <!-- Prices: three tiles in the america.gov rows style -->
    <section
      id="support"
      class="mt-[clamp(6rem,10vw,9rem)] bg-[#f7f7f7] px-6 py-[clamp(4.5rem,7.5vw,8rem)] dark:bg-soft"
      aria-labelledby="support-title"
    >
      <div class="flex flex-col items-center text-center">
        <h2 id="support-title" class="display text-[clamp(2.5rem,4vw,4rem)] leading-[1.06]">Support an evening</h2>
        <p class="lede mt-4 max-w-lg">
          Pick one part of a meetup to cover. Each one includes a speaking slot for your company.
        </p>
      </div>
      <ul class="mx-auto mt-[clamp(2.5rem,4vw,4rem)] grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-4">
        <li
          v-for="p in SPONSOR_PRICES"
          :key="p.name"
          class="flex flex-col rounded-4xl bg-raised p-8 shadow-[0_2px_2px_rgb(var(--wz-shadow)/0.04),0_7px_3.5px_rgb(var(--wz-shadow)/0.03),0_15px_4.5px_rgb(var(--wz-shadow)/0.02)]"
        >
          <span class="font-semibold text-muted">{{ p.short }}</span>
          <span class="mt-3 text-[clamp(2.5rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.045em] text-heading tabular-nums">{{ p.price }}</span>
          <span class="mt-4 leading-normal text-ink">{{ p.covers }}</span>
          <span class="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.875rem] font-semibold text-link"><LucideMic :size="14" aria-hidden="true" /> Includes a speaking slot</span>
        </li>
      </ul>
      <p class="mx-auto mt-10 max-w-160 text-center leading-[1.6] text-muted">
        Write to <a :href="`mailto:${SPONSOR_EMAIL}`" class="inline-link">{{ SPONSOR_EMAIL }}</a> to book a date.
        What sponsors get, and what they can't do, is in our <NuxtLink to="/advertising-rules" class="inline-link">advertising rules</NuxtLink>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import sponsorsQuery from "~/services/apollo/queries/sponsors.gql";
import PageHero from "~/components/PageHero.vue";
import SponsorTimeline from "~/components/SponsorTimeline.vue";
import SponsorLogo from "~/components/SponsorLogo.vue";
import { MIN_SPONSOR_MEETUPS, SPONSOR_EMAIL, SPONSOR_PRICES } from "~/utils/sponsoring";

interface Sponsor {
  id: string;
  name: string;
  website: string;
  logo: { url: string; mimeType: string | null } | null;
  events: { id: string; date: string; title: string | null }[];
}

const { data } = await useAsyncQuery<{ sponsors: Sponsor[] }>(sponsorsQuery);

const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);

// Repeat sponsors only, most meetups first
const sponsors = computed(() =>
  (data.value?.sponsors ?? [])
    .filter((s) => s.logo?.url)
    .map((s) => {
      const dates = s.events.map((e) => e.date).filter(Boolean).sort();
      return { ...s, count: dates.length, first: dates[0] ?? null, last: dates[dates.length - 1] ?? null };
    })
    .filter((s) => s.count >= MIN_SPONSOR_MEETUPS)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
);
const current = computed(() => sponsors.value.filter((s) => s.last && s.last >= oneYearAgo));
const sponsoredMeetups = computed(() => new Set(sponsors.value.flatMap((s) => s.events.map((e) => e.id))).size);
const since = computed(() => sponsors.value.map((s) => s.first).filter(Boolean).sort()[0]?.slice(0, 4) ?? "");

useSeoMeta({
  title: "Sponsors",
  description: "The companies that host, feed and support Web Zürich, and what it costs to sponsor a meetup.",
});
defineOgImage("Page", {
  title: "Sponsors",
  description: "The companies that host, feed and support Web Zürich, and what it costs to sponsor a meetup.",
});
</script>

