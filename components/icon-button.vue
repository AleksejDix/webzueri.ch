<template>
  <button
    :class="[small ? 'w-8 h-8 p-1' : 'w-12 h-12 p-3 ']"
    class="c-button relative inline-block focus:outline-none border-none rounded-full leading-none" @click="handleCLick">
    <div class="c-button__ripple trans absolute w-full h-full pin rounded-full bg-white"></div>

    <div class="flex items-center justify-center text-white absolute pin">
      <svg xmlns="http://www.w3.org/2000/svg" class="text-white w-6 h-6" viewBox="0 0 24 24">
        <path opacity=".87" fill="none" d="M0 0h24v24H0V0z"/>
        <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"/>
      </svg>
    </div>

    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean
    }
  },
  methods: {
    handleCLick(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style>


.c-button .c-button__ripple {
  @apply opacity-0
}

.c-button:hover .c-button__ripple {
  @apply opacity-8
}

.c-button:active .c-button__ripple {
  @apply opacity-24
}

.c-button:focus .c-button__ripple {
  @apply opacity-32
}
</style>

