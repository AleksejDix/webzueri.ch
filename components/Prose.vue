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
    @apply text-sm leading-normal text-current-color;
  }
  .prose--on-dark {
    @apply text-on-dark-secondary;
  }
  .prose--on-light {
    @apply text-on-light-secondary;
  }
  .prose > ul {
    list-style: circle;
    margin-left: 2rem;
  }

   .prose > ul li + li {
       margin-top: 0.5rem
   }

   .prose > * + * {
     margin-top: 1.5rem
   }

  .prose strong,
  .prose b {
    font-weight: 600;
  }

  .prose i,
  .prose italic {
    font-style: oblique;
  }

  .prose a {
    transition: background-color 120ms;
    @apply border-b border-blue text-blue relative no-underline;
  }

  .prose a:hover {
    @apply border-blue-light text-blue-dark;
  }

  .prose a:visited {
    @apply border-fuchsia-light text-fuchsia-dark;
  }

  .prose h1 {
    @apply text-2xl font-medium;
  }

  .prose h2 {
    @apply text-xl font-medium;
  }

  .prose h3 {
    @apply text-lg font-medium;
  }

  .prose h4 {
    @apply text-base font-medium;
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
      @apply text-lg;
    }
  }
</style>
