<template>
<div class="pattern bg-primary-light">
  <div class="container mx-auto">

      <div class="lg:w-2/5 p-2 pb-8">
        <h1 class="mb-4 leading-tight text-3xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase">Conference Schedule</h1>
      </div>

      <wz-tabs>

      </wz-tabs>

      <nuxt-child />
  </div>
</div>
</template>

<script>
import format from 'date-fns/format'

export default {
  // fetch({ redirect }) {
  //   redirect("/schedule/2019-09-09")
  // },
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
