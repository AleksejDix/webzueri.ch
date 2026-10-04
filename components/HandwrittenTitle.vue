<template>
  <!-- Written with a pen, stroke by stroke; the text itself stays for screen readers and search -->
  <span class="handwritten">
    <span class="sr-only">{{ HANDWRITING.text }}</span>
    <svg class="handwritten__svg" :viewBox="HANDWRITING.viewBox" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient :id="ink" gradientUnits="userSpaceOnUse" x1="160" x2="1380" y1="0" y2="0">
          <stop v-for="(c, i) in INK" :key="i" :offset="i / (INK.length - 1)" :stop-color="c" />
        </linearGradient>
      </defs>
      <!-- One even forward slant, as if written in a single quick movement -->
      <g transform="translate(0 300) skewX(-8) translate(0 -300)">
      <path
        v-for="(s, i) in strokes"
        :key="i"
        :d="s.d"
        pathLength="1"
        fill="none"
        :stroke="`url(#${ink})`"
        :stroke-width="HANDWRITING.pen"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="handwritten__stroke"
        :style="{ '--delay': `${s.delay}ms`, '--duration': `${s.duration}ms` }"
      />
      </g>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useId } from "vue";
import { HANDWRITING } from "~/utils/handwriting";

// The colours of Apple's "hello", from cyan through violet and pink to orange and green
const INK = ["#2bb7e8", "#4f7bf0", "#8f52e8", "#e14f9a", "#ff6347", "#ffb22e", "#3fcf7a"];

// One even pen speed (units per ms) and barely a pause where the pen lifts,
// so the whole title reads as a single movement of the hand
const SPEED = 2.6;
const LIFT = 50;
const ink = `ink-${useId()}`;

let t = 200;
const strokes = HANDWRITING.strokes.map((s) => {
  const duration = Math.max(120, Math.round(s.length / SPEED));
  const out = { d: s.d, delay: t, duration };
  t += duration + LIFT;
  return out;
});
</script>

<style scoped>
.handwritten {
  display: block;
  width: 100%;
}
.handwritten__svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
/* Each stroke is drawn by revealing its dash, one after another */
.handwritten__stroke {
  /* Dash and gap longer than the path, starting just before it, so no round
     pen end shows until the stroke is actually being drawn */
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1.02;
  animation: write var(--duration) linear var(--delay) forwards;
}
@keyframes write {
  to {
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .handwritten__stroke {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
