<template>
  <nav class="flex justify-center py-4" role="navigation" aria-label="Pagination Navigation">

    <nuxt-link :to="`/events/${index}`" v-for="index in maxPage" :key="index" :aria-label="[($route.path === `/events/${index}`) ? `Current events Page, Page ${index}` : `Goto events Page ${index}`]" :aria-current="$route.path === `/events/${index}`" :class="[($route.path === `/events/${index}`) ? 'bg-green-light' : ' bg-green']" class="flex items-center justify-center pagination-link shadow hover:shadow-lg antialiased inline-block rounded-full px-3 h-12 min-w-12 no-underline text-md font-bold text-black m-1">
      {{index}}
    </nuxt-link>

    <!-- <div class="flex">

    //   <nuxt-link class="" v-if="page > 1" :to="`/events/${page - 1}`">prev</nuxt-link>
    //   <nuxt-link class="" v-if="hasMore" :to="`/events/${page + 1}`">more</nuxt-link>

    // </div> -->
  </nav>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    hasMore() {
      return this.page < this.maxPage
    }
  },
  scrollToTop: false
}
</script>

<style scoped>
  .pagination-link:focus,
  .pagination-link:hover {
    transform: scale(1.05);
  }
</style>
