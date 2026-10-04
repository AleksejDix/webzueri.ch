<script setup lang="ts">
// Share card for every page without a more specific one (1200 x 600), rendered by
// nuxt-og-image with Satori: flexbox and inline styles only.
withDefaults(
  defineProps<{
    kicker?: string;
    title?: string;
    description?: string;
  }>(),
  { kicker: "Web Zürich", title: "", description: "" }
);
</script>

<template>
  <div
    class="flex flex-row"
    style="width: 1200px; height: 600px; padding: 32px; background: #ffffff; font-family: Inter; color: #000c1f"
  >
    <div
      class="flex flex-col justify-between"
      style="width: 1136px; height: 536px; padding: 64px 72px 56px; border-radius: 48px; background: #ebedee"
    >
      <div class="flex flex-col">
        <div style="display: flex; font-size: 28px; color: rgba(0, 12, 31, 0.65)">{{ kicker }}</div>
        <div
          :style="{
            display: 'flex',
            marginTop: '20px',
            fontSize: title.length > 40 ? '64px' : '84px',
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
          }"
        >
          {{ title }}
        </div>
        <div
          v-if="description"
          style="display: flex; margin-top: 28px; max-width: 900px; font-size: 30px; line-height: 1.35; color: rgba(0, 12, 31, 0.7)"
        >
          {{ description.length > 150 ? `${description.slice(0, 147).trimEnd()}…` : description }}
        </div>
      </div>
      <div class="flex flex-row items-center">
        <!-- The colours of the handwritten title on the home page -->
        <div
          style="display: flex; width: 240px; height: 12px; border-radius: 9999px; background-image: linear-gradient(90deg, #2bb7e8, #4f7bf0, #8f52e8, #e14f9a, #ff6347, #ffb22e, #3fcf7a)"
        />
        <div style="display: flex; margin-left: 24px; font-size: 26px; font-weight: 600">webzurich.ch</div>
      </div>
    </div>
  </div>
</template>
