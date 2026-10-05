<template>
  <!-- Compact: the speaker's face instead of a video tile, for lists inside other content -->
  <NuxtLink
    v-if="compact"
    :to="`/talks/${talk.id}`"
    class="group/row -mx-3 flex items-center gap-4 rounded-3xl px-3 py-2.5 [transition:background_0.2s] hover:bg-soft"
  >
    <span class="inline-flex flex-none" aria-hidden="true">
      <Avatar
        v-for="s in (talk.speakers ?? []).slice(0, 2)"
        :key="s.id"
        :url="s.speakerPicture?.url"
        :name="s.name"
        :size="40"
        class="shadow-[0_0_0_2px_var(--wz-raised)] not-first:-ml-3"
      />
    </span>
    <span class="grid min-w-0 gap-1.5">
      <span class="text-[1.0625rem] leading-[1.3] font-semibold text-pretty text-heading group-hover/row:text-link">{{ talk.name.trim() }}</span>
      <span class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem] text-muted">
        {{ (talk.speakers ?? []).map((s) => s.name).join(", ") }}
        <span
          v-if="talk.youtubecode"
          class="inline-flex items-center gap-1 rounded-full bg-soft px-2 py-[0.0625rem] text-[0.75rem] font-semibold text-link group-hover/row:bg-raised"
        ><LucidePlay :size="10" fill="currentColor" aria-hidden="true" /> Video</span>
      </span>
    </span>
  </NuxtLink>
  <NuxtLink
    v-else
    :to="`/talks/${talk.id}`"
    class="group/row -mx-3 flex items-center gap-5 rounded-3xl p-3 [transition:background_0.2s] hover:bg-soft"
  >
    <span class="tile relative aspect-[16/10] w-[clamp(6.5rem,22vw,10rem)] flex-none rounded-2xl bg-deep">
      <YtThumb v-if="talk.youtubecode" :id="talk.youtubecode" alt="" />
      <span v-else class="grid h-full w-full place-items-center bg-soft text-link group-hover/row:bg-raised" aria-hidden="true"><LucideMic :size="22" /></span>
      <span
        v-if="talk.youtubecode"
        class="absolute bottom-2 left-2 grid size-6 place-items-center rounded-full bg-raised pl-px text-link"
        aria-hidden="true"
      ><LucidePlay :size="12" fill="currentColor" /></span>
    </span>
    <span class="grid min-w-0 gap-1.5">
      <span class="text-[1.0625rem] leading-[1.3] font-semibold text-pretty text-heading group-hover/row:text-link">{{ talk.name.trim() }}</span>
      <span v-if="talk.speakers?.length" class="flex items-center gap-2 text-[0.9375rem] text-ink">
        <span class="inline-flex" aria-hidden="true">
          <Avatar
            v-for="s in talk.speakers.slice(0, 3)"
            :key="s.id"
            :url="s.speakerPicture?.url"
            :name="s.name"
            :size="24"
            class="shadow-[0_0_0_2px_var(--wz-raised)] not-first:-ml-1.5"
          />
        </span>
        {{ talk.speakers.map((s) => s.name).join(", ") }}
      </span>
      <span v-if="meta" class="text-[0.875rem] text-muted">{{ meta }}</span>
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
