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
    @apply bg-primary tracking-wide no-underline leading-tight uppercase flex items-center justify-center text-center py-4 px-6  font-semibold rounded text-sm
  }
</style>

