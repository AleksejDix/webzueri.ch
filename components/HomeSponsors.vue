<template>
  <section v-if="badges.length" class="made-by" aria-labelledby="made-by-title">
    <h2 id="made-by-title" class="display made-by__title">Made possible by</h2>
    <p class="lede made-by__lede">
      {{ badges.length }} companies have supported {{ meetups }} meetups since {{ since }}. They host us, feed us and clean up afterwards.
    </p>

    <!-- Round "seal" badges in a diamond: the biggest supporters on top, sized by meetups -->
    <ul v-for="(row, r) in rows" :key="r" class="seals">
      <li v-for="b in row" :key="b.id" class="seal" :class="`seal--${b.tier}`">
        <a :href="b.website" target="_blank" rel="noopener" class="seal__badge" :aria-label="`${b.name}, ${b.count} meetups since ${b.since}`">
          <SponsorLogo :src="b.logo" :alt="''" :area="b.area" :max-width="b.maxWidth" />
          <!-- On hover the logo steps back and the facts take its place, inside the circle -->
          <span class="seal__caption" aria-hidden="true">
            <strong>{{ b.name }}</strong>
            <span>{{ b.count }} meetups</span>
            <span v-if="b.tier !== 'small'">since {{ b.since }}</span>
          </span>
          <span v-if="b.current" class="seal__now" title="Supporting us this year" aria-hidden="true" />
        </a>
      </li>
    </ul>

    <p class="made-by__key"><span class="seal__now seal__now--inline" aria-hidden="true" /> Supporting us this year</p>

    <div class="made-by__actions">
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
.made-by {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: clamp(7rem, 12vw, 11rem) auto 0;
  padding-inline: 1.5rem;
  text-align: center;
}
.made-by__title {
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.06;
}
.made-by__lede {
  max-width: 34rem;
  margin-top: 1rem;
}

.seals {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(0.75rem, 1.6vw, 1.5rem);
  max-width: 64rem;
  margin-top: clamp(0.75rem, 1.6vw, 1.5rem);
}
.seals:first-of-type {
  margin-top: clamp(3rem, 5vw, 4.5rem);
}
.seal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.seal__badge {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #fff;
  /* america.gov's layered seal shadow */
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.04),
    0 2px 2px rgb(0 0 0 / 0.05),
    0 7px 3.5px rgb(0 0 0 / 0.04),
    0 15px 4.5px rgb(0 0 0 / 0.03),
    0 27px 5.5px rgb(0 0 0 / 0.01);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s;
}
.seal--large .seal__badge {
  width: clamp(8.5rem, 13vw, 10.5rem);
  height: clamp(8.5rem, 13vw, 10.5rem);
}
.seal--medium .seal__badge {
  width: clamp(7rem, 10.5vw, 8.25rem);
  height: clamp(7rem, 10.5vw, 8.25rem);
}
.seal--small .seal__badge {
  width: clamp(5.75rem, 8.5vw, 6.5rem);
  height: clamp(5.75rem, 8.5vw, 6.5rem);
}
.seal__badge:hover,
.seal__badge:focus-visible {
  transform: translateY(-6px);
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.05),
    0 4px 4px rgb(0 0 0 / 0.05),
    0 14px 10px rgb(0 0 0 / 0.05),
    0 28px 24px rgb(0 0 0 / 0.05);
}
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

/* Zürich-blue mark on the rim for this year's sponsors */
.seal__now {
  position: absolute;
  top: 9%;
  right: 9%;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 999px;
  background: var(--color-zh-blue);
  box-shadow: 0 0 0 3px #fff;
}
.seal__now--inline {
  position: static;
  display: inline-block;
  box-shadow: none;
}

/* Name and count, centred in the badge on hover */
.seal__caption {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  gap: 0.125rem;
  padding: 0 14%;
  border-radius: inherit;
  font-size: 0.8125rem;
  line-height: 1.25;
  color: var(--color-zh-muted);
  text-align: center;
  opacity: 0;
  transform: translateY(0.25rem);
  pointer-events: none;
  transition: opacity 0.25s, transform 0.3s var(--ease-out-soft);
}
.seal__caption strong {
  margin-bottom: 0.125rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-zh-navy);
  text-wrap: balance;
}
.seal--small .seal__caption {
  padding: 0 10%;
  font-size: 0.6875rem;
}
.seal--small .seal__caption strong {
  font-size: 0.75rem;
}
.seal__badge:hover .seal__caption,
.seal__badge:focus-visible .seal__caption {
  opacity: 1;
  transform: none;
}

.made-by__key {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
.made-by__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
</style>
