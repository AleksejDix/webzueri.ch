<template>
  <img
    ref="img"
    :src="src"
    :alt="alt"
    crossorigin="anonymous"
    loading="lazy"
    class="max-h-full max-w-full object-contain transition-[filter,opacity] duration-300 ease-[ease]"
    :class="[`is-${tone}`, tones[tone]]"
    :style="size"
    @load="detect"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  src: string;
  alt: string;
  // Optical sizing: give every logo the same visual area (in px²) instead of the
  // same width or height, so wide wordmarks don't dwarf compact marks
  area?: number;
  maxWidth?: number;
}>();
const size = ref<Record<string, string>>({});

/*
 * Logos arrive in two kinds: marks on a transparent background (often white,
 * made for dark slides) and artwork with a solid background baked in. The first
 * become ink marks with brightness(0); the second would turn into a black box
 * that way, so they get greyscale + multiply instead, which lets white vanish.
 * We tell them apart by the corner pixels once the image has loaded.
 */
const img = ref<HTMLImageElement>();
const tone = ref<"pending" | "ink" | "solid">("pending");
// The is-* class stays as a hook for parents; in dark mode the marks are inverted to light
const tones = {
  pending: "opacity-0",
  ink: "brightness-0 opacity-72 dark:invert",
  solid: "grayscale mix-blend-multiply opacity-85 dark:invert dark:mix-blend-screen",
};

function detect() {
  const el = img.value;
  if (!el || !el.naturalWidth) return;
  if (props.area) {
    const ratio = el.naturalWidth / el.naturalHeight;
    const width = Math.min(Math.sqrt(props.area * ratio), props.maxWidth ?? Infinity);
    size.value = { width: `${Math.round(width)}px`, height: `${Math.round(width / ratio)}px`, maxWidth: "none", maxHeight: "none" };
  }
  try {
    const px = 24;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = px;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(el, 0, 0, px, px);
    const corners = [
      [0, 0],
      [px - 1, 0],
      [0, px - 1],
      [px - 1, px - 1],
    ].map(([x, y]) => ctx.getImageData(x!, y!, 1, 1).data[3]!);
    tone.value = corners.every((alpha) => alpha > 240) ? "solid" : "ink";
  } catch {
    // Canvas blocked (no CORS): ink marks are the safer default
    tone.value = "ink";
  }
}

// The load event can fire before hydration attaches the listener
onMounted(() => {
  if (img.value?.complete) detect();
});
</script>

