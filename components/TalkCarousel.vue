<template>
  <section
    class="mx-auto w-[min(100%,56rem)]"
    aria-roledescription="carousel"
    aria-label="Recently recorded talks"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="hovering = true"
    @focusout="hovering = false"
  >
    <div class="tile relative aspect-video bg-deep shadow-[0_40px_80px_-40px_rgb(var(--wz-shadow)/0.55)]">
      <TransitionGroup name="slide">
        <NuxtLink
          v-for="(talk, i) in talks"
          v-show="i === current"
          :key="talk.id"
          :to="`/talks/${talk.id}`"
          class="group/slide absolute inset-0 block text-white"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} of ${talks.length}`"
          :aria-hidden="i !== current"
          :tabindex="i === current ? 0 : -1"
        >
          <YtThumb :id="talk.youtubecode" :eager="i === 0" hd alt="" />
          <span class="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_42_82/0.85),rgb(0_42_82/0)_55%)]" aria-hidden="true" />
          <span class="carousel__caption absolute inset-x-0 bottom-0 flex items-center gap-4 p-[clamp(1rem,3vw,2rem)] text-left">
            <span
              class="grid size-12 flex-none place-items-center rounded-full bg-raised pl-0.5 text-link transition-transform duration-300 ease-out-soft group-hover/slide:scale-108"
              aria-hidden="true"
            ><LucidePlay :size="18" fill="currentColor" /></span>
            <span class="min-w-0">
              <span class="block font-display text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.02em] text-balance">{{ talk.name }}</span>
              <span class="mt-1 block text-[0.9375rem] text-[rgb(255_255_255/0.85)]">{{ talk.speakers.map((s) => s.name).join(", ") }}</span>
            </span>
          </span>
        </NuxtLink>
      </TransitionGroup>
    </div>

    <div class="mt-4 flex justify-center gap-2">
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.12),0_4px_12px_-4px_rgb(var(--wz-shadow)/0.2)] [transition:color_0.2s,translate_0.2s] hover:-translate-y-px hover:text-link"
        aria-label="Previous talk"
        @click="go(-1)"
      >
        <LucideChevronLeft :size="16" />
      </button>
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.12),0_4px_12px_-4px_rgb(var(--wz-shadow)/0.2)] [transition:color_0.2s,translate_0.2s] hover:-translate-y-px hover:text-link"
        :aria-label="playing ? 'Pause rotation' : 'Play rotation'"
        @click="playing = !playing"
      >
        <LucidePause v-if="playing" :size="14" fill="currentColor" />
        <LucidePlay v-else :size="14" fill="currentColor" />
      </button>
      <button
        type="button"
        class="grid size-9 place-items-center rounded-full bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.12),0_4px_12px_-4px_rgb(var(--wz-shadow)/0.2)] [transition:color_0.2s,translate_0.2s] hover:-translate-y-px hover:text-link"
        aria-label="Next talk"
        @click="go(1)"
      >
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
/* Vue transition classes for the cross-fade */
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
