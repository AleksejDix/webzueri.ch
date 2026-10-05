<template>
  <section class="frame">
    <div class="mx-auto flex max-w-4xl flex-col items-center px-[clamp(1rem,1.38vw,2rem)] pt-[clamp(6rem,6.23vw,9rem)] pb-[clamp(3rem,4vw,6rem)] text-center">
      <slot name="before" />
      <h1 class="display page-hero__title text-[clamp(2.75rem,4.6vw,7rem)] leading-none">{{ title }}</h1>
      <p v-if="lede" class="lede page-hero__lede mt-4 max-w-xl">{{ lede }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; lede?: string }>();
</script>

<style scoped>
/* Scoped keyframe names are rewritten by Vue, so the animations that use them stay here */
.page-hero__title {
  animation: hero-rise 0.9s var(--ease-out-soft) both;
}
.page-hero__lede {
  animation: hero-rise 0.9s var(--ease-out-soft) 0.1s both;
}
@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
}
</style>
