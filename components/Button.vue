<template>
  <NuxtLink 
    v-if="href" 
    :to="href"
    class="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    :target="target"
  >
    <span v-if="$slots.start" class="mr-2">
      <slot name="start"></slot>
    </span>
    <slot></slot>
    <span v-if="$slots.end" class="ml-2">
      <slot name="end"></slot>
    </span>
  </NuxtLink>
  
  <button 
    v-else 
    class="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span v-if="$slots.start" class="mr-2">
      <slot name="start"></slot>
    </span>
    <slot></slot>
    <span v-if="$slots.end" class="ml-2">
      <slot name="end"></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  target: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script> 