<script setup lang="ts">
// Share card for meetup pages (1200 x 600), rendered by nuxt-og-image with Satori:
// flexbox and inline styles only.
withDefaults(
  defineProps<{
    date?: string;
    title?: string;
    venue?: string;
    speakers?: string;
    talkCount?: number;
    upcoming?: boolean;
  }>(),
  { date: "", title: "", venue: "", speakers: "", talkCount: 0, upcoming: false }
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
        <div style="display: flex; font-size: 28px; color: rgba(0, 12, 31, 0.65)">
          {{ upcoming ? "Next Web Zürich meetup" : "Web Zürich meetup" }}
        </div>
        <div style="display: flex; margin-top: 16px; font-size: 84px; font-weight: 600; line-height: 1.02; letter-spacing: -0.04em">
          {{ date }}
        </div>
        <div v-if="title" style="display: flex; margin-top: 18px; font-size: 36px; line-height: 1.25">{{ title }}</div>
        <div v-if="venue" style="display: flex; margin-top: 12px; font-size: 28px; color: rgba(0, 12, 31, 0.65)">{{ venue }}</div>
        <div v-if="speakers" style="display: flex; margin-top: 28px; max-width: 980px; font-size: 28px; line-height: 1.3">
          {{ speakers.length > 90 ? `${speakers.slice(0, 87).trimEnd()}…` : speakers }}
        </div>
      </div>
      <div class="flex flex-row items-center">
        <div
          v-if="talkCount"
          style="display: flex; padding: 12px 24px; margin-right: 20px; border-radius: 9999px; background: #0070b4; color: #ffffff; font-size: 24px; font-weight: 600"
        >
          {{ talkCount === 1 ? "1 talk" : `${talkCount} talks` }}
        </div>
        <div
          style="display: flex; padding: 12px 24px; margin-right: 24px; border-radius: 9999px; background: #ffffff; font-size: 24px; font-weight: 600"
        >
          Free to attend
        </div>
        <div
          style="display: flex; width: 160px; height: 12px; border-radius: 9999px; background-image: linear-gradient(90deg, #2bb7e8, #4f7bf0, #8f52e8, #e14f9a, #ff6347, #ffb22e, #3fcf7a)"
        />
        <div style="display: flex; margin-left: 20px; font-size: 24px; font-weight: 600">webzurich.ch</div>
      </div>
    </div>
  </div>
</template>
