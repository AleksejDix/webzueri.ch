<script setup lang="ts">
// Share card for talk pages (1200 x 600), rendered by nuxt-og-image with Satori:
// flexbox and inline styles only.
withDefaults(
  defineProps<{
    title?: string;
    speakers?: string;
    photo?: string;
    date?: string;
    video?: boolean;
  }>(),
  { title: "", speakers: "", photo: "", date: "", video: false }
);
</script>

<template>
  <div
    class="flex flex-row"
    style="width: 1200px; height: 600px; padding: 32px; background: #ffffff; font-family: Inter; color: #000c1f"
  >
    <div
      class="flex flex-row items-center"
      style="width: 1136px; height: 536px; padding: 0 72px; border-radius: 48px; background: #ebedee"
    >
      <div class="flex flex-col" :style="{ width: photo ? '640px' : '990px' }">
        <div style="display: flex; font-size: 26px; color: rgba(0, 12, 31, 0.65)">
          {{ date ? `Talk at Web Zürich, ${date}` : "Talk at Web Zürich" }}
        </div>
        <div
          :style="{
            display: 'flex',
            marginTop: '18px',
            fontSize: title.length > 70 ? '50px' : title.length > 40 ? '60px' : '72px',
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: '-0.035em',
          }"
        >
          {{ title.length > 110 ? `${title.slice(0, 107).trimEnd()}…` : title }}
        </div>
        <div v-if="speakers" style="display: flex; margin-top: 24px; font-size: 30px; line-height: 1.3">{{ speakers }}</div>
        <div class="flex flex-row items-center" style="margin-top: 40px">
          <div
            v-if="video"
            style="display: flex; padding: 12px 24px; margin-right: 20px; border-radius: 9999px; background: #0070b4; color: #ffffff; font-size: 24px; font-weight: 600"
          >
            Watch the talk
          </div>
          <div
            style="display: flex; width: 160px; height: 12px; border-radius: 9999px; background-image: linear-gradient(90deg, #2bb7e8, #4f7bf0, #8f52e8, #e14f9a, #ff6347, #ffb22e, #3fcf7a)"
          />
          <div style="display: flex; margin-left: 20px; font-size: 24px; font-weight: 600">webzurich.ch</div>
        </div>
      </div>
      <img
        v-if="photo"
        :src="photo"
        width="300"
        height="300"
        style="width: 300px; height: 300px; margin-left: 52px; border-radius: 9999px; object-fit: cover; object-position: top; flex-shrink: 0"
      />
    </div>
  </div>
</template>
