<script setup lang="ts">
// Share card for speaker pages (1200 x 600, the nuxt-og-image default), rendered by nuxt-og-image with Satori.
// Satori supports a subset of CSS: flexbox and inline styles only.
withDefaults(
  defineProps<{
    name?: string;
    role?: string;
    photo?: string;
    talkCount?: number;
    latestTalk?: string;
  }>(),
  { name: "", role: "", photo: "", talkCount: 0, latestTalk: "" }
);
</script>

<template>
  <div
    class="flex flex-row"
    style="width: 1200px; height: 600px; padding: 32px; background: #ffffff; font-family: Inter; color: #000c1f"
  >
    <div
      class="flex flex-row flex-nowrap items-center"
      style="width: 1136px; height: 536px; padding: 0 64px; border-radius: 48px; background: #ebedee"
    >
      <img
        v-if="photo"
        :src="photo"
        width="360"
        height="360"
        style="width: 360px; height: 360px; border-radius: 9999px; object-fit: cover; object-position: top; flex-shrink: 0"
      />
      <div class="flex flex-col" style="width: 560px; margin-left: 56px">
        <div style="display: flex; font-size: 26px; color: rgba(0, 12, 31, 0.65)">Speaker at Web Zürich</div>
        <div
          style="display: flex; margin-top: 16px; font-size: 72px; font-weight: 600; line-height: 1.02; letter-spacing: -0.04em"
        >
          {{ name }}
        </div>
        <div v-if="role" style="display: flex; margin-top: 18px; font-size: 28px; line-height: 1.25; color: rgba(0, 12, 31, 0.65)">
          {{ role }}
        </div>
        <div v-if="latestTalk" style="display: flex; margin-top: 36px; font-size: 28px; line-height: 1.3">
          “{{ latestTalk }}”
        </div>
        <div class="flex flex-row items-center" style="margin-top: 36px">
          <div
            style="display: flex; padding: 12px 24px; border-radius: 9999px; background: #0070b4; color: #ffffff; font-size: 24px; font-weight: 600"
          >
            {{ talkCount === 1 ? "1 talk" : `${talkCount} talks` }}
          </div>
          <div style="display: flex; margin-left: 20px; font-size: 24px; font-weight: 600">webzurich.ch</div>
        </div>
      </div>
    </div>
  </div>
</template>
