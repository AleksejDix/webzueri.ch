<template>
  <figure class="timeline">
    <figcaption class="timeline__legend">
      <span><i class="dot" aria-hidden="true" /> Earlier meetups</span>
      <span><i class="dot dot--recent" aria-hidden="true" /> Last 12 months</span>
    </figcaption>

    <div class="timeline__scroll">
      <div class="timeline__grid" :style="{ '--years': years.length }">
        <!-- Year axis -->
        <div class="timeline__corner" aria-hidden="true" />
        <div class="timeline__axis" aria-hidden="true">
          <span v-for="y in years" :key="y">{{ y }}</span>
        </div>

        <template v-for="s in rows" :key="s.id">
          <a :href="s.website" target="_blank" rel="noopener" class="timeline__label" :title="s.name">
            <span class="timeline__logo"><SponsorLogo :src="s.logo!.url" :alt="s.name" :area="2600" :max-width="150" /></span>
            <span class="timeline__count">{{ s.count }} meetups</span>
            <span class="sr-only">, {{ s.first?.slice(0, 4) }} to {{ s.last?.slice(0, 4) }}</span>
          </a>
          <div class="timeline__track" aria-hidden="true">
            <span
              v-for="e in placed(s.events)"
              :key="e.id"
              class="dot"
              :class="{ 'dot--recent': e.date >= recentFrom, 'dot--end': e.left > 80 }"
              :style="{ left: `${e.left}%` }"
              :data-label="label(e)"
            />
          </div>
        </template>
      </div>
    </div>

    <details class="timeline__table">
      <summary>Show as a table</summary>
      <table>
        <thead>
          <tr>
            <th scope="col">Sponsor</th>
            <th scope="col">Meetups</th>
            <th scope="col">First</th>
            <th scope="col">Most recent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in rows" :key="s.id">
            <th scope="row">{{ s.name }}</th>
            <td>{{ s.count }}</td>
            <td>{{ s.first ? fmt(s.first) : "" }}</td>
            <td>{{ s.last ? fmt(s.last) : "" }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SponsorLogo from "~/components/SponsorLogo.vue";

interface Row {
  id: string;
  name: string;
  website: string;
  logo: { url: string } | null;
  count: number;
  first: string | null;
  last: string | null;
  events: { id: string; date: string; title: string | null }[];
}

const props = defineProps<{ rows: Row[]; recentFrom: string }>();

// One column per year, from the first sponsored meetup to this year
const years = computed(() => {
  const dates = props.rows.flatMap((r) => r.events.map((e) => e.date)).filter(Boolean).sort();
  const first = Number((dates[0] ?? new Date().toISOString()).slice(0, 4));
  const last = Math.max(Number(new Date().toISOString().slice(0, 4)), Number((dates.at(-1) ?? "").slice(0, 4)) || 0);
  return Array.from({ length: last - first + 1 }, (_, i) => first + i);
});

// Each meetup sits in its month's slot (12 per year), so monthly meetups line up
// on an even rhythm instead of smearing into each other. Two meetups in the same
// month share the slot side by side.
function placed(events: Row["events"]) {
  const slots = new Map<number, Row["events"]>();
  for (const e of [...events].sort((a, b) => a.date.localeCompare(b.date))) {
    const slot = (Number(e.date.slice(0, 4)) - years.value[0]!) * 12 + Number(e.date.slice(5, 7)) - 1;
    slots.set(slot, [...(slots.get(slot) ?? []), e]);
  }
  const total = years.value.length * 12;
  return [...slots].flatMap(([slot, list]) =>
    list.map((e, i) => ({ ...e, left: ((slot + (i + 1) / (list.length + 1)) / total) * 100 }))
  );
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const label = (e: { date: string; title: string | null }) => (e.title ? `${fmt(e.date)}: ${e.title}` : fmt(e.date));
</script>

<style scoped>
.timeline {
  margin: 0;
}
.timeline__legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
.timeline__legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.timeline__legend .dot {
  position: static;
  transform: none;
}

.timeline__scroll {
  overflow-x: auto;
  scrollbar-width: thin;
}
.timeline__grid {
  display: grid;
  grid-template-columns: 12rem 1fr;
  row-gap: 0.625rem;
  column-gap: 1.5rem;
  min-width: 60rem;
}

/* Sticky label column so the axis can scroll sideways on phones */
.timeline__corner,
.timeline__label {
  position: sticky;
  left: 0;
  z-index: 2;
  background: #fff;
}
.timeline__axis {
  display: grid;
  grid-template-columns: repeat(var(--years), 1fr);
  padding-bottom: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}
.timeline__axis span {
  padding-left: 0.75rem;
}

/* The sponsor's logo is the row label */
.timeline__label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem;
  min-height: 4.5rem;
}
.timeline__logo {
  display: flex;
  align-items: center;
  height: 2.5rem;
}
.timeline__logo :deep(img) {
  object-position: left center;
}
.timeline__label:hover :deep(img) {
  /* Stay an ink mark: some logos are white artwork that would vanish in colour */
  opacity: 1;
}
.timeline__count {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-zh-muted);
  font-variant-numeric: tabular-nums;
}

/* Each sponsor gets a soft rounded track, with white year dividers */
.timeline__track {
  position: relative;
  border-radius: 999px;
  background-color: var(--color-zh-soft);
  background-image: linear-gradient(to right, #fff 2px, transparent 2px);
  background-size: calc(100% / var(--years)) 100%;
}

.dot {
  position: absolute;
  top: 50%;
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 999px;
  background: var(--color-zh-navy);
  /* 2px surface ring keeps neighbouring meetups apart */
  box-shadow: 0 0 0 2px var(--color-zh-soft);
  transform: translate(-50%, -50%);
}
.timeline__legend .dot {
  box-shadow: none;
}
.dot--recent {
  background: var(--color-zh-blue);
}
/* Bigger hover target than the mark, with the date as a tooltip */
.timeline__track .dot::before {
  content: "";
  position: absolute;
  inset: -0.5rem;
}
.timeline__track .dot:hover {
  z-index: 3;
  transform: translate(-50%, -50%) scale(1.5);
}
.timeline__track .dot:hover::after {
  content: attr(data-label);
  position: absolute;
  bottom: calc(100% + 0.625rem);
  left: 50%;
  transform: translateX(-50%) scale(0.67);
  transform-origin: bottom center;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  background: var(--color-zh-navy);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
}

/* Near the right edge the label opens to the left so it isn't cut off */
.timeline__track .dot--end:hover::after {
  left: auto;
  right: -0.5rem;
  transform: scale(0.67);
  transform-origin: bottom right;
}

.timeline__table {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
.timeline__table summary {
  width: fit-content;
  cursor: pointer;
}
.timeline__table table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}
.timeline__table th,
.timeline__table td {
  padding: 0.5rem 0.75rem 0.5rem 0;
  border-bottom: 1px solid var(--color-zh-line);
  text-align: left;
  font-variant-numeric: tabular-nums;
}
.timeline__table thead th {
  font-weight: 600;
  color: var(--color-zh-ink);
}
.timeline__table tbody th {
  font-weight: 500;
  color: var(--color-zh-navy);
}
</style>
