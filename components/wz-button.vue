<template>
  <button @click="handleClick" class="button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style>
  .button {
    @apply shadow bg-secondary tracking-wide no-underline leading-none uppercase inline-block items-center justify-center text-center py-4 px-6  font-semibold rounded text-sm
  }

  .button.nuxt-link-active {
    @apply bg-secondary-light text-on-light-primary
  }
</style>

