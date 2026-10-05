<template>
  <!-- System by default; Light or Dark override it and are remembered (@nuxtjs/color-mode) -->
  <fieldset class="inline-flex rounded-full bg-raised p-1 shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.08)]">
    <legend class="sr-only">Colour theme</legend>
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="colorMode.preference === option.value"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted transition-colors hover:text-heading aria-pressed:bg-strong aria-pressed:text-on-strong"
      @click="colorMode.preference = option.value"
    >
      <component :is="option.icon" :size="15" aria-hidden="true" />
      {{ option.label }}
    </button>
  </fieldset>
</template>

<script setup lang="ts">
import { LucideMonitor, LucideMoon, LucideSun } from "#components";

const colorMode = useColorMode();
const options = [
  { value: "system", label: "System", icon: LucideMonitor },
  { value: "light", label: "Light", icon: LucideSun },
  { value: "dark", label: "Dark", icon: LucideMoon },
];
</script>
