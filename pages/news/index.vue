<template>
  <section class="pattern bg-primary-light min-h-screen">
    <header class="container mx-auto px-4 py-12">
      <h1
        class="text-shadow mb-4 leading-tight text-3xl md:text-5xl text-base text-on-dark-primary font-display font-bold tracking-wide text-center"
      >News from the web zurich community</h1>
    </header>
    <div class="container rounded-lg shadow-lg p-2 mx-auto bg-primary-dark">
      <ul class="list-reset flex flex-wrap p-2 -my-8 -mx-2">
        <li
          :class="{
            'w-full' : index === 0,
            'w-fulll lg:w-1/2' : index === 1 || index === 2,
            'w-full lg:w-1/3' : index > 2
          }"
          class="px-2 py-8"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <article class="owl-lg h-full flex flex-col">
            <aside>
              <nuxt-link
                to="/"
                class="text-on-dark-primary hover:text-yellow-light group no-underline inline-block"
              >
                <user-card
                  size="xl"
                  :name="item.authorDisplayName"
                  :photo="item.authorPhotoURL"
                  :meta="item.submittedAt | humanDate"
                />
              </nuxt-link>
            </aside>
            <a
              :href="item.url"
              target="_blank"
              rel="noopener"
              class="group transition flex-1 relative block bg-primary hover:bg-primary-light rounded-lg p-4 text-white no-underline whitespace-normal"
            >
              <svg viewBox="0 0 24 24" class="w-6 h-6 absolute pin-l ml-5" style="bottom: 100%">
                <path
                  class="transition fill-primary group-hover:fill-primary-light"
                  d="M 12,12 L24 24 0 24 Z"
                ></path>
              </svg>
              <div
                :class="{
                'flex flex-col lg:flex-row owl lg:owl-none' : index === 0,
                'flex flex-col flex-1 owl' : index === 1 || index === 2,
                'flex-col flex-1 owl ' : index > 2,
                }"
              >
                <div
                  :class="{
                'w-full lg:w-3/5' : index === 0,
                'w-full' : index === 1 || index === 2,
                ' ' : index > 2,
                }"
                >
                  <Ratio class="rounded-lg shadow-lg w-full" width="16" height="9">
                    <img class="absolute pin-t pin-x w-full" :src="item.coverPhotoURL" alt="">
                  </Ratio>
                </div>
                <div
                  class="owl"
                  :class="{
                'flex-1 lg:px-8' : index === 0,
                '' : index === 1 || index === 2,
                'flex-col flex-1 owl' : index > 2,
                }"
                >
                  <h2
                    class="text-on-dark-primary leading-tight"
                    :class="[index === 0 ? 'text-18 md:text-24'  : 'text-18']"
                  >{{item.title}}</h2>
                  <div
                    class="leading-normal text-on-dark-secondary"
                    :class="[index === 0 ? 'text-14'  : 'text-12']"
                  >{{ item.excerpt }}</div>
                </div>
              </div>
            </a>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>


<script>
import Prose from '@/components/Prose'
export default {
  components: {Prose},
  computed: {
    list() {
      return this.$store.getters[`news/list`]
    }
  },
  fetch ({ store, params }) {
    return store.dispatch(`news/list`)
  },
  head() {
    return {
      title: 'News'
    }
  },
}
</script>









