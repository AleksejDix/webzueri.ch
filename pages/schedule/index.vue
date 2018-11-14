<template>
  <div class="pattern bg-primary-light">
    <div class="flex">
      <div class="flex-1 bg-black">
        <ul class="list-reset max-w-md">
          <li
            class=""
            v-for="color in ['red', 'orange', 'yellow', 'green', 'mint', 'blue', 'violet', 'fuchsia', 'pink' ]"
            :key="color"
          >
            <div class="flex space-between">
              <div class="flex-1 p-1" v-for="(shade, index) in shades" :key="shade">
                <div
                  class="rounded p-2 transition"
                  :class="[
                    `bg-${color}${shade ? `-${shade}` : ``}`,
                    `hover:bg-${color}-light`
                  ]"
                ></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="flex-1 bg-white">
        <ul class="list-reset max-w-md">
          <li
            class=""
            v-for="color in ['red', 'orange', 'yellow', 'green', 'mint', 'blue', 'violet', 'fuchsia', 'pink' ]"
            :key="color"
          >
            <div class="flex space-between">
              <div class="flex-1 p-1" v-for="(shade, index) in shades" :key="shade">
                <div
                  class="rounded p-2 transition"
                  :class="[
                    `bg-${color}${shade ? `-${shade}` : ``}`,
                    `hover:bg-${color}-light`
                  ]"
                ></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="container mx-auto">
      <div class="lg:w-2/5 p-2 pb-8">
        <h1
          class="mb-4 leading-tight text-3xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase"
        >Conference Schedule</h1>
      </div>
      <wz-tabs></wz-tabs>
      <div class="border border-red">
        <nuxt-child/>
      </div>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      shades: ['darkest', 'darker', 'dark', '', 'light', 'lighter', 'lightest']
    }
  },
  filters: {
    humanDate(value) {
      if (!value) return
      return format(new Date(value), 'MMMM D')
    }
  },
  methods: {
    handleHover(payload) {
      this.payload.element
    }
  }
}
</script>

<style>
</style>
