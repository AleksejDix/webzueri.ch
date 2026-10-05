<template>
  <!-- Logos of well-known companies our speakers came from, to show the calibre of the stage -->
  <section v-if="logos.length" class="mx-auto max-w-[72rem]" aria-labelledby="speaker-companies-title">
    <h2 id="speaker-companies-title" class="text-[0.9375rem] font-semibold text-muted">
      People from these companies have given talks on our stage
    </h2>
    <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-[clamp(1.75rem,3.2vw,3rem)] gap-y-[clamp(1.25rem,2vw,1.75rem)]">
      <!-- Sized to the same visual weight: wide logos get shorter, compact ones taller -->
      <li v-for="c in logos" :key="c.logo" :style="{ '--s': (Math.sqrt(4 / c.aspect) * (c.scale ?? 1)).toFixed(3) }">
        <img
          :src="`/img/companies/${c.logo}.svg`"
          :alt="c.name"
          :width="Math.round(32 * c.aspect)"
          height="32"
          class="h-[calc(clamp(1.375rem,2.2vw,1.875rem)*var(--s))] w-auto"
          :class="{ 'dark:hidden': c.dark }"
        />
        <img
          v-if="c.dark"
          :src="`/img/companies/${c.logo}-dark.svg`"
          :alt="c.name"
          :width="Math.round(32 * c.aspect)"
          height="32"
          class="hidden h-[calc(clamp(1.375rem,2.2vw,1.875rem)*var(--s))] w-auto dark:block"
        />
      </li>
    </ul>
    <p v-if="others > 0" class="mt-6 text-[0.9375rem] text-muted">and {{ others }} more companies</p>
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
const logos = computed(() => NOTABLE_COMPANIES.filter((n) => entered.value.some((c) => n.match.test(c))));
const others = computed(() => {
  const all = new Set(entered.value.map((c) => c.toLowerCase()));
  return [...all].filter((c) => !logos.value.some((n) => n.match.test(c))).length;
});
</script>
