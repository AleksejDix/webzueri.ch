<template>
  <!--
    Photos from our meetups, crossfading in the hero card like america.gov.
    Slides fill the parent card; the controls sit centred just below it.
  -->
  <section class="gallery" aria-roledescription="carousel" aria-label="Photos from Web Zürich meetups">
    <div class="gallery__slides" :aria-live="playing ? 'off' : 'polite'">
      <div
        v-for="(photo, i) in photos"
        :key="photo.src"
        class="gallery__slide"
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
          class="gallery__photo"
          :preload="i === 0"
          :loading="i === 0 ? 'eager' : 'lazy'"
        />
      </div>
    </div>

    <div class="gallery__controls">
      <button type="button" class="gallery__button" aria-label="Previous photo" @click="go(-1)">
        <LucideChevronLeft :size="16" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="gallery__button"
        :aria-label="playing ? 'Pause slideshow' : 'Play slideshow'"
        :aria-pressed="playing"
        @click="toggle"
      >
        <LucidePause v-if="playing" :size="14" fill="currentColor" aria-hidden="true" />
        <LucidePlay v-else :size="14" fill="currentColor" aria-hidden="true" />
      </button>
      <button type="button" class="gallery__button" aria-label="Next photo" @click="go(1)">
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

<style scoped>
.gallery {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.gallery__slides {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background: var(--color-zh-soft);
}
.gallery__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.gallery__slide.is-current {
  opacity: 1;
}
.gallery__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Three round buttons centred under the card, as on america.gov */
.gallery__controls {
  position: absolute;
  top: calc(100% + 1.25rem);
  left: 50%;
  display: flex;
  gap: 0.5rem;
  transform: translateX(-50%);
}
.gallery__button {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-navy);
  box-shadow: 0 1px 2px rgb(0 12 31 / 0.08), 0 4px 10px -4px rgb(0 12 31 / 0.2);
  transition: background-color 0.2s, color 0.2s;
}
.gallery__button:hover {
  background: var(--color-zh-navy);
  color: #fff;
}
@media (prefers-reduced-motion: reduce) {
  .gallery__slide {
    transition: none;
  }
}
</style>
