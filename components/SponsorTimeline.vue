<template>
  <figure>
    <figcaption class="mb-6 flex justify-center gap-6 text-[0.875rem] text-muted *:inline-flex *:items-center *:gap-2">
      <span><i class="inline-block size-2.5 rounded-full bg-deep" aria-hidden="true" /> Earlier meetups</span>
      <span><i class="inline-block size-2.5 rounded-full bg-accent" aria-hidden="true" /> Last 12 months</span>
    </figcaption>

    <div class="overflow-x-auto [scrollbar-width:thin]">
      <div class="grid min-w-240 grid-cols-[12rem_1fr] gap-x-6 gap-y-2.5" :style="{ '--years': years.length }">
        <!-- Year axis. The label column is sticky so the axis can scroll sideways on phones -->
        <div class="sticky left-0 z-2 bg-page" aria-hidden="true" />
        <div
          class="grid grid-cols-[repeat(var(--years),1fr)] pb-1 text-[0.8125rem] font-medium text-muted tabular-nums *:pl-3"
          aria-hidden="true"
        >
          <span v-for="y in years" :key="y">{{ y }}</span>
        </div>

        <template v-for="s in rows" :key="s.id">
          <!-- The sponsor's logo is the row label. On hover it stays an ink mark: some logos are white artwork that would vanish in colour -->
          <a
            :href="s.website"
            target="_blank"
            rel="noopener"
            class="sticky left-0 z-2 flex min-h-18 flex-col justify-center gap-1.5 bg-page [&:hover_img]:opacity-100"
            :title="s.name"
          >
            <span class="flex h-10 items-center [&_img]:object-left"><SponsorLogo :src="s.logo!.url" :alt="s.name" :area="2600" :max-width="150" /></span>
            <span class="text-[0.8125rem] font-medium text-muted tabular-nums">{{ s.count }} meetups</span>
            <span class="sr-only">, {{ s.first?.slice(0, 4) }} to {{ s.last?.slice(0, 4) }}</span>
          </a>
          <!-- Each sponsor gets a soft rounded track, with year dividers in the page colour -->
          <div
            class="relative rounded-full bg-soft bg-[linear-gradient(to_right,var(--wz-page)_2px,transparent_2px)] bg-size-[calc(100%/var(--years))_100%]"
            aria-hidden="true"
          >
            <!-- 2px surface ring keeps neighbouring meetups apart; ::before is a bigger hover target than the mark -->
            <span
              v-for="e in placed(s.events)"
              :key="e.id"
              class="dot absolute top-1/2 inline-block size-2.5 -translate-1/2 rounded-full shadow-[0_0_0_2px_var(--wz-soft)] before:absolute before:-inset-2 hover:z-3 hover:scale-150"
              :class="[e.date >= recentFrom ? 'bg-accent' : 'bg-deep', { 'dot--end': e.left > 80 }]"
              :style="{ left: `${e.left}%` }"
              :data-label="label(e)"
            />
          </div>
        </template>
      </div>
    </div>

    <details class="mt-6 text-[0.875rem] text-muted">
      <summary class="w-fit cursor-pointer">Show as a table</summary>
      <table class="mt-4 w-full border-collapse">
        <thead>
          <tr class="*:border-b *:border-line *:py-2 *:pr-3 *:text-left *:tabular-nums">
            <th scope="col" class="font-semibold text-ink">Sponsor</th>
            <th scope="col" class="font-semibold text-ink">Meetups</th>
            <th scope="col" class="font-semibold text-ink">First</th>
            <th scope="col" class="font-semibold text-ink">Most recent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in rows" :key="s.id" class="*:border-b *:border-line *:py-2 *:pr-3 *:text-left *:tabular-nums">
            <th scope="row" class="font-medium text-heading">{{ s.name }}</th>
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
/* The date as a tooltip. Near the right edge it opens to the left so it isn't cut off */
.dot:hover::after {
  content: attr(data-label);
  position: absolute;
  bottom: calc(100% + 0.625rem);
  left: 50%;
  transform: translateX(-50%) scale(0.67);
  transform-origin: bottom center;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  background: var(--wz-deep);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
}
.dot--end:hover::after {
  left: auto;
  right: -0.5rem;
  transform: scale(0.67);
  transform-origin: bottom right;
}
</style>
