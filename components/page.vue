<template>
  <div
    :class="[ isShifted ? 'fixed w-full': '']"
    :style="{'top': offset}"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useModal } from '~/composables/useModal';

const offset = ref(0);
const modal = useModal();

const isShifted = computed(() => {
  if (process.server) return false;
  return modal.isOpen.value;
});

watch(isShifted, (value) => {
  if (process.server) return;
  
  // Get current element position
  const el = document.querySelector('div');
  if (!el) return;
  
  const { top } = el.getBoundingClientRect();
  offset.value = `${top}px`;
  
  if (!value) window.scrollTo(0, 0);
  window.scrollTo(0, 0);
});
</script> 