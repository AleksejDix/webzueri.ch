<template>
  <transition name="fade">
    <div v-if="active" class="overflow-hidde">
      <div class="push block">
        <div class="bg-primary-light w-24 rounded-full h-3 shadow-inner">
          <div class="push-inside">
            <div class="bg-secondary w-4 rounded-full h-3 shadow-inner"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
  .push {
    animation: push 5s infinite ease-in-out;
  }
  @keyframes push {
    50% {
      transform: translateX(calc(100% - 6rem));
    }
  }
  .push-inside {
    animation: push-inside 5s infinite ease-in-out;
  }
  @keyframes push-inside {
    50% {
      transform: translateX(calc(100% - 1rem));
    }
  }
</style>
