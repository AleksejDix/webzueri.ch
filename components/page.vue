<template>
  <div
    :class="[ isShifted ? 'fixed w-full': '']"
    :style="{'top': offset}"
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        offset: 0
      };
    },
    computed: {
      isShifted() {
        return this.$store.state.modal.open;
      }
    },
    watch: {
      isShifted: {
        immediate: false,
        handler(value) {
          if (process.server) return;
          const { top } = this.$el.getBoundingClientRect();
          this.offset = top;
          if (!value) window.scrollTo(0, 0);
          window.scrollTo(0, this.scroll * -1);
        }
      }
    }
  };
</script>
