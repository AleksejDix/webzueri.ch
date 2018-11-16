<template>
  <section class="fixed pin z-20">
    <div class="bg-blue-dark fixed pin opacity-64" @click="$emit('close')"></div>
    <div class="h-full p-4 flex md:items-center justify-center">
      <div
        :class="[ $slots['aside'] ? 'container' : 'max-w-md' ]"
        class="w-full flex relative z-30 bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div class="flex-1 flex flex-col">
          <header class="pl-8 pt-4 pb-2 pr-4 flex items-center justify-between">
            <h1 class="text-16 flex-1 font-medium">
              <slot name="title"></slot>
            </h1>
            <icon-close @click="$emit('close')"/>
          </header>
          <div class="flex flex-col flex-1 px-8">
            <slot></slot>
          </div>
        </div>
        <aside v-if="$slots['aside']" class="hidden md:block w-full md:w-2/5 bg-grey-lighter p-8">
          <slot name="aside"></slot>
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
import IconClose from '@/components/icon-button'
export default {
  components: {IconClose},
  created() {
    if (process.browser) {
      document.body.style.setProperty('overflow', 'hidden')
    }
  },
  destroyed() {
    if (process.browser) {
      document.body.style.removeProperty('overflow', 'hidden')
    }
  }
}
</script>
