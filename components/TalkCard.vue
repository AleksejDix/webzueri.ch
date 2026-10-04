<template>
  <div class="talk-card">
    <div class="flex flex-col">
      <!-- Talk header with title and category -->
      <div class="flex items-center justify-between">
        <h3 class="font-medium text-gray-900 group-hover:text-gray-700">{{ talk.name }}</h3>
        <slot name="category"></slot>
      </div>
      
      <!-- Abstract preview -->
      <p v-if="talk.abstract" class="mt-2 text-sm text-gray-500 line-clamp-2">
        {{ talk.abstract }}
      </p>
      
      <!-- Video indicator -->
      <div v-if="talk.youtubecode" class="mt-2 text-xs text-gray-400">
        Video available
      </div>
      
      <!-- Video embed -->
      <div v-if="talk.youtubecode && showVideo" class="mt-4 aspect-video">
        <iframe 
          width="100%" 
          height="100%" 
          :src="`https://www.youtube.com/embed/${talk.youtubecode}`" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>

      
      
      <!-- Speakers -->
      <div v-if="talk.speakers && talk.speakers.length > 0" class="mt-3 pt-2" 
           :class="{'border-t border-gray-50': !hideTopBorder}">
        <div v-for="speaker in talk.speakers" :key="speaker.id" class="mt-2">
          <SpeakerCard 
            :speaker="speaker" 
            :showTalkCount="false" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SpeakerCard from '~/components/SpeakerCard.vue';

defineProps({
  talk: {
    type: Object,
    required: true
  },
  showVideo: {
    type: Boolean,
    default: false
  },
  hideTopBorder: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 