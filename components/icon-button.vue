<template>
  <button
    :class="[small ? 'w-8 h-8 p-1' : 'w-12 h-12 p-3 ']"
    class="c-button relative inline-block focus:outline-none border-none rounded-full leading-none"
    @click="handleCLick"
  >
    <div class="c-button__ripple trans absolute w-full h-full pin rounded-full bg-current-color"></div>
    <div class="flex items-center justify-center absolute pin">
      <svg class="w-8 h-8" transform="scale(0.8)">
        <use v-bind="{'xlink:href':'#'+icon}"></use>
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
    },
    icon: {
      type: String,
      default: 'close'
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
    @apply opacity-0;
  }

  .c-button:hover .c-button__ripple {
    @apply opacity-25;
  }

  .c-button:active .c-button__ripple {
    @apply opacity-50;
  }

  .c-button:focus .c-button__ripple {
    @apply opacity-75;
  }
</style>
