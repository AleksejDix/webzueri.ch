<template>

  <loader v-if="$apollo.loading" />

  <div v-else id="content ">

    <section class="bg-indigo-darkest">
      <div class="sm:max-w-lg lg:max-w-2xl mx-auto pt-12">

        <div class="lg:flex">
          <div class="lg:w-2/5 p-4">
            <h1 class="mb-4 leading-tight text-3xl md:text-5xl text-base text-white font-display font-bold tracking-wide uppercase">People making <br class="md:hidden">the web in Zürich</h1>
            <p class=" leading-normal  text-xl md:text-2xl text-grey-lighter">Learn, share and collaborate with your local
              <strong>web professionals</strong> and enthusiasts!</p>
          </div>
          <div class="lg:w-3/5 p-4 sm:flex sm:flex-wrap -m-2">

            <a :href="item.url" target="_blank" class="block sm:flex sm:flex-column sm:w-1/2 p-2 no-underline" v-for="item in menu.social.links" :key="item.url">
              <div class="w-full border border-white rounded-lg py-4 px-6 flex items-center">
                <div class="icon pr-4 md:pr-6">
                  <div :style="{borderColor: item.color}" class="border border-white rounded-full w-12 h-12 flex items-center justify-center">
                    <svg :style="{fill: item.color}" class="fill-indigo-darkest h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="m10 7h-8v6h8v5l8-8-8-8z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 text-indigo-darker leading-normal">
                  <h3 class="text-2xl text-white">{{item.text}}</h3>

                  <div class="md:w-40 text-lg text-grey" v-html="item.desc"></div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div class="px-4 py-8 relative z-10">
          <div class="max-w-lg mx-auto">
            <div v-for="talk in event.talks" v-if="talk" :key="talk.id">
              <talk :talk="talk" :date="event.date"></talk>
            </div>
            <div class="text-center pt-8">
              <nuxt-link to="/events/1" class="bg-yellow hover:bg-yellow-dark inline-block rounded py-4 px-6 uppercase no-underline text-md font-bold">past events</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-8">
      <h2 class="p4 text-center text-white text-4xl font-light mb-8">Our recurring sponsors</h2>
      <div class="container mx-auto">
        <div class="flex flex-wrap justify-center text-white rounded-lg overflow-hidden bg-indigo-darker p-4">
          <a v-for="(sponsor, index) in sponsors" :class="[(index === 1) ? 'border-l' : 'border-r']" class="flex-1 flex flex-col " :href="sponsor.website" target="_blank" rel="noopener" :key="sponsor.id">
            <div class="w-full h-full flex items-center justify-center  py-4 px-8">
              <img class="w-auto h-20" v-if="sponsor.logo" :src="sponsor.logo.url" :alt="sponsor.name">
            </div>
          </a>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Talk from "@/components/Talk"
import QueryHome from '~/apollo/queries/home'
import {mapState} from "vuex"

export default {
  components: { Talk },
  data () {
    return {
      events: [],
      sponsors: []
    }
  },
  head() {
    return {
      title: 'Next Event'
    }
  },
  apollo: {
    events: {
      prefetch: true,
      query: QueryHome,
      result({data}) {
        this.events = data.events
        this.sponsors = data.sponsors
      }
    }
  },
  filters: {
    date(value) {
      if (!value) return ''
      const date = new Date(value);
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options)
    }
  },
  computed: {
    ...mapState(['menu']),
    event () {
      return this.events[0]
    }
  }
}

</script>
