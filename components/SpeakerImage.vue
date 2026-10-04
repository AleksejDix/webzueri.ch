<template>
  <div class="overflow-hidden w-full h-full">
    <img
      v-if="imageUrl"
      loading="lazy"
      class="w-full h-full object-cover"
      :class="focusClass"
      :src="imageUrl"
      :alt="alt"
      :style="{ viewTransitionName: imageUrl }"
    />
    <div v-else class="w-full h-full flex items-center justify-center">
      <span class="text-gray-500 text-lg">{{ initials }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  imageUrl: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    required: true,
  },
  initials: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: 300,
  },
  height: {
    type: [String, Number],
    default: 300,
  },
});

// CSS class to focus on faces by positioning the image to show upper portion
const focusClass = computed(() => {
  return "object-top";
});
</script>
