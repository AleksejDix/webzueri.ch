<template>
  <section
    class="mx-auto w-[min(100%,max(56rem,60vw),calc((100svh_-_22rem)_*_16_/_9))]"
    aria-roledescription="carousel"
    aria-label="Zürich"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- The card grows with the screen, but never so tall that the controls fall below the fold -->
    <div
      class="relative aspect-video min-h-[22rem] rounded-4xl bg-soft shadow-[0_50px_100px_-40px_rgb(var(--wz-shadow)/0.45),0_20px_40px_-30px_rgb(var(--wz-shadow)/0.3)]"
    >
      <TransitionGroup name="photo">
        <img
          v-for="(photo, i) in photos"
          v-show="i === current"
          :key="photo.src"
          :src="`${photo.src}?w=1800&q=75&auto=format&fit=crop`"
          :srcset="`${photo.src}?w=900&q=75&auto=format&fit=crop 900w, ${photo.src}?w=1800&q=75&auto=format&fit=crop 1800w`"
          sizes="(min-width: 1100px) 64rem, 100vw"
          :alt="photo.alt"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : undefined"
          class="absolute inset-0 h-full w-full rounded-[inherit] object-cover"
          :style="{ objectPosition: photo.position }"
        />
      </TransitionGroup>
      <!-- The search bar sits on the photo -->
      <div class="absolute inset-x-[clamp(0.75rem,6vw,4rem)] top-[clamp(0.75rem,2vw,1.25rem)] z-2">
        <slot />
      </div>
    </div>

    <div class="mt-6 flex justify-center gap-2">
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.1),0_6px_14px_-6px_rgb(var(--wz-shadow)/0.25)] [transition:translate_0.2s] hover:-translate-y-px"
        aria-label="Previous photo"
        @click="go(-1)"
      >
        <LucideChevronLeft :size="16" />
      </button>
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.1),0_6px_14px_-6px_rgb(var(--wz-shadow)/0.25)] [transition:translate_0.2s] hover:-translate-y-px"
        :aria-label="playing ? 'Pause photos' : 'Play photos'"
        @click="playing = !playing"
      >
        <LucidePause v-if="playing" :size="13" fill="currentColor" />
        <LucidePlay v-else :size="13" fill="currentColor" />
      </button>
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.1),0_6px_14px_-6px_rgb(var(--wz-shadow)/0.25)] [transition:translate_0.2s] hover:-translate-y-px"
        aria-label="Next photo"
        @click="go(1)"
      >
        <LucideChevronRight :size="16" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

// Photos from Unsplash (free to use under the Unsplash License).
// Swap these for photos from our own meetups when we have good ones.
const photos = [
  {
    // unsplash.com/photos/a-blue-and-white-trolley-on-a-city-street-alWvXLvctqA
    src: "https://images.unsplash.com/photo-1635922532367-401fce66aa1b",
    alt: "A blue and white Zürich tram under autumn trees",
    position: "50% 60%",
  },
  {
    // unsplash.com/photos/a-river-running-through-a-city-next-to-tall-buildings-IgmUhrXG...
    src: "https://images.unsplash.com/photo-1679655133713-6a7d8316baba",
    alt: "The Limmat and Zürich's old town at dusk",
    position: "50% 50%",
  },
  {
    // unsplash.com/photos/a-blue-and-white-train-traveling-down-a-street-next-to-tall-bu...
    src: "https://images.unsplash.com/photo-1585586465059-4e9b9999bf1f",
    alt: "A tram passing through Zürich's old town",
    position: "50% 55%",
  },
  {
    // unsplash.com/photos/blue-and-white-tram-beside-gray-concrete-multi-story-building-...
    src: "https://images.unsplash.com/photo-1553379027-a0120ebdab01",
    alt: "A blue and white tram in front of apartment buildings",
    position: "50% 60%",
  },
];

const current = ref(0);
const playing = ref(false);
const hovering = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

function go(delta: number) {
  current.value = (current.value + delta + photos.length) % photos.length;
}
watch(playing, (on) => {
  clearInterval(timer);
  if (on) timer = setInterval(() => !hovering.value && go(1), 6000);
});
onMounted(() => {
  playing.value = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
/* Vue transition classes for the cross-fade */
.photo-enter-active,
.photo-leave-active {
  transition: opacity 1.2s ease;
}
.photo-enter-from,
.photo-leave-to {
  opacity: 0;
}
</style>
