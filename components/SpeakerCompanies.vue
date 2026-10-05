<template>
  <!-- Big names our speakers came from, to show the calibre of the stage -->
  <section v-if="names.length" class="mx-auto max-w-[56rem]" aria-labelledby="speaker-companies-title">
    <h2 id="speaker-companies-title" class="text-[0.9375rem] font-semibold text-muted">
      People from these companies have given talks on our stage
    </h2>
    <ul class="mt-5 flex flex-wrap items-baseline justify-center gap-x-[clamp(1.25rem,2.4vw,2.25rem)] gap-y-2">
      <li
        v-for="name in names"
        :key="name"
        class="text-[clamp(1.25rem,2vw,1.75rem)] leading-tight font-semibold tracking-[-0.035em] whitespace-nowrap text-heading/70"
      >{{ name }}</li>
    </ul>
    <p v-if="others > 0" class="mt-5 text-[0.9375rem] text-muted">and {{ others }} more companies</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NOTABLE_COMPANIES } from "~/utils/notableCompanies";

const props = defineProps<{ companies: (string | null)[] }>();

// Each speaker's company as entered, trimmed; "Independent" isn't a company
const entered = computed(() =>
  props.companies.map((c) => (c ?? "").trim()).filter((c) => c && !/^(independent|freelance)/i.test(c)),
);
// The 12 best-known that match (two even rows on desktop); the rest go into "and N more"
const names = computed(() =>
  NOTABLE_COMPANIES.filter((n) => entered.value.some((c) => n.match.test(c)))
    .slice(0, 12)
    .map((n) => n.name),
);
const others = computed(() => {
  const all = new Set(entered.value.map((c) => c.toLowerCase()));
  const shown = [...all].filter((c) => NOTABLE_COMPANIES.some((n) => names.value.includes(n.name) && n.match.test(c)));
  return all.size - shown.length;
});
</script>
