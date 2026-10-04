<template>
  <section class="frame page-hero">
    <div class="page-hero__inner">
      <slot name="before" />
      <h1 class="display page-hero__title">{{ title }}</h1>
      <p v-if="lede" class="lede page-hero__lede">{{ lede }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; lede?: string }>();
</script>

<style scoped>
.page-hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 56rem;
  margin-inline: auto;
  padding: clamp(6rem, 6.23vw, 9rem) clamp(1rem, 1.38vw, 2rem) clamp(3rem, 4vw, 6rem);
  text-align: center;
}
.page-hero__title {
  font-size: clamp(2.75rem, 4.6vw, 7rem);
  line-height: 1;
  animation: hero-rise 0.9s var(--ease-out-soft) both;
}
.page-hero__lede {
  max-width: 36rem;
  margin-top: 1rem;
  animation: hero-rise 0.9s var(--ease-out-soft) 0.1s both;
}
@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
}
</style>
