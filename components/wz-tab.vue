<template>
  <li
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter">
    <slot></slot>
  </li>
</template>

<script>
export default {
  data() {
    return {
      hover: false
    }
  },
  methods: {
    handleMouseEnter(e) {
      this.$emit('hover', {
        element: e.target,
        show: true
      })
    },
    handleMouseLeave(e) {
      this.$emit('hover', {
        element: e.target,
        show: false
      })
    }
  }
}
</script>

