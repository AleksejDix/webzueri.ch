<template>
  <section v-if="badges.length" class="mx-auto mt-[clamp(7rem,12vw,11rem)] flex flex-col items-center px-6 text-center" aria-labelledby="made-by-title">
    <h2 id="made-by-title" class="display text-[clamp(2.5rem,4vw,4rem)] leading-[1.06]">Made possible by</h2>
    <p class="lede mt-4 max-w-[34rem]">
      {{ badges.length }} companies have supported {{ meetups }} meetups since {{ since }}. They host us, feed us and clean up afterwards.
    </p>

    <!-- Round "seal" badges in a diamond: the biggest supporters on top, sized by meetups -->
    <ul
      v-for="(row, r) in rows"
      :key="r"
      class="mt-[clamp(0.75rem,1.6vw,1.5rem)] flex max-w-[64rem] flex-wrap items-center justify-center gap-[clamp(0.75rem,1.6vw,1.5rem)] first-of-type:mt-[clamp(3rem,5vw,4.5rem)]"
    >
      <li v-for="b in row" :key="b.id" class="relative flex flex-col items-center">
        <!-- america.gov's layered seal shadow -->
        <a
          :href="b.website"
          target="_blank"
          rel="noopener"
          class="seal__badge group/badge relative grid place-items-center rounded-full bg-raised shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.04),0_2px_2px_rgb(0_0_0/0.05),0_7px_3.5px_rgb(0_0_0/0.04),0_15px_4.5px_rgb(0_0_0/0.03),0_27px_5.5px_rgb(0_0_0/0.01)] [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s] hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.05),0_4px_4px_rgb(0_0_0/0.05),0_14px_10px_rgb(0_0_0/0.05),0_28px_24px_rgb(0_0_0/0.05)] focus-visible:-translate-y-1.5 focus-visible:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.05),0_4px_4px_rgb(0_0_0/0.05),0_14px_10px_rgb(0_0_0/0.05),0_28px_24px_rgb(0_0_0/0.05)]"
          :class="{
            large: 'size-[clamp(8.5rem,13vw,10.5rem)]',
            medium: 'size-[clamp(7rem,10.5vw,8.25rem)]',
            small: 'size-[clamp(5.75rem,8.5vw,6.5rem)]',
          }[b.tier]"
          :aria-label="`${b.name}, ${b.count} meetups since ${b.since}`"
        >
          <SponsorLogo :src="b.logo" :alt="''" :area="b.area" :max-width="b.maxWidth" />
          <!-- On hover the logo steps back and the facts take its place, inside the circle -->
          <span
            class="pointer-events-none absolute inset-0 grid translate-y-1 place-content-center gap-0.5 rounded-[inherit] text-center leading-[1.25] text-muted opacity-0 [transition:opacity_0.25s,translate_0.3s_var(--ease-out-soft)] group-hover/badge:translate-y-0 group-hover/badge:opacity-100 group-focus-visible/badge:translate-y-0 group-focus-visible/badge:opacity-100"
            :class="b.tier === 'small' ? 'px-[10%] text-[0.6875rem]' : 'px-[14%] text-[0.8125rem]'"
            aria-hidden="true"
          >
            <strong
              class="mb-0.5 font-semibold tracking-[-0.01em] text-balance text-heading"
              :class="b.tier === 'small' ? 'text-[0.75rem]' : 'text-[0.9375rem]'"
            >{{ b.name }}</strong>
            <span>{{ b.count }} meetups</span>
            <span v-if="b.tier !== 'small'">since {{ b.since }}</span>
          </span>
          <!-- Zürich-blue mark on the rim for this year's sponsors -->
          <span
            v-if="b.current"
            class="absolute top-[9%] right-[9%] size-3 rounded-full bg-accent shadow-[0_0_0_3px_var(--wz-raised)]"
            title="Supporting us this year"
            aria-hidden="true"
          />
        </a>
      </li>
    </ul>

    <p class="mt-10 inline-flex items-center gap-2 text-[0.875rem] text-muted"><span class="inline-block size-3 rounded-full bg-accent" aria-hidden="true" /> Supporting us this year</p>

    <div class="mt-6 flex flex-wrap justify-center gap-2">
      <NuxtLink to="/sponsors#support" class="btn btn-ink">Support an evening</NuxtLink>
      <NuxtLink to="/sponsors" class="btn btn-quiet">See all sponsors</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SponsorLogo from "~/components/SponsorLogo.vue";
import { MIN_SPONSOR_MEETUPS } from "~/utils/sponsoring";

interface Sponsor {
  id: string;
  name: string;
  website: string;
  logo: { url: string } | null;
  events: { id: string; date: string }[];
}
const props = defineProps<{ sponsors: Sponsor[] }>();

const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);

// Three badge sizes by rank: the top 3, the next 5, everyone else
const TIERS = {
  large: { area: 6000, maxWidth: 124 },
  medium: { area: 4000, maxWidth: 100 },
  small: { area: 2600, maxWidth: 80 },
} as const;
const ROW_SIZES = [3, 5];

const repeat = computed(() =>
  props.sponsors.filter((s) => s.logo?.url && (s.events?.length ?? 0) >= MIN_SPONSOR_MEETUPS)
);

const badges = computed(() => {
  const list = repeat.value
    .map((s) => {
      const dates = s.events.map((e) => e.date).filter(Boolean).sort();
      const count = s.events.length;
      return {
        id: s.id,
        name: s.name,
        website: s.website,
        logo: s.logo!.url,
        count,
        since: dates[0]?.slice(0, 4) ?? "",
        current: (dates.at(-1) ?? "") >= oneYearAgo,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return list.map((b, i) => {
    const tier = i < ROW_SIZES[0]! ? "large" : i < ROW_SIZES[0]! + ROW_SIZES[1]! ? "medium" : "small";
    return { ...b, tier, ...TIERS[tier] };
  });
});

// Each row is arranged centre-out: pushing and unshifting from the largest
// puts the row's biggest supporter in the middle
const rows = computed(() => {
  const out: (typeof badges.value)[] = [];
  let start = 0;
  for (const size of [...ROW_SIZES, Infinity]) {
    const chunk = badges.value.slice(start, start + size);
    if (!chunk.length) break;
    const row: typeof chunk = [];
    chunk.forEach((b, i) => (i % 2 ? row.unshift(b) : row.push(b)));
    out.push(row);
    start += size;
  }
  return out;
});

const meetups = computed(() => new Set(repeat.value.flatMap((s) => s.events.map((e) => e.id))).size);
const since = computed(() => badges.value.map((b) => b.since).filter(Boolean).sort()[0] ?? "");
</script>

<style scoped>
/* The logo steps back on hover. These target SponsorLogo's <img>, whose own
   (unlayered) styles would win over utility classes, so they stay here */
.seal__badge :deep(img) {
  transition: opacity 0.25s, transform 0.4s var(--ease-out-soft);
}
.seal__badge :deep(img.is-ink) {
  opacity: 0.85;
}
.seal__badge:hover :deep(img),
.seal__badge:focus-visible :deep(img) {
  opacity: 0;
  transform: scale(0.92);
}
</style>
