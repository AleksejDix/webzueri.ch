<template>
  <section
    class="hero-card"
    aria-roledescription="carousel"
    aria-label="Zürich"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="hero-card__stage">
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
          class="hero-card__photo"
          :style="{ objectPosition: photo.position }"
        />
      </TransitionGroup>
      <!-- The search bar sits on the photo -->
      <div class="hero-card__overlay">
        <slot />
      </div>
    </div>

    <div class="hero-card__controls">
      <button type="button" class="hero-card__btn" aria-label="Previous photo" @click="go(-1)">
        <LucideChevronLeft :size="16" />
      </button>
      <button type="button" class="hero-card__btn" :aria-label="playing ? 'Pause photos' : 'Play photos'" @click="playing = !playing">
        <LucidePause v-if="playing" :size="13" fill="currentColor" />
        <LucidePlay v-else :size="13" fill="currentColor" />
      </button>
      <button type="button" class="hero-card__btn" aria-label="Next photo" @click="go(1)">
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
.hero-card {
  /* Grows with the screen, but never so tall that the controls fall below the fold */
  width: min(100%, max(56rem, 60vw), calc((100svh - 22rem) * 16 / 9));
  margin-inline: auto;
}
.hero-card__stage {
  position: relative;
  aspect-ratio: 16 / 9;
  min-height: 22rem;
  border-radius: 2rem;
  background: var(--color-zh-soft);
  box-shadow: 0 50px 100px -40px rgb(0 12 31 / 0.45), 0 20px 40px -30px rgb(0 12 31 / 0.3);
}
.hero-card__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
.hero-card__overlay {
  position: absolute;
  inset: clamp(0.75rem, 2vw, 1.25rem) clamp(0.75rem, 6vw, 4rem) auto;
  z-index: 2;
}
.hero-card__controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.hero-card__btn {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-navy);
  box-shadow: 0 1px 2px rgb(0 12 31 / 0.1), 0 6px 14px -6px rgb(0 12 31 / 0.25);
  transition: transform 0.2s;
}
.hero-card__btn:hover {
  transform: translateY(-1px);
}

.photo-enter-active {
  transition: opacity 1.2s ease;
}
.photo-leave-active {
  transition: opacity 1.2s ease;
}
.photo-enter-from,
.photo-leave-to {
  opacity: 0;
}
</style>
