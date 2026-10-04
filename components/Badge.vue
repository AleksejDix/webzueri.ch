<template>
  <span 
    class="inline-block px-3 py-1 text-sm font-medium rounded-full cursor-pointer"
    :class="colorClasses"
    @click="$emit('click')"
  >
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'gray'
  }
});

const colorClasses = computed(() => {
  const colors = {
    purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    green: 'bg-green-100 text-green-800 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    red: 'bg-red-100 text-red-800 hover:bg-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    black: 'bg-gray-800 text-white hover:bg-gray-900'
  };
  
  return colors[props.color] || colors.gray;
});

defineEmits(['click']);
</script> 