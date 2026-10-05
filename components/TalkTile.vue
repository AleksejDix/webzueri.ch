<template>
  <NuxtLink
    :to="`/talks/${talk.id}`"
    class="group/card flex w-full flex-col rounded-[1.75rem] bg-raised p-2 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_1px_2px_rgb(var(--wz-shadow)/0.04),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)] [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08),0_1px_2px_rgb(var(--wz-shadow)/0.05),0_14px_28px_-14px_rgb(var(--wz-shadow)/0.28)]"
  >
    <!-- A talk as a card: the recording in full colour, or its speakers on Zürich blue -->
    <span
      class="relative grid aspect-video place-items-center overflow-hidden rounded-[1.25rem]"
      :class="
        talk.youtubecode
          ? 'bg-deep'
          : 'bg-(--tone) bg-[radial-gradient(120%_90%_at_30%_15%,rgb(255_255_255/0.16),transparent_60%)] [--ring:var(--tone)] [transition:background-color_0.3s] group-hover/card:bg-(--ring) group-hover/card:[--ring:color-mix(in_oklab,var(--tone),black_18%)]'
      "
      :style="{ '--tone': tone }"
    >
      <template v-if="talk.youtubecode">
        <!-- Fill the 16:9 box exactly, cropping YouTube's letterbox bars -->
        <YtThumb :id="talk.youtubecode" alt="" class="absolute inset-0 transition-transform duration-500 ease-out-soft group-hover/card:scale-105" />
        <span
          class="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-raised pl-0.5 text-link shadow-[0_2px_8px_rgb(var(--wz-shadow)/0.25)] [transition:background-color_0.3s,color_0.3s,scale_0.4s_var(--ease-out-soft)] group-hover/card:scale-110 group-hover/card:bg-accent group-hover/card:text-white"
          aria-hidden="true"
        >
          <LucidePlay :size="14" fill="currentColor" />
        </span>
      </template>
      <!-- No recording: the people who gave the talk take the stage instead -->
      <span v-else-if="talk.speakers?.length" class="flex pl-4" aria-hidden="true">
        <Avatar
          v-for="s in talk.speakers.slice(0, 3)"
          :key="s.id"
          :url="s.speakerPicture?.url"
          :name="s.name"
          :size="talk.speakers.length > 1 ? 76 : 92"
          class="-ml-4 max-w-none shadow-[0_0_0_4px_var(--ring)] [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.3s] group-hover/card:odd:-translate-y-[3px] group-hover/card:even:translate-y-[3px]"
        />
      </span>
      <LucideMic v-else :size="32" class="text-[rgb(255_255_255/0.85)]" aria-hidden="true" />
    </span>

    <span class="flex flex-1 flex-col gap-2 px-3 pt-4 pb-3">
      <span class="line-clamp-3 text-[1.125rem] leading-[1.3] font-semibold tracking-[-0.01em] text-pretty text-heading [transition:color_0.2s] group-hover/card:text-link">{{ talk.name.trim() }}</span>
      <span v-if="others.length" class="flex items-center gap-2 text-[0.9375rem] text-ink">
        <span v-if="talk.youtubecode" class="flex flex-none pl-1.5" aria-hidden="true">
          <Avatar
            v-for="s in others.slice(0, 3)"
            :key="s.id"
            :url="s.speakerPicture?.url"
            :name="s.name"
            :size="26"
            class="-ml-1.5 max-w-none shadow-[0_0_0_2px_var(--wz-raised)]"
          />
        </span>
        {{ others.length < (talk.speakers?.length ?? 0) ? "with " : "" }}{{ others.map((s) => s.name).join(", ") }}
      </span>
      <span class="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-1 text-[0.8125rem] text-muted">
        <span>{{ month }}</span>
        <span v-if="talk.category && talk.category !== 'Others'" class="rounded-full bg-soft px-2 py-0.5 font-semibold text-heading">{{ talk.category }}</span>
        <span v-if="talk.youtubecode" class="rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-link">Video</span>
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
