<template>
  <NuxtLink :to="`/talks/${talk.id}`" class="card">
    <span
      class="card__media"
      :class="{ 'card__media--faces': !talk.youtubecode }"
      :style="{ '--tone': tone }"
    >
      <template v-if="talk.youtubecode">
        <YtThumb :id="talk.youtubecode" alt="" />
        <span class="card__play" aria-hidden="true"><LucidePlay :size="14" fill="currentColor" /></span>
      </template>
      <!-- No recording: the people who gave the talk take the stage instead -->
      <span v-else-if="talk.speakers?.length" class="card__faces" aria-hidden="true">
        <Avatar
          v-for="s in talk.speakers.slice(0, 3)"
          :key="s.id"
          :url="s.speakerPicture?.url"
          :name="s.name"
          :size="talk.speakers.length > 1 ? 76 : 92"
        />
      </span>
      <LucideMic v-else :size="32" class="card__mic" aria-hidden="true" />
    </span>

    <span class="card__body">
      <span class="card__title">{{ talk.name.trim() }}</span>
      <span v-if="others.length" class="card__speakers">
        <span v-if="talk.youtubecode" class="card__mini" aria-hidden="true">
          <Avatar v-for="s in others.slice(0, 3)" :key="s.id" :url="s.speakerPicture?.url" :name="s.name" :size="26" />
        </span>
        {{ others.length < (talk.speakers?.length ?? 0) ? "with " : "" }}{{ others.map((s) => s.name).join(", ") }}
      </span>
      <span class="card__meta">
        <span>{{ month }}</span>
        <span v-if="talk.category && talk.category !== 'Others'" class="card__tag">{{ talk.category }}</span>
        <span v-if="talk.youtubecode" class="card__tag card__tag--video">Video</span>
      </span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Avatar from "~/components/Avatar.vue";
import YtThumb from "~/components/YtThumb.vue";

interface Speaker {
  id: string;
  name: string;
  speakerPicture?: { url: string } | null;
}

const props = defineProps<{
  talk: {
    id: string;
    name: string;
    category?: string | null;
    youtubecode?: string | null;
    createdAt?: string;
    event?: { date: string } | null;
    speakers?: Speaker[];
  };
  // On a speaker's own page, leave them out of the names and say "with" the others
  exclude?: string;
}>();

const others = computed(() => (props.talk.speakers ?? []).filter((s) => s.id !== props.exclude));

const month = computed(() => {
  const iso = props.talk.event?.date ?? props.talk.createdAt;
  return iso ? new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : "";
});

// Talks without a recording get a tile in one of three Zürich blues, picked from
// the talk's id so it never changes, which gives a grid a rhythm
const TONES = ["#0070b4", "#00407c", "#2b8fd3"];
const tone = computed(() => TONES[[...props.talk.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % TONES.length]);
</script>

<style scoped>
/* A talk as a card: the recording in full colour, or its speakers on Zürich blue */
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 1px 2px rgb(0 12 31 / 0.04), 0 8px 24px -16px rgb(0 12 31 / 0.18);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.08),
    0 1px 2px rgb(0 12 31 / 0.05),
    0 14px 28px -14px rgb(0 12 31 / 0.28);
}
.card:focus-visible {
  border-radius: 1.75rem;
}

/* Media: the recording in full colour, or the speakers on Zürich blue */
.card__media {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  border-radius: 1.25rem;
  overflow: hidden;
  background: var(--color-zh-navy);
}
.card__media > :deep(img) {
  /* Fill the 16:9 box exactly, cropping YouTube's letterbox bars */
  position: absolute;
  inset: 0;
  transition: transform 0.5s var(--ease-out-soft);
}
.card:hover .card__media > :deep(img) {
  transform: scale(1.05);
}
.card__media--faces {
  --ring: var(--tone);
  background-color: var(--tone);
  background-image: radial-gradient(120% 90% at 30% 15%, rgb(255 255 255 / 0.16), transparent 60%);
  transition: background-color 0.3s;
}
.card:hover .card__media--faces {
  --ring: color-mix(in oklab, var(--tone), black 18%);
  background-color: var(--ring);
}
.card__faces {
  display: flex;
  padding-left: 1rem;
}
.card__faces > * {
  margin-left: -1rem;
  max-width: none;
  box-shadow: 0 0 0 4px var(--ring);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.3s;
}
.card:hover .card__faces > :nth-child(odd) {
  transform: translateY(-3px);
}
.card:hover .card__faces > :nth-child(even) {
  transform: translateY(3px);
}
.card__mic {
  color: rgb(255 255 255 / 0.85);
}
.card__play {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding-left: 2px;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-blue);
  box-shadow: 0 2px 8px rgb(0 12 31 / 0.25);
  transition: background-color 0.3s, color 0.3s, transform 0.4s var(--ease-out-soft);
}
.card:hover .card__play {
  background: var(--color-zh-blue);
  color: #fff;
  transform: scale(1.1);
}

.card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0.75rem 0.75rem;
}
.card__title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-zh-navy);
  text-wrap: pretty;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}
.card:hover .card__title {
  color: var(--color-zh-blue);
}
.card__speakers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-zh-ink);
}
.card__mini {
  display: flex;
  flex: none;
  padding-left: 0.375rem;
}
.card__mini > * {
  margin-left: -0.375rem;
  max-width: none;
  box-shadow: 0 0 0 2px #fff;
}
.card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.625rem;
  margin-top: auto;
  padding-top: 0.25rem;
  font-size: 0.8125rem;
  color: var(--color-zh-muted);
}
.card__tag {
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  font-weight: 600;
  color: var(--color-zh-navy);
}
.card__tag--video {
  background: rgb(0 112 180 / 0.1);
  color: var(--color-zh-blue);
}
</style>
