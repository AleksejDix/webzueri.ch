<template>
  <div class="toggle relative inline-block rounded-full cursor-pointer w-12 h-6 focus:outline-none" role="checkbox" tabindex="0" @click="toggle" @keydown.space.prevent="toggle" :aria-checked="value">
    <div :class="{'bg-green-dark': value}" class="transition inline-block rounded-full w-full h-full shadow-inner bg-orange-dark"></div>
    <div :style="[value ? {'transform': `translateX(0)`} : {'transform': `translateX(1.5rem)`}]" class="transition absolute pin-t pin-l rounded-full w-6 h-6 bg-white border border-grey-lightest shadow transform">
    </div>
  </div>
</template>


<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle() {
      this.$emit("input", !this.value)
    }
  }
}
</script>
