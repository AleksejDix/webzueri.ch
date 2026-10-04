<template>
  <div class="img-wrapper ">
    <img 
      :src="transformedImageUrl" 
      :alt="alt" 
      class="w-full h-full object-cover"
      @error="handleImageError"
      :style="{ viewTransitionName: alt.split(' ').join('-')+'-image' }"
    >
    <div v-if="showInitials && !imageLoaded" class="initials">
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

<style scoped>
.img-wrapper {
  background-color: var(--base);
  height: 100%; 
  overflow: hidden;
  position: relative;
  justify-content: center;
  align-items: center;
}

.img-wrapper img {
  flex: 1 0 100%;
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  position: relative;
  width: 100%;
}

.img-wrapper::before {
  bottom: 0;
  content: '';
  height: 100%;
  left: 0;
  mix-blend-mode: var(--fg-blend);
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  pointer-events: none;
}

.initials {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  z-index: 2;
}
</style> 