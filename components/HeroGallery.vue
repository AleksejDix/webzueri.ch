<template>
  <!--
    Photos from our meetups, crossfading in the hero card like america.gov.
    Slides fill the parent card; the controls sit centred just below it.
  -->
  <section class="absolute inset-0 rounded-[inherit]" aria-roledescription="carousel" aria-label="Photos from Web Zürich meetups">
    <div class="absolute inset-0 overflow-hidden rounded-[inherit] bg-soft" :aria-live="playing ? 'off' : 'polite'">
      <div
        v-for="(photo, i) in photos"
        :key="photo.src"
        class="absolute inset-0 opacity-0 transition-opacity duration-1200 ease-[ease] motion-reduce:transition-none [&.is-current]:opacity-100"
        :class="{ 'is-current': i === current }"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${i + 1} of ${photos.length}`"
        :aria-hidden="i !== current"
      >
        <!-- Only the current photo and its neighbours are loaded -->
        <NuxtImg
          v-if="near(i)"
          :src="photo.src"
          :alt="photo.alt"
          sizes="100vw md:90vw lg:1200px"
          densities="x1 x2"
          format="webp"
          quality="72"
          class="h-full w-full object-cover"
          :preload="i === 0"
          :loading="i === 0 ? 'eager' : 'lazy'"
        />
      </div>
    </div>

    <!-- Three round buttons centred under the card, as on america.gov -->
    <div class="absolute top-[calc(100%+1.25rem)] left-1/2 flex -translate-x-1/2 gap-2">
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.08),0_4px_10px_-4px_rgb(var(--wz-shadow)/0.2)] [transition:background-color_0.2s,color_0.2s] hover:bg-deep hover:text-white"
        aria-label="Previous photo"
        @click="go(-1)"
      >
        <LucideChevronLeft :size="16" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.08),0_4px_10px_-4px_rgb(var(--wz-shadow)/0.2)] [transition:background-color_0.2s,color_0.2s] hover:bg-deep hover:text-white"
        :aria-label="playing ? 'Pause slideshow' : 'Play slideshow'"
        :aria-pressed="playing"
        @click="toggle"
      >
        <LucidePause v-if="playing" :size="14" fill="currentColor" aria-hidden="true" />
        <LucidePlay v-else :size="14" fill="currentColor" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.08),0_4px_10px_-4px_rgb(var(--wz-shadow)/0.2)] [transition:background-color_0.2s,color_0.2s] hover:bg-deep hover:text-white"
        aria-label="Next photo"
        @click="go(1)"
      >
        <LucideChevronRight :size="16" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

const props = withDefaults(defineProps<{ photos: GalleryPhoto[]; interval?: number }>(), { interval: 6000 });

const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const n = () => props.photos.length;
const near = (i: number) => {
  const d = (i - current.value + n()) % n();
  return d === 0 || d === 1 || d === n() - 1;
};

function go(step: number) {
  current.value = (current.value + step + n()) % n();
  if (playing.value) restart();
}

function restart() {
  clearInterval(timer);
  timer = setInterval(() => (current.value = (current.value + 1) % n()), props.interval);
}

function play() {
  playing.value = true;
  restart();
}
function pause() {
  playing.value = false;
  clearInterval(timer);
}
const toggle = () => (playing.value ? pause() : play());

// Don't cycle photos in a background tab
function onVisibility() {
  if (document.hidden) clearInterval(timer);
  else if (playing.value) restart();
}

onMounted(() => {
  // Plays by itself unless the visitor prefers less motion; they can still press play
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) play();
  document.addEventListener("visibilitychange", onVisibility);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>
