<template>
  <section
    class="carousel"
    aria-roledescription="carousel"
    aria-label="Recently recorded talks"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="hovering = true"
    @focusout="hovering = false"
  >
    <div class="carousel__stage tile">
      <TransitionGroup name="slide">
        <NuxtLink
          v-for="(talk, i) in talks"
          v-show="i === current"
          :key="talk.id"
          :to="`/talks/${talk.id}`"
          class="carousel__slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} of ${talks.length}`"
          :aria-hidden="i !== current"
          :tabindex="i === current ? 0 : -1"
        >
          <YtThumb :id="talk.youtubecode" :eager="i === 0" hd alt="" />
          <span class="carousel__shade" aria-hidden="true" />
          <span class="carousel__caption">
            <span class="carousel__play" aria-hidden="true"><LucidePlay :size="18" fill="currentColor" /></span>
            <span class="min-w-0">
              <span class="carousel__title">{{ talk.name }}</span>
              <span class="carousel__speaker">{{ talk.speakers.map((s) => s.name).join(", ") }}</span>
            </span>
          </span>
        </NuxtLink>
      </TransitionGroup>
    </div>

    <div class="carousel__controls">
      <button type="button" class="carousel__btn" aria-label="Previous talk" @click="go(-1)">
        <LucideChevronLeft :size="16" />
      </button>
      <button
        type="button"
        class="carousel__btn"
        :aria-label="playing ? 'Pause rotation' : 'Play rotation'"
        @click="playing = !playing"
      >
        <LucidePause v-if="playing" :size="14" fill="currentColor" />
        <LucidePlay v-else :size="14" fill="currentColor" />
      </button>
      <button type="button" class="carousel__btn" aria-label="Next talk" @click="go(1)">
        <LucideChevronRight :size="16" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import YtThumb from "~/components/YtThumb.vue";

interface Talk {
  id: string;
  name: string;
  youtubecode: string;
  speakers: { name: string }[];
}
const props = defineProps<{ talks: Talk[] }>();

const current = ref(0);
const playing = ref(false);
const hovering = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

function go(delta: number) {
  const n = props.talks.length;
  current.value = (current.value + delta + n) % n;
}

function restart() {
  clearInterval(timer);
  if (playing.value) timer = setInterval(() => !hovering.value && go(1), 6000);
}
watch(playing, restart);

onMounted(() => {
  playing.value = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.carousel {
  width: min(100%, 56rem);
  margin-inline: auto;
}
.carousel__stage {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--color-zh-navy);
  box-shadow: 0 40px 80px -40px rgb(0 12 31 / 0.55);
}
.carousel__slide {
  position: absolute;
  inset: 0;
  display: block;
  color: #fff;
}
.carousel__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 42 82 / 0.85), rgb(0 42 82 / 0) 55%);
}
.carousel__caption {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: clamp(1rem, 3vw, 2rem);
  text-align: left;
}
.carousel__play {
  flex: none;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  padding-left: 2px;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-blue);
  transition: transform 0.3s var(--ease-out-soft);
}
.carousel__slide:hover .carousel__play {
  transform: scale(1.08);
}
.carousel__title {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.6vw, 2rem);
  letter-spacing: -0.02em;
  line-height: 1.15;
  text-wrap: balance;
}
.carousel__speaker {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.9375rem;
  color: rgb(255 255 255 / 0.85);
}

.carousel__controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.carousel__btn {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-navy);
  box-shadow: 0 1px 2px rgb(0 12 31 / 0.12), 0 4px 12px -4px rgb(0 12 31 / 0.2);
  transition: color 0.2s, transform 0.2s;
}
.carousel__btn:hover {
  color: var(--color-zh-blue);
  transform: translateY(-1px);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.8s ease, transform 1.2s var(--ease-out-soft);
}
.slide-enter-from {
  opacity: 0;
  transform: scale(1.04);
}
.slide-leave-to {
  opacity: 0;
}
/* Only one caption at a time while the images cross-fade */
.slide-leave-active .carousel__caption {
  opacity: 0;
  transition: opacity 0.15s;
}
.slide-enter-active .carousel__caption {
  animation: caption-in 0.6s var(--ease-out-soft) 0.35s both;
}
@keyframes caption-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
}
</style>
