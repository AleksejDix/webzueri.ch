<template>
  <div :class="[
      { 'prose--on-light' : color === 'on-light'},
      { 'prose--on-dark' : color === 'on-dark'}
    ]" class="prose">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['color']
}
</script>


<style>
  .prose {
    @apply text-11 leading-normal text-current-color;
  }
  .prose--on-dark {
    @apply text-on-dark-secondary;
  }
  .prose--on-light {
    @apply text-on-light-secondary;
  }

  .prose strong,
  .prose b {
    font-weight: bold;
  }

  .prose i,
  .prose italic {
    font-style: oblique;
  }

  .prose a {
    transition: background-color 120ms;
    text-decoration: none;
    @apply border-b border-2 border-secondary text-current-color relative;
  }

  .prose a:hover {
    @apply bg-secondary;
  }

  .prose h1 {
    @apply text-24;
  }

  .prose h2 {
    @apply text-21;
  }

  .prose h3 {
    @apply text-18;
  }

  .prose h4 {
    @apply text-16;
  }

  .prose--on-dark h1,
  .prose--on-dark h2,
  .prose--on-dark h3,
  .prose--on-dark h4,
  .prose--on-dark h5,
  .prose--on-dark h6 {
    @apply text-on-dark-primary;
  }

  .prose--on-light h1,
  .prose--on-light h2,
  .prose--on-light h3,
  .prose--on-light h4,
  .prose--on-light h5,
  .prose--on-light h6 {
    @apply text-on-light-primary;
  }

  @media screen and (min-width: 640px) {
    .prose {
      @apply text-14;
    }
  }
</style>


