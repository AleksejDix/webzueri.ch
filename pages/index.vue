<template>
  <div
    id="content"
    class="bg-primary-light pattern"
  >

    <section class="bg-primary-dark py-12">
      <div class="container mx-auto px-2">
        <div class="lg:flex items-center">
          <div class="lg:w-2/5 px-2">
            <h1 class="mb-4 leading-tight text-3xl md:text-4xl text-base text-on-dark-primary text-shadow font-display font-bold tracking-wide uppercase">People making
              <br>the web in Zürich
            </h1>
            <p class="leading-normal text-xl xl:text-2xl text-grey-lighter">
              Learn, share and collaborate
              <br/>with your local
              <strong>web professionals</strong>
              <br/>and enthusiasts!
              <div class="py-4">
                <Button href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1">
                  Submit your talk
                </Button>
              </div>
            </p>
          </div>
          <div class="lg:w-3/5">
            <div
              class="md:flex md:flex-wrap -m-2 p-2"
              v-if="menu && menu.social && menu.social.links"
            >
              <a
                :href="item.url"
                target="_blank"
                rel="noopener"
                class=" block md:flex md:flex-column w-full md:w-1/2 p-2 no-underline"
                v-for="item in menu.social.links"
                :key="item.url"
              >
                <div class="w-full shadow-blue rounded-lg py-4 px-6 flex items-center bg-primary-dark">
                  <div class="icon pr-4 md:pr-6">
                    <div class=" transition w-16 h-16 rounded-full flex items-center justify-center">
                      <svg
                        class="w-10 h-10 fill-primary-dark"
                        :style="{fill: item.color}"
                      >
                        <use v-bind="{'xlink:href':'#'+item.icon}"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 leading-normal">
                    <h3 class="text-2xl text-white">{{item.text}}</h3>
                    <div
                      class="md:w-40 text-lg text-grey"
                      v-html="item.desc"
                    ></div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <section class="container mx-auto p-4 rounded">

        <div
          class="bg-primary-dark shadow-blue rounded-lg"
          v-if="event"
        >
          <header class="md:flex p-4">

            <div class="md:flex">
              <div class="text-white text-16 font-sans p-4">
                <Overline>when:</Overline>
                <span>{{ toDate(event.date) }}, 18:00</span>
              </div>

              <div class="text-white text-16 font-sans p-4">
                <Overline>where:</Overline>
                <a
                  target="_blank"
                  rel="noopener"
                  v-if="event.venue"
                  class="no-underline text-pink-light"
                  :href="event.venue.googleMapsUrl"
                >{{ event.venue.name }} • {{event.venue.street}} • {{event.venue.zip}}, {{event.venue.city}}</a>
              </div>
            </div>

            <div
              class="flex-shrink-0 p-4 md:ml-auto"
              v-if="event.meetupLink"
            >
              <Button
                rel="noopener"
                target="_blank"
                :href="event.meetupLink"
              >Secure a seat</Button>
            </div>

          </header>

          <div class="p-2 bg-primary-dark shadow-blue rounded-lg">
            <div v-if="!$apollo.loading">
              <div
                class="xl:flex"
                v-if="talks"
              >
                <div
                  class="xl:flex-1 xl:w-1/3 p-4"
                  v-for="talk in event.talks"
                  :key="talk.id"
                >
                  <talk
                    class="h-full"
                    :talk="talk"
                    :date="event.date"
                  ></talk>
                </div>
                <article
                  class="w-full flex-1 xl:w-1/3 p-4"
                  v-if="event.talks.length < 3"
                >
                  <div class="p-4 h-full  shadow-violet owl items-center justify-center rounded-lg bg-primary">
                    <h3 class="text-on-dark-primary text-2xl md:text-3xl leading-tight font-medium">{{3 - event.talks.length }} {{ event.talks.length > 1 ? 'Spots' : 'Spot'}} left</h3>
                    <p class="text-on-dark-primary leading-normal">Sharing is caring! Why not talk about your latest project, the great tool you found or the problem you just solved recently?</p>
                    <ul class="list-reset list-bullets text-on-dark-secondary">
                      <li>Talks are 15 minutes without Q&A</li>
                      <li>We have HDMI & Thunderbolt available and the resolution is 1080p (1920x1080)</li>
                    </ul>
                    <Button href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1">Submit your talk</Button>
                    <!-- <Button :to="{
                      name: 'dashboard-index-status-index-create',
                        query: {
                          redirect: 'dashboard-index-status-index-create'
                        },
                        params: {
                          status: 'talk'
                        }
                      }">Submit your talk</Button> -->
                  </div>
                </article>
              </div>
              <section>
                <header class="md:flex justify-between items-center px-4">
                  <h3 class="text-white text-12 font-display font-bold tracking-wide uppercase">sponsored by:</h3>
                  <Button href="https://forms.gle/kfbyug6aJDngiSfg7">
                    Offer a sponsorship
                  </Button>
                </header>

                <div class="flex flex-wrap -ml-8 -mt-8 p-4">
                  <a
                    target="_blank"
                    rel="noopener"
                    v-for="sponsor in event.sponsors"
                    :key="sponsor.id"
                    class="pt-8 pl-8 "
                    :href="sponsor.website"
                  >
                    <img
                      v-if="sponsor.name"
                      loading="lazy"
                      style="object-fit: scale-down;"
                      class="max-w-xs transition w-auto opacity-64 hover:opacity-100 h-16"
                      :src="sponsor.logo.url"
                      :alt="sponsor.name"
                    >
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div class="text-center py-16">
          <Button
            size="big"
            to="/events/1"
          >Past Events</Button>
        </div>
      </section>
    </div>

    <div class="container mx-auto p-4">
      <playlist :talks="talks" />
    </div>

    <section-feedbacks :feedbacks="feedbacks" />


