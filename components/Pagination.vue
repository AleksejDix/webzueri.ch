<template>
  <nav
    class="flex justify-center py-4 owl-x"
    role="navigation"
    aria-label="Pagination Navigation"
  >
    <Button
      v-for="index in maxPage"
      :key="index"
      :to="{
        name: 'events',
        query: {
          page: index
        }
      }"
      :aria-label="[
        $route.path === `/events/${index}`
          ? `Current events Page, Page ${index}`
          : `Goto events Page ${index}`
      ]"
      :aria-current="$route.path === `/events/${index}`"
    >
      {{ index }}
    </Button>

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
      return this.page < this.maxPage;
    }
  },
  scrollToTop: false
};
</script>
