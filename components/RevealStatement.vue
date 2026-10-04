<template>
  <p ref="el" class="reveal display" :style="{ '--p': progress, '--n': count }">
    <template v-for="(token, i) in tokens" :key="i">
      <span v-if="token.type === 'word'" class="reveal__word" :style="{ '--i': token.index }">{{ token.text }}</span>
      <span v-else-if="token.type === 'faces'" class="reveal__inline reveal__faces" :style="{ '--i': token.index }" aria-hidden="true">
        <img v-for="url in token.faces" :key="url" :src="url" alt="" width="64" height="64" loading="lazy" />
      </span>
      <span v-else class="reveal__inline reveal__icon" :style="{ '--i': token.index }" aria-hidden="true">
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

<style scoped>
.reveal {
  max-width: 11em;
  margin-inline: auto;
  font-size: clamp(2.25rem, 4.15vw, 6rem);
  line-height: 1.05;
  text-align: center;
}
/* Each token's own progress: words come in one after another, four at a time */
.reveal__word,
.reveal__inline {
  --t: clamp(0, calc((var(--p) * (var(--n) + 4) - var(--i)) / 4), 1);
  opacity: calc(0.14 + 0.86 * var(--t));
  filter: blur(calc((1 - var(--t)) * 5px));
}
.reveal__inline {
  display: inline-flex;
  vertical-align: middle;
  line-height: 1;
  transform: scale(calc(0.7 + 0.3 * var(--t)));
}
.reveal__faces img {
  width: 0.9em;
  height: 0.9em;
  border-radius: 999px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px -4px rgb(0 12 31 / 0.4);
}
.reveal__faces img + img {
  margin-left: -0.3em;
}
.reveal__icon {
  display: inline-grid;
  place-items: center;
  width: 0.9em;
  height: 0.9em;
  border-radius: 999px;
  background: var(--color-zh-blue);
  color: #fff;
}
</style>
