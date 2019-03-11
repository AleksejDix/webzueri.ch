<template>
  <transition name="fade">
    <div
      v-if="open"
      class="table table-fixed absolute pin-t pin-l pin-r z-50 w-full min-h-full"
    >
      <slot name="backdrop">
        <portal-target name="modalbackdrop" />
        <div
          class="block backdrop fixed pin"
          @click="close"
        ></div>
      </slot>

      <div class="table-cell w-full text-center align-middle">
        <div class="static inline-block p-8 text-left ">
          <slot
            name="modal"
            :close="close"
            :open="open"
          >
            <Button
              class="absolute pin-t pin-r m-8"
              @click="close"
            >close</Button>

          </slot>
          <div class="relative ">
            <slot>
              <portal-target name="modal" />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
  export default {
    computed: {
      open() {
        return this.$store.state.modal.open;
      }
    },
    methods: {
      close() {
        this.$store.commit("modal/destroy");
      }
    }
  };
</script>

<style scoped>
  .backdrop {
    background-color: hsla(109, 0%, 10%, 0.9);
  }
</style>

