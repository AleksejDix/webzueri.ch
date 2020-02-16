<template>
  <button
    :class="[small ? 'w-8 h-8 p-1' : 'w-12 h-12 p-3 ']"
    class="c-button relative inline-block focus:outline-none border-none rounded-full leading-none"
    @click="handleCLick"
  >
    <div
      class="trans absolute w-full h-full inset-auto rounded-full bg-current-color"
    ></div>
    <div class="flex items-center justify-center absolute inset-auto"></div>
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
      default: "close"
    }
  },
  methods: {
    handleCLick(event) {
      this.$emit("click", event);
    }
  }
};
</script>
