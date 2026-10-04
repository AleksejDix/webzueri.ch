<template>
  <!-- Written with a pen, stroke by stroke; the text itself stays for screen readers and search -->
  <span ref="root" class="handwritten" :class="{ 'handwritten--svg': svgOnly }">
    <span class="sr-only">{{ HANDWRITING.text }}</span>
    <!-- Sets the size, and draws the title itself when there is no JavaScript or no canvas -->
    <svg class="handwritten__svg" :viewBox="HANDWRITING.viewBox" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient :id="ink" gradientUnits="userSpaceOnUse" x1="160" x2="1380" y1="0" y2="0">
          <stop v-for="(c, i) in INK" :key="i" :offset="i / (INK.length - 1)" :stop-color="c" />
        </linearGradient>
      </defs>
      <!-- One even forward slant, as if written in a single quick movement -->
      <g :transform="`translate(0 ${BASELINE}) skewX(${SLANT}) translate(0 ${-BASELINE})`">
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
    <!-- The tapered, gradient-along-the-line version -->
    <canvas ref="canvas" class="handwritten__canvas" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { HANDWRITING } from "~/utils/handwriting";
import { drawInk, sampleInk } from "~/utils/ink";

// The colours of Apple's "hello", from cyan through violet and pink to orange and green
const INK = ["#2bb7e8", "#4f7bf0", "#8f52e8", "#e14f9a", "#ff6347", "#ffb22e", "#3fcf7a"];

// One even pen speed (units per ms) and barely a pause where the pen lifts,
// so the whole title reads as a single movement of the hand
const SPEED = 2.6;
const LIFT = 50;
// The tapered pen is a touch fuller than the plain one, since its ends are thin
const PEN = HANDWRITING.pen * 1.1;
const BASELINE = 300;
const SLANT = -8;
const ink = `ink-${useId()}`;

let t = 200;
const strokes = HANDWRITING.strokes.map((s) => {
  const duration = Math.max(120, Math.round(s.length / SPEED));
  const out = { d: s.d, delay: t, duration };
  t += duration + LIFT;
  return out;
});

const root = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const svgOnly = ref(false);

let frame = 0;
let resize: ResizeObserver | undefined;

onMounted(() => {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx || !root.value) {
    svgOnly.value = true;
    return;
  }

  const lines = sampleInk(HANDWRITING.strokes.map((s) => s.d), INK);
  const [vx, vy, vw, vh] = HANDWRITING.viewBox.split(" ").map(Number);
  let drawn = lines.map(() => 0);

  const paint = () => {
    const c = canvas.value!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.scale(c.width / vw, c.height / vh);
    ctx.translate(-vx, -vy + BASELINE);
    ctx.transform(1, 0, Math.tan((SLANT * Math.PI) / 180), 1, 0, 0);
    ctx.translate(0, -BASELINE);
    drawInk(ctx, lines, drawn, PEN);
  };

  resize = new ResizeObserver(([entry]) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.value!.width = Math.round(entry.contentRect.width * dpr);
    canvas.value!.height = Math.round(entry.contentRect.height * dpr);
    paint();
  });
  resize.observe(root.value);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawn = lines.map((s) => s.length);
    paint();
    return;
  }

  const start = performance.now();
  const tick = (now: number) => {
    const elapsed = now - start;
    drawn = lines.map((s, i) => {
      const { delay, duration } = strokes[i];
      return Math.min(Math.max((elapsed - delay) / duration, 0), 1) * s.length;
    });
    paint();
    if (elapsed < t) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  resize?.disconnect();
});
</script>

<style scoped>
.handwritten {
  position: relative;
  display: block;
  width: 100%;
}
.handwritten__svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.handwritten__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.handwritten--svg .handwritten__canvas {
  display: none;
}
/* Each stroke is drawn by revealing its dash, one after another. The strokes
   stay hidden while the canvas writes the title, and only play on their own
   without JavaScript or without a canvas */
.handwritten__stroke {
  /* Dash and gap longer than the path, starting just before it, so no round
     pen end shows until the stroke is actually being drawn */
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1.02;
}
.handwritten--svg .handwritten__stroke {
  animation: write var(--duration) linear var(--delay) forwards;
}
@media (scripting: none) {
  .handwritten__stroke {
    animation: write var(--duration) linear var(--delay) forwards;
  }
}
@keyframes write {
  to {
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .handwritten--svg .handwritten__stroke {
    animation: none;
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) and (scripting: none) {
  .handwritten__stroke {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
