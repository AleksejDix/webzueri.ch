<template>
  <!-- Compact: the speaker's face instead of a video tile, for lists inside other content -->
  <NuxtLink v-if="compact" :to="`/talks/${talk.id}`" class="talk-row talk-row--compact">
    <span class="talk-row__faces talk-row__faces--lead" aria-hidden="true">
      <Avatar v-for="s in (talk.speakers ?? []).slice(0, 2)" :key="s.id" :url="s.speakerPicture?.url" :name="s.name" :size="40" />
    </span>
    <span class="talk-row__body">
      <span class="talk-row__title">{{ talk.name.trim() }}</span>
      <span class="talk-row__line">
        {{ (talk.speakers ?? []).map((s) => s.name).join(", ") }}
        <span v-if="talk.youtubecode" class="talk-row__video"><LucidePlay :size="10" fill="currentColor" aria-hidden="true" /> Video</span>
      </span>
    </span>
  </NuxtLink>
  <NuxtLink v-else :to="`/talks/${talk.id}`" class="talk-row">
    <span class="talk-row__media tile">
      <YtThumb v-if="talk.youtubecode" :id="talk.youtubecode" alt="" />
      <span v-else class="talk-row__placeholder" aria-hidden="true"><LucideMic :size="22" /></span>
      <span v-if="talk.youtubecode" class="talk-row__play" aria-hidden="true"><LucidePlay :size="12" fill="currentColor" /></span>
    </span>
    <span class="talk-row__body">
      <span class="talk-row__title">{{ talk.name.trim() }}</span>
      <span v-if="talk.speakers?.length" class="talk-row__speakers">
        <span class="talk-row__faces" aria-hidden="true">
          <Avatar v-for="s in talk.speakers.slice(0, 3)" :key="s.id" :url="s.speakerPicture?.url" :name="s.name" :size="24" />
        </span>
        {{ talk.speakers.map((s) => s.name).join(", ") }}
      </span>
      <span v-if="meta" class="talk-row__meta">{{ meta }}</span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Avatar from "~/components/Avatar.vue";
import YtThumb from "~/components/YtThumb.vue";

const props = defineProps<{
  talk: {
    id: string;
    name: string;
    youtubecode?: string | null;
    category?: string | null;
    event?: { date: string } | null;
    speakers?: { id: string; name: string; speakerPicture?: { url: string } | null }[];
  };
  showDate?: boolean;
  compact?: boolean;
}>();

const meta = computed(() => {
  const parts: string[] = [];
  // "Others" is a catch-all that tells the reader nothing
  if (props.talk.category && props.talk.category !== "Others") parts.push(props.talk.category);
  if (props.showDate && props.talk.event?.date) {
    parts.push(new Date(props.talk.event.date).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }));
  }
  if (props.talk.youtubecode) parts.push("Video");
  return parts.join(", ");
});
</script>

<style scoped>
.talk-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem;
  margin-inline: -0.75rem;
  border-radius: 1.5rem;
  transition: background 0.2s;
}
.talk-row:hover {
  background: var(--color-zh-soft);
}
.talk-row__media {
  position: relative;
  flex: none;
  width: clamp(6.5rem, 22vw, 10rem);
  aspect-ratio: 16 / 10;
  border-radius: 1rem;
  background: var(--color-zh-navy);
}
.talk-row__placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: var(--color-zh-soft);
  color: var(--color-zh-blue);
}
.talk-row:hover .talk-row__placeholder {
  background: #fff;
}
.talk-row__play {
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding-left: 1px;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-blue);
}
.talk-row__body {
  display: grid;
  gap: 0.375rem;
  min-width: 0;
}
.talk-row__title {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-zh-navy);
  text-wrap: pretty;
}
.talk-row:hover .talk-row__title {
  color: var(--color-zh-blue);
}
.talk-row__speakers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-zh-ink);
}
.talk-row__faces {
  display: inline-flex;
}
.talk-row__faces > * + * {
  margin-left: -0.375rem;
}
.talk-row__faces > * {
  box-shadow: 0 0 0 2px #fff;
}
.talk-row__meta {
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
.talk-row--compact {
  gap: 1rem;
  padding: 0.625rem 0.75rem;
}
.talk-row__faces--lead {
  flex: none;
}
.talk-row__faces--lead > * + * {
  margin-left: -0.75rem;
}
.talk-row__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.625rem;
  font-size: 0.9375rem;
  color: var(--color-zh-muted);
}
.talk-row__video {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.0625rem 0.5rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.talk-row--compact:hover .talk-row__video {
  background: #fff;
}
</style>
