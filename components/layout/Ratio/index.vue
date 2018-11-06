<template>
  <div class="relative overflow-hidden">
    <div :style="styles"></div>
    <div class="absolute pin w-full h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['width', 'height'],
  computed: {
    ratio() {
      if (!this.width) {
        console.warn('please provide width prop to Ratio component')
        return
      }
      if (!this.height) {
        console.warn('please provide height prop to Ratio component')
        return
      }
      return +this.height / +this.width  * 100
    },
    styles() {
      return {
        paddingTop : `${this.ratio}%`,
      }
    }
  }
}
</script>
