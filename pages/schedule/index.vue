<template>
<div class="pattern bg-primary-light">
  <div class="container mx-auto">

      <div class="lg:w-2/5 p-2 pb-8">
        <h1 class="mb-4 leading-tight text-3xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase">Conference Schedule</h1>
      </div>


      <ul class="tabs">
        <li>
          <nuxt-link class="no-underline" :to="'/schedule/2019-09-09'">{{ '2019-09-09' | humanDate }}</nuxt-link>
          <nuxt-link class="no-underline" :to="'/schedule/2019-09-10'">{{ '2019-09-10' | humanDate }}</nuxt-link>
        </li>
      </ul>

    <nuxt-child :key="$route.params.day" />
  </div>
</div>
</template>

<script>
import format from 'date-fns/format'

export default {
  fetch({ redirect }) {
    redirect("/schedule/2019-09-09")
  },
  filters: {
    humanDate(value) {
      if (!value) return
      return format(new Date(value), 'MMMM D')
    }
  }
}
</script>

<style>

</style>
