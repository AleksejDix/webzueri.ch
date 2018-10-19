<template>
  <transition name="fade">
  <div
    style="background-color: rgba(47,54,95,.82)"
    class="model-mask  fixed pin overflow-auto p-4"
    v-if="show" @close.self="show = false"
    >

    <section
      role="dialog"
      class="modal max-w-sm bg-white rounded-lg mx-auto shadow-lg overflow-hidden">
      <focus-lock :disabled="!show">

      <header class="modal-header px-12 py-6 bg-yellow border-b border-yellow-dark">

        <h1 class="text-xl text-base text-indigo-darker font-display font-bold tracking-wide uppercase text-center">
          <slot name="header"></slot>
        </h1>

      </header>

      <div class="px-12 py-8">

        <p class="text-gray-darker leading-normal text-grey-darker pb-8">Sharing is caring! Why not talk about your latest project, the great tool you found or the problem you just solved recently?</p>

        <ul class="list-reset list-bullets">
          <li>Talks are 15 minutes without Q&A</li>
          <li>We have HDMI & Thunderbolt available and the resolution is 1080p (1920x1080)</li>
        </ul>

      </div>

      <form class="w-full max-w-md px-12" @submit.prevent="">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-first-name">
              First Name
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-grey-darkest border border-grey-lighter rounded py-3 px-4 mb-3" id="grid-first-name" type="text" placeholder="Jane">
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
              Last Name
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-grey-darkest border border-grey-lighter rounded py-3 px-4" id="grid-last-name" type="text" placeholder="Doe">
          </div>
        </div>

        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-password">
              Abstract
            </label>
            <textarea
            rows="4"
            class="appearance-none block w-full bg-grey-lighter text-grey-darkest border border-grey-lighter rounded py-3 px-4 mb-3" id="grid-password" type="password" placeholder="I will talk about Networking unicorns"></textarea>
            <p class="text-grey-dark text-xs italic">Make it as long and as crazy as you'd like</p>
          </div>
        </div>

        <footer class="modal-actions flex justify-end -m-2 py-4">
        <div class="p-2">
          <wz-button @click="close">Cancel</wz-button>
        </div>
        <div class="p-2">
          <wz-button >Submit</wz-button>
        </div>
      </footer>

      </form>
      </focus-lock>

    </section>

  </div>
  </transition>
</template>

<script>
import FocusLock from 'vue-focus-lock';

export default {
  components: { FocusLock },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
  mounted() {
    this.escapeHandler = e => e.key === 'Escape' && this.show ? this.close() : ''
    process.browser && document.addEventListener('keydown', this.escapeHandler)
  },
  destroyed() {
    process.browser && document.removeEventListener('keydown', this.escapeHandler)
  }
}
</script>

<style>

</style>

