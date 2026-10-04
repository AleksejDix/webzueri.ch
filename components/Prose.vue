<template>
  <div class="prose prose-lg">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'default'
  }
});
</script>

