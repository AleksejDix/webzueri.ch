<template>

  <div id="content">

    <section class="bg-primary-dark shadow-lg py-12">
      <div class="container mx-auto px-2">

        <div class="lg:flex">
          <div class="lg:w-2/5 px-2 pb-8">
            <h1 class="mb-4 leading-tight text-3xl md:text-4xl text-base text-on-dark-primary text-shadow font-display font-bold tracking-wide ">People making <br>the web in Zürich</h1>
            <p class="leading-normal  text-xl xl:text-2xl text-grey-lighter">
              Learn, share and collaborate <br> with your local
              <strong>web professionals</strong> <br> and enthusiasts!</p>
          </div>

          <div class="lg:w-3/5">
            <div class="md:flex md:flex-wrap -m-2">
              <a :href="item.url" target="_blank" class="block md:flex md:flex-column w-full md:w-1/2 p-2 no-underline" v-if="menu && menu.social && menu.social.links" v-for="item in menu.social.links" :key="item.url">
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

    <div class="pattern bg-primary-light">
      <section class="container mx-auto p-2 rounded">

        <header class="py-8 flex flex-col md:flex-row items-start md:justify-between md:items-center px-2 owl md:owl-none" v-if="event">
          <h2 class="leading-tight text-21  md:text-4xl  text-on-dark-primary text-shadow font-display font-bold tracking-wide ">Next Event: {{ event.date | date }}</h2>
          <div class="flex-no-shrink">
            <Button :href="event.meetupLink" rel="noopener" target="_blank">Secure a seat</Button>
          </div>
        </header>

        <div class="p-2 bg-primary-dark rounded-lg">

          <Spinner v-if="$apollo.loading" :active="$apollo.loading" />
          <div v-else>

            <div class="flex flex-wrap">
              <div class="w-full flex-1 xl:w-1/3 p-2" v-for="talk in event.talks" v-if="talk" :key="talk.id">
                <talk class="h-full" :talk="talk" :date="event.date"></talk>
              </div>

              <article class="w-full flex-1 xl:w-1/3 p-2" v-if="event.talks.length < 3">
                <div class="p-4 h-full  border-secondary border-2 border-dashed  owl items-center justify-center rounded-lg bg-primary">
                  <h3 class="text-on-dark-primary text-2xl md:text-3xl leading-tight font-semibold ">{{3 - event.talks.length }} Spot left</h3>

                  <p class="text-on-dark-primary leading-normal">Sharing is caring! Why not talk about your latest project, the great tool you found or the problem you just solved recently?</p>

                  <ul class="list-reset list-bullets text-on-dark-secondary">
                    <li>Talks are 15 minutes without Q&A</li>
                    <li>We have HDMI & Thunderbolt available and the resolution is 1080p (1920x1080)</li>
                  </ul>
                  <Button :to="{ name: 'user-index-talks', query: { redirect: 'user-index-talks' }}">Submit your talk</Button>
                </div>
              </article>

            </div>

            <section>
              <header>
                <h3 class="text-white p-4 text-12 font-display font-bold tracking-wide uppercase">sponsored by:</h3>
              </header>
              <ul class="flex flex-wrap list-reset">
                <li class="p2 flex-no-grow" v-for="sponsor in event.sponsors" :key="sponsor.id">
                  <a class="p-4 rounded-lg block mr-8" :href="sponsor.website">
                    <img class="w-auto h-20" :src="sponsor.logo.url" :alt="sponsor.name">
                  </a>
                </li>
              </ul>
            </section>
          </div>

        </div>

        <div class="text-center py-16">
          <Button to="/events/1">Past Events</Button>
        </div>

      </section>

    </div>

    <section-feedbacks />
  </div>

</template>

<script>
import gql from 'graphql-tag'
import Talk from "@/components/Talk"
import Spinner from "@/components/feedback/Spinner"
import SectionFeedbacks from "@/components/sections/feedbacks/"
import QueryHome from '~/services/apollo/queries/home'
import {mapState} from "vuex"

export default {
  components: { Talk, Spinner, SectionFeedbacks },
  data () {
    return {
      users: [],
      events: [],

      active: false
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
    ...mapState({
      menu: state => state.menu.menu
    }),
    event () {
      return this.events[0]
    }
  },
}

</script>
