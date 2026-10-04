<template>
  <img
    ref="img"
    :src="src"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    class="h-full w-full object-cover"
    @load="check"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

// YouTube serves a 120px grey placeholder (with a 404) when no HD thumbnail
// exists, so fall back to the always-present 640px version.
const props = defineProps<{ id: string; alt?: string; eager?: boolean; hd?: boolean }>();
const img = ref<HTMLImageElement>();
const src = ref(`https://i.ytimg.com/vi/${props.id}/${props.hd ? "maxresdefault" : "sddefault"}.jpg`);

function check() {
  if (img.value && img.value.naturalWidth > 0 && img.value.naturalWidth < 200) {
    src.value = `https://i.ytimg.com/vi/${props.id}/sddefault.jpg`;
  }
}
// The load event can fire before hydration attaches the listener
onMounted(() => {
  if (img.value?.complete) check();
});
</script>
