<template>
  <p
    ref="el"
    class="display mx-auto max-w-[11em] text-center text-[clamp(2.25rem,4.15vw,6rem)] leading-[1.05] *:[--t:clamp(0,calc((var(--p)*(var(--n)+4)-var(--i))/4),1)] *:opacity-[calc(0.14+0.86*var(--t))] *:blur-[calc((1-var(--t))*5px)]"
    :style="{ '--p': progress, '--n': count }"
  >
    <!-- Each token's own progress (--t): words come in one after another, four at a time -->
    <template v-for="(token, i) in tokens" :key="i">
      <span v-if="token.type === 'word'" :style="{ '--i': token.index }">{{ token.text }}</span>
      <span v-else-if="token.type === 'faces'" class="inline-flex scale-[calc(0.7+0.3*var(--t))] align-middle leading-none" :style="{ '--i': token.index }" aria-hidden="true">
        <img v-for="url in token.faces" :key="url" :src="url" alt="" width="64" height="64" loading="lazy" class="size-[0.9em] rounded-full border-3 border-page object-cover shadow-[0_4px_12px_-4px_rgb(var(--wz-shadow)/0.4)] not-first:-ml-[0.3em]" />
      </span>
      <span v-else class="inline-grid size-[0.9em] scale-[calc(0.7+0.3*var(--t))] place-items-center rounded-full bg-accent align-middle leading-none text-white" :style="{ '--i': token.index }" aria-hidden="true">
        <LucidePlay v-if="token.icon === 'play'" :size="22" fill="currentColor" />
        <LucideMic v-else-if="token.icon === 'mic'" :size="22" />
        <LucideMapPin v-else :size="22" />
      </span>
      {{ " " }}
    </template>
  </p>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Part = string | { faces: string[] } | { icon: "play" | "mic" | "pin" };
const props = defineProps<{ parts: Part[] }>();

type Token =
  | { type: "word"; text: string; index: number }
  | { type: "faces"; faces: string[]; index: number }
  | { type: "icon"; icon: string; index: number };

const tokens = computed<Token[]>(() => {
  const out: Token[] = [];
  let index = 0;
  for (const part of props.parts) {
    if (typeof part === "string") {
      for (const text of part.split(/\s+/).filter(Boolean)) out.push({ type: "word", text, index: index++ });
    } else if ("faces" in part) {
      out.push({ type: "faces", faces: part.faces, index: index++ });
    } else {
      out.push({ type: "icon", icon: part.icon, index: index++ });
    }
  }
  return out;
});
const count = computed(() => tokens.value.length);

// Server render and no-JS show the sentence fully; scrolling drives it once mounted
const progress = ref(1);
const el = ref<HTMLElement>();
let frame = 0;

function update() {
  frame = 0;
  if (!el.value) return;
  const rect = el.value.getBoundingClientRect();
  const vh = window.innerHeight;
  // 0 when the sentence enters the lower edge, 1 once its end passes the middle of the screen
  const start = vh * 0.9;
  const end = vh * 0.45 - rect.height;
  progress.value = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
}
const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  cancelAnimationFrame(frame);
});
</script>

