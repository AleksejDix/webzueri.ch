<template>
  <div class="flex items-center gap-4">
    <div 
      class="flex-shrink-0 relative"
      :class="{
        'w-20 h-20': size === 'default',
        'w-24 h-24': size === 'xl'
      }"
    >
      <img 
        v-if="photo"
        :src="photo"
        :alt="name"
        class="absolute inset-auto  w-full h-full object-cover rounded-full"
      />
      <div v-else class="absolute inset-auto w-full h-full">
        <span class="text-gray-400" :class="{ 'text-xl': size === 'default', 'text-3xl': size === 'xl' }">👤</span>
      </div>
      <div class="absolute inset-auto"></div>
    </div>
    <div class="flex-1 leading-tight">
      <h3 class="text-black" :class="{ 'text-base font-medium': size === 'default', 'text-2xl font-bold': size === 'xl' }">{{ name }}</h3>
      <slot></slot>
      <div v-if="meta" class="text-gray-600" :class="{ 'text-sm': size === 'default', 'text-base': size === 'xl' }">{{ meta }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  meta: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'xl'].includes(value)
  }
});
</script> 