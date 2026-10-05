<template>
  <div class="relative h-full items-center justify-center overflow-hidden bg-(--base) before:pointer-events-none before:absolute before:inset-0 before:z-1 before:size-full before:[mix-blend-mode:var(--fg-blend)]">
    <img 
      :src="transformedImageUrl" 
      :alt="alt" 
      class="relative h-full w-full max-w-full flex-[1_0_100%] object-cover"
      @error="handleImageError"
      :style="{ viewTransitionName: alt.split(' ').join('-')+'-image' }"
    >
    <div v-if="showInitials && !imageLoaded" class="absolute z-2 text-[2rem] font-bold text-white">
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  imageUrl: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: ''
  }
});

const imageLoaded = ref(true);
const showInitials = computed(() => props.initials && props.initials.length > 0);

// GraphCMS image transformation base URL
const base = "https://media.graphcms.com/";

// Image transformation parameters
const transformParams = computed(() => {
  return {
    width: props.width,
    height: props.height
  };
});

// Create the transformed image URL
const transformedImageUrl = computed(() => {
  if (!props.imageUrl) return '';
  
  // Check if the URL is already a GraphCMS URL
  if (props.imageUrl.includes('media.graphcms.com')) {
    const handle = props.imageUrl.split('/').pop();
    const transformString = JSON.stringify(transformParams.value)
      .replace(/\"|\{|\}/g, "")
      .replace(/,/g, "/");
      
    return `${base}crop_faces=b:162/output=quality:85/resize=${transformString}/${handle}`;
  }
  
  // If not a GraphCMS URL, return the original
  return props.imageUrl;
});


function handleImageError() {
  imageLoaded.value = false;
}
</script>

