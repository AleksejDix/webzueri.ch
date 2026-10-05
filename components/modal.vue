<template>
  <ClientOnly>
    <Transition name="fade">
      <div
        v-if="modal.isOpen"
        class="table table-fixed absolute top-0 left-0 right-0 z-50 w-full min-h-full"
      >
        <slot name="backdrop">
          <div id="modalbackdrop"></div>
          <div
            class="block fixed inset-auto bg-[hsla(109,0%,10%,0.9)]"
            @click="closeModal"
          ></div>
        </slot>

        <div class="table-cell w-full text-center align-middle">
          <div class="static inline-block p-8 text-left">
            <slot
              name="modal"
              :close="closeModal"
              :open="modal.isOpen"
            >
              <button
                class="absolute top-0 right-0 m-8"
                @click="closeModal"
              >close</button>
            </slot>
            <div class="relative">
              <slot>
                <div id="modal"></div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useModal } from '~/composables/useModal';

const modal = useModal();

const closeModal = () => {
  modal.closeModal();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 