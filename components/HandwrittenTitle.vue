<template>
  <!-- Written with a pen, stroke by stroke; the text itself stays for screen readers and search -->
  <span ref="root" class="handwritten" :class="{ 'handwritten--svg': svgOnly }">
    <span class="sr-only">{{ HANDWRITING.text }}</span>
    <!-- Sets the size, and draws the title itself when there is no JavaScript or no WebGPU -->
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
    <!-- Redraw writes the tapered, gradient-along-the-line version here -->
    <canvas ref="canvas" class="handwritten__canvas" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { HANDWRITING } from "~/utils/handwriting";

// The colours of Apple's "hello", from cyan through violet and pink to orange and green
const INK = ["#2bb7e8", "#4f7bf0", "#8f52e8", "#e14f9a", "#ff6347", "#ffb22e", "#3fcf7a"];
// The dot on the i, in the colour the gradient has on the letter below it
const DOT = "#ff8840";

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

let stop = () => {};

onMounted(async () => {
  try {
    stop = await write(root.value!, canvas.value!);
  } catch (error) {
    // No WebGPU, or it failed: the SVG writes the title instead
    if (navigator.gpu) console.warn("HandwrittenTitle: Redraw failed, using the SVG", error);
    svgOnly.value = true;
  }
});

onBeforeUnmount(() => stop());

// Writes the title with Redraw (redraw.dev) on WebGPU: one tapered brush that
// pinches at every pen lift, and a gradient pinned along the whole line, so
// the pen writes through the colours. Returns a function that tears it down.
async function write(box: HTMLElement, el: HTMLCanvasElement) {
  if (!navigator.gpu) throw new Error("No WebGPU");
  const { createLibrary, parseSVG, GradientAlongPath, SineTaper, SingleStrokeBrush } = await import("redraw");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No WebGPU adapter");
  // Redraw draws straight into the canvas texture when the format allows
  // storage, and otherwise into its own texture that is copied over
  const format = navigator.gpu.getPreferredCanvasFormat();
  const bgraStorage = format === "bgra8unorm" && adapter.features.has("bgra8unorm-storage");
  const device = await adapter.requestDevice({ requiredFeatures: bgraStorage ? ["bgra8unorm-storage"] : [] });
  const direct = format === "rgba8unorm" || bgraStorage;

  const context = el.getContext("webgpu");
  if (!context) throw new Error("No WebGPU context");
  context.configure({
    device,
    format: direct ? format : "rgba8unorm",
    usage: direct ? GPUTextureUsage.STORAGE_BINDING : GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    alphaMode: "premultiplied",
  });
  const library = createLibrary(device);

  // The pen strokes as one path, one contour per stroke, and the dots on their own
  const pens = HANDWRITING.strokes.filter((s) => s.length > 1);
  const line = parseSVG(pens.map((s) => s.d).join(" "));
  const dots = HANDWRITING.strokes.flatMap((s, i) => (s.length > 1 ? [] : [{ path: parseSVG(s.d), at: strokes[i].delay }]));
  const contours = line.splitContours().map((c) => c.length());
  const total = contours.reduce((a, b) => a + b, 0);

  const pen = new SingleStrokeBrush(new SineTaper({ baseWidth: PEN, perContour: true })).addShader(
    new GradientAlongPath(INK, { colorSpace: "oklab", cyclic: false }),
  );
  const dot = new SingleStrokeBrush(PEN * 0.8).setColor(DOT);

  const [vx, vy, vw, vh] = HANDWRITING.viewBox.split(" ").map(Number);
  const slant = Math.tan((SLANT * Math.PI) / 180);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let surface: ReturnType<typeof library.makeCanvas> | undefined;
  let offscreen: GPUTexture | undefined;
  let size = [0, 0];
  let start = performance.now();
  let frame = 0;

  // How much of the line the pen has written by this time, with the pen
  // pausing at each lift as in the SVG version
  const written = (elapsed: number) => {
    let len = 0;
    pens.forEach((s, i) => {
      const { delay, duration } = strokes[HANDWRITING.strokes.indexOf(s)];
      len += Math.min(Math.max((elapsed - delay) / duration, 0), 1) * contours[i];
    });
    return len / total;
  };

  const paint = (elapsed: number) => {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = box.getBoundingClientRect();
    const w = Math.round(width * dpr);
    const h = Math.round(height * dpr);
    if (!w || !h) return;

    if (w !== size[0] || h !== size[1]) {
      size = [w, h];
      el.width = w;
      el.height = h;
      surface?.dispose();
      offscreen?.destroy();
      offscreen = direct
        ? undefined
        : device.createTexture({
            size: [w, h],
            format: "rgba8unorm",
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
          });
      surface = library.makeCanvas(offscreen ?? context.getCurrentTexture());
    }

    const c = surface!;
    c.scale(dpr);
    c.scale(width / vw, height / vh);
    c.translate(-vx, -vy + BASELINE);
    c.concat([1, 0, 0, slant, 1, 0, 0, 0, 1]);
    c.translate(0, -BASELINE);

    const progress = written(elapsed);
    if (progress > 0) c.drawPath(line.segment(0, progress), pen);
    for (const d of dots) if (elapsed >= d.at) c.drawPath(d.path, dot);

    if (offscreen) {
      c.render();
      const encoder = device.createCommandEncoder();
      encoder.copyTextureToTexture({ texture: offscreen }, { texture: context.getCurrentTexture() }, [w, h]);
      device.queue.submit([encoder.finish()]);
    } else {
      c.render(context.getCurrentTexture());
    }
  };

  const tick = (now: number) => {
    const elapsed = now - start;
    paint(elapsed);
    if (elapsed < t) frame = requestAnimationFrame(tick);
  };

  if (reduced) start = -Infinity;
  frame = requestAnimationFrame(tick);

  // Redraws the current frame on resize, also once the writing has finished
  const resize = new ResizeObserver(() => paint(performance.now() - start));
  resize.observe(box);

  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    surface?.dispose();
    offscreen?.destroy();
    device.destroy();
  };
}
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
   stay hidden while Redraw writes the title, and only play on their own
   without JavaScript or without WebGPU */
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