<div class="p-4 bg-primary-dark shadow-blue">
  <section class=" rounded-lg max-w-4xl mx-auto p-4">

    <header class="text-center py-6 px-4">
      <h2
        class="leading-normal max-w-md mx-auto text-on-dark-primary font-display text-16 md:text-3xl"
      >Thank you!</h2>
    </header>

    <ul class="list-reset flex flex-wrap justify-center">
      <li
      :class="sponsor.events > 1 ? 'w-96' : 'w-48'"
      class="flex justify-center items-center" v-for="sponsor in sponsors" :key="sponsor.id">
        <a v-if="sponsor.website" target="_blank" rel="noopener" class="p-4 md:p-8" :href="sponsor.website">
          <img class="min-w-12 object-contain w-full h-full" v-if="sponsor.name" :src="sponsor.logo.url" :alt="sponsor.name">
        </a>
      </li>
    </ul>

    <div class="p-4 text-center">
      <Button target="_blank" rel="noopener" href="https://forms.gle/kfbyug6aJDngiSfg7">
        Offer a sponsorship
      </Button>
    </div>
  </section>
</div>


  </div>
</template>

<script>
import { toDate } from "@/utils/formater";
import gql from "graphql-tag";
import Talk from "@/components/Talk";
import SectionFeedbacks from "@/components/sections/feedbacks/";
import QueryHome from "~/services/apollo/queries/home";
import Playlist from "@/components/playlist";
import { mapState } from "vuex";

export default {
  components: {
    Talk,
    SectionFeedbacks,
    Playlist
  },
  data () {
    return {
      active: false,
      events: [],
      feedbacks: [],
      talks: [],
      sponsors: []
    };
  },
  head () {
    return (
      this.event && {
        title: "next: " + this.event.title,
        __dangerouslyDisableSanitizers: ["script"],
        script: [
          {
            innerHTML: JSON.stringify({
              "@context": "http://www.schema.org",
              "@type": "Event",
              image: ['https://secure.meetupstatic.com/photos/event/a/d/1/5/600_487064309.jpeg'],
              performer: {
                '@type': 'Person',
                name: 'Aleksej Dix'
              },
              name: this.event.title,
              url: "https://webzueri.ch",
              description: `We're excited to announce the next web zurich event! Where we will have 3 15 minutes Talks about web`,
              startDate: this.event.date + "18:30",
              endDate: this.event.date + "22:00",
              location: this.event.venue && {
                "@type": "Place",
                name: this.event.venue && this.event.venue.name,
                sameAs: "https://zurich.impacthub.ch/de/",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: this.event.venue.street,
                  addressLocality: this.event.venue.street,
                  addressRegion: this.event.venue.region,
                  postalCode: this.event.venue.zip,
                  addressCountry: this.event.venue.country
                }
              },

              offers: {
                "@type": "Offer",
                validFrom: '2019-12-12T12:00',
                availability: 'https://schema.org/InStock',
                url: this.eventmeetupLink || '',
                description:
                  this.event.talks.length + " awesome talks about web topics",
                url: this.event.meetupLink,
                price: 0,
                priceCurrency: "CHF"
              }
            }),
            type: "application/ld+json"
          }
        ]
      }
    );
  },
  methods: {
    toDate
  },
  apollo: {
    events: {
      prefetch: true,
      query: QueryHome,
      result (response) {
        const { data } = response;
        const { events, talks, feedbacks, sponsorsConnection } = data;
        this.events = events;
        this.talks = talks;
        this.feedbacks = feedbacks;
        this.sponsors = sponsorsConnection.edges
          .map(({node: {events: eventList, ...rest}}) => ({
            ...rest,
            events: eventList.length
          }))
          .sort((a,b)=>(a.events > b.events) ? -1 : 1);
      }
    }
  },
  computed: {
    ...mapState({
      menu: state => state.menu.menu
    }),
    event () {
      const [first] = this.events;
      return first;
    }
  }
};
</script>
