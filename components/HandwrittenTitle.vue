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
    <!-- Redraw writes the luminous version here -->
    <canvas ref="canvas" class="handwritten__canvas" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { HANDWRITING } from "~/utils/handwriting";

// The colours of Apple's "hello", from cyan through violet and pink to orange
// and green; Redraw runs them along the line as light (utils/lightInk.ts
// has its own copy), the SVG draws them flat from left to right
const INK = ["#2bb7e8", "#4f7bf0", "#8f52e8", "#e14f9a", "#ff6347", "#ffb22e", "#3fcf7a"];
// Where the letters under the dots sit along the line (the ü twice, then the
// i), so each dot takes its letter's colour
const DOTS_AT = [0.564, 0.618, 0.739];

// One even pen speed (units per ms) and barely a pause where the pen lifts,
// so the whole title reads as a single movement of the hand
const SPEED = 2.6;
const LIFT = 50;
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

// Writes the title with Redraw (redraw.dev) on WebGPU as a line of light
// (utils/lightInk.ts). Returns a function that tears it down.
async function write(box: HTMLElement, el: HTMLCanvasElement) {
  if (!navigator.gpu) throw new Error("No WebGPU");
  const [{ createLibrary, parseSVG, SingleStrokeBrush }, { InkWidth, LightGlow, LightInk }] = await Promise.all([
    import("redraw"),
    import("~/utils/lightInk"),
  ]);

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
  const library = createLibrary(device, [InkWidth, LightInk, LightGlow]);

  // The pen strokes as one path, one contour per stroke, and the dots on their own
  const pens = HANDWRITING.strokes.filter((s) => s.length > 1);
  const line = parseSVG(pens.map((s) => s.d).join(" "));
  const dots = HANDWRITING.strokes
    .flatMap((s, i) => (s.length > 1 ? [] : [{ path: parseSVG(s.d), at: strokes[i].delay }]))
    .map((dot, i) => ({ ...dot, colorAt: DOTS_AT[i] }));
  const contours = line.splitContours().map((c) => c.length());
  const total = contours.reduce((a, b) => a + b, 0);
  // Redraw blends nearby parts of one stroke into a single shape, so where the
  // line loops over itself the two passes meet in a seam. Drawn in short
  // pieces, one after another, each piece lies on top of what came before, as
  // with a real pen; neighbouring pieces share their colour where they meet
  const piece = 120 / total;

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

    // Draws a part of the line, from and to places on the whole line (0 to 1)
    const ink = (shader: typeof LightInk, path: typeof line, from: number, to: number, progress: number) => {
      const brush = new SingleStrokeBrush(InkWidth, { progress, pathStart: from, pathEnd: to });
      c.drawPath(path, brush.addShader(shader, { pathStart: from, pathEnd: to }));
    };
    const progress = written(elapsed);
    const dotsDown = dots.filter((d) => elapsed >= d.at);

    // The glow first, under everything, then the line piece by piece
    if (progress > 0) ink(LightGlow, line.segment(0, progress), 0, progress, progress);
    for (const d of dotsDown) ink(LightGlow, d.path, d.colorAt, d.colorAt, 1);
    for (let from = 0; from < progress; from += piece) {
      const to = Math.min(from + piece, progress);
      ink(LightInk, line.segment(from, to), from, to, progress);
    }
    for (const d of dotsDown) ink(LightInk, d.path, d.colorAt, d.colorAt, 1);

    if (offscreen) {
      c.render();
      const encoder = device.createCommandEncoder();
      encoder.copyTextureToTexture({ texture: offscreen }, { texture: context.getCurrentTexture() }, [w, h]);
      device.queue.submit([encoder.finish()]);
    } else {
      c.render(context.getCurrentTexture());
    }
  };

  // A frame that fails hands the title over to the SVG for good
  const draw = (elapsed: number) => {
    try {
      paint(elapsed);
      return true;
    } catch (error) {
      console.warn("HandwrittenTitle: Redraw failed, using the SVG", error);
      svgOnly.value = true;
      resize.disconnect();
      return false;
    }
  };

  const tick = (now: number) => {
    const elapsed = now - start;
    if (draw(elapsed) && elapsed < t) frame = requestAnimationFrame(tick);
  };

  // Redraws the current frame on resize, also once the writing has finished
  const resize = new ResizeObserver(() => draw(performance.now() - start));

  if (reduced) start = -Infinity;
  frame = requestAnimationFrame(tick);
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
