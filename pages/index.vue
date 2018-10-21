<template>
  <loader v-if="$apollo.loading" />

  <div v-else id="content">

    <section class="bg-indigo-darkest shadow-lg py-12">
      <div class="container mx-auto px-2">

        <div class="lg:flex">
          <div class="lg:w-2/5 p-2 pb-8">
            <h1 class="mb-4 leading-tight text-3xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase">People making <br>the web in Zürich</h1>
            <p class="leading-normal  text-xl xl:text-2xl text-grey-lighter">
              Learn, share and collaborate <br> with your local
              <strong>web professionals</strong> <br> and enthusiasts!</p>
          </div>

          <div class="lg:w-3/5">
            <div class="md:flex md:flex-wrap -m-2">
              <a :href="item.url" target="_blank" class="block md:flex md:flex-column w-full md:w-1/2 p-2 no-underline" v-for="item in menu.social.links" :key="item.url">
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
        </div>

      </div>
    </section>

    <div class="pattern bg-purple-dark">
      <section class="container mx-auto p-2 rounded">

        <header class="py-8 flex justify-around px-2">
          <h2 class="leading-tight text-3xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase">Next Event: {{ event.date | date }}</h2>
          <a :href="event.meetupLink" rel="noopener" target="_blank" class="
            transition
            text-md
            shadow
            min-w-32
            bg-yellow
            no-underline antialiased
            leading-none text-center
            flex items-center justify-center
            py-4 px-6 text-purple-darker
            hover:bg-white
            hover:shadow-lg
            font-semibold rounded tracking-small">Secure a seat</a>
        </header>

        <div class="p-2 bg-purple-darkest rounded-lg">

          <div class="xl:flex">
            <div class="flex-1 p-2" v-for="talk in event.talks" v-if="talk" :key="talk.id">
              <talk :talk="talk" :date="event.date"></talk>
            </div>
          </div>

          <div class="sponsor ">
            <h3 class="text-white p-4 text-base font-display font-bold tracking-wide uppercase">sponsored by:</h3>

            <ul class="flex flex-wrap list-reset">
              <li class="p2 flex-no-grow" v-for="sponsor in event.sponsors" :key="sponsor.id">
                <a class="p-4 rounded-lg block mr-8" :href="sponsor.website">
                  <img class="w-auto h-20" :src="sponsor.logo.url" :alt="sponsor.name">
                </a>
              </li>
            </ul>
          </div>

        </div>
        <div class="text-center py-16">
          <nuxt-link to="/events/1" class="transition
            text-md
            shadow hover:shadow-lg
            min-w-32
            bg-yellow
            no-underline antialiased
            leading-none text-center
            inline-flex items-center justify-center
            py-4 px-6 text-purple-darker
            hover:bg-white

            font-semibold rounded tracking-small">Past Events</nuxt-link>
        </div>

      </section>
    </div>
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
      events: []
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
      query: QueryHome
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
  },
  mounted() {
    console.log(process.env.graphcms_token)
  }
}

</script>
