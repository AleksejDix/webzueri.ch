<template>
  <img
    v-if="url"
    :src="thumb(url, size * 2)"
    :alt="alt ?? ''"
    :width="size"
    :height="size"
    class="avatar"
    :style="{ width: `${size}px`, height: `${size}px` }"
    loading="lazy"
  />
  <span
    v-else
    class="avatar avatar--initials"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }"
    :aria-label="alt"
    :role="alt ? 'img' : undefined"
  >
    {{ initials(name) }}
  </span>
</template>

<script setup lang="ts">
import { initials } from "~/utils/assets";

const thumb = useThumb();

withDefaults(defineProps<{ url?: string | null; name?: string; alt?: string; size?: number }>(), {
  size: 40,
});
</script>

<style scoped>
.avatar {
  flex: none;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  object-fit: cover;
  background: var(--color-zh-soft);
}
.avatar--initials {
  font-weight: 600;
  color: var(--color-zh-navy);
}
</style>
