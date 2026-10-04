<template>
  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <!-- Close icon -->
    <path v-if="type === 'close'" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    
    <!-- Tune/Filter icon -->
    <path v-else-if="type === 'tune'" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
    
    <!-- Add icon -->
    <path v-else-if="type === 'add'" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    
    <!-- Default icon (question mark) -->
    <path v-else d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
  </svg>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default'
  }
});
</script> 