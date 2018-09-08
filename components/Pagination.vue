<template>
  <nav class="flex py-4" role="navigation" aria-label="Pagination Navigation">


    <div class="text-white"></div>

    <router-link
      :to="`/events/${index}`"
      v-for="index in maxPage" :key="index"
      :aria-label="[($route.path === `/events/${index}`) ? `Current events Page, Page ${index}` : `Goto events Page ${index}`]"
      :aria-current="$route.path === `/events/${index}`"
      :class="[($route.path === `/events/${index}`) ? 'bg-green-lighter' : ' bg-green']"
      class="pagination-link antialiased inline-block rounded py-4 px-6 uppercase no-underline text-md font-bold min-w-32 text-black"
    >
      {{index}}
    </router-link>

    <!-- <span>{{ page }}/{{ maxPage }}</span>
    <div class="flex">

    <router-link class="no-underline leading-tight  uppercase flex items-center justify-center text-center  py-4 px-6  md:flex-none hover:bg-gray font-semibold rounded text-sm tracking-wide" v-if="page > 1" :to="`/events/${page - 1}`">prev</router-link>
    <router-link class="min-w-32 no-underline leading-tight antialiased uppercase flex items-center justify-center text-center  py-4 px-6 text-gray md:flex-none hover:bg-gray font-semibold rounded text-sm tracking-wide" v-if="hasMore" :to="`/events/${page + 1}`">more</router-link>

    </div> -->
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
  }
}
</script>

<style scoped>
  .pagination-link + .pagination-link {
    margin-left: 8px;
  }
  .pagination-link {
    transition: transform 160ms
  }

  .pagination-link:focus,
  .pagination-link:hover {
    transform: scale(1.05);
  }
</style>
