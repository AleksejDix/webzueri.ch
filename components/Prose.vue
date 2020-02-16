<template>
  <div class="prose">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["color"]
};
</script>

<style lang="postcss">
.prose {
  @apply text-sm leading-normal text-current-color text-gray-700;
}

.prose > ul {
  list-style: circle;
  margin-left: 2rem;
}

.prose > ul li + li {
  margin-top: 0.5rem;
}

.prose > * + * {
  margin-top: 1.5rem;
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
  @apply border-b border-blue-500 text-blue-500 relative no-underline;
}

.prose a:hover {
  @apply border-blue-300 text-blue-700;
}

.prose a:visited {
  @apply border-orange-700 text-orange-700;
}

.prose h1 {
  @apply text-3xl font-bold;
}

.prose h2 {
  @apply text-2xl font-bold;
}

.prose h3 {
  @apply text-lg font-medium;
}

.prose h4 {
  @apply text-base font-medium;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply text-black;
}

@media screen and (min-width: 640px) {
  .prose {
    @apply text-lg;
  }
}
</style>
