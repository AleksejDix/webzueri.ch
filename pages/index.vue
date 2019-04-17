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
              <br>with your local
              <strong>web professionals</strong>
              <br>and enthusiasts!
              <div class="py-4">
                <Button href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1">Submit your talk</Button>
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


        <div class="bg-primary-dark shadow-blue-darker rounded-lg"  v-if="event">
          <header class="md:flex p-4">




            <div class="md:flex">
              <div class="text-white text-16 font-sans p-4">
                <Overline>when:</Overline>
                <span  >{{ toDate(event.date) }}, 18:30</span>
              </div>

              <div class="text-white text-16 font-sans p-4">
                <Overline>where:</Overline>
                <a target="_blank" rel="noopener" v-if="event.venue" class="no-underline text-pink-light" :href="event.venue.googleMapsUrl">{{ event.venue.name }} • {{event.venue.street}}  • {{event.venue.zip}}, {{event.venue.city}}</a>
              </div>
            </div>

            <div
              class="flex-no-shrink p-4 md:ml-auto"
              v-if="event.meetupLink"
            >
              <Button
                :href="event.meetupLink"
                rel="noopener"
                target="_blank"
              >Secure a seat</Button>
            </div>


          </header>



          <div class="p-2 bg-primary-dark shadow-blue-darker rounded-lg">
            <Spinner
              v-if="$apollo.loading"
              :active="$apollo.loading"
            />
            <div v-else>
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
                <header>
                  <h3 class="text-white p-4 text-12 font-display font-bold tracking-wide uppercase">sponsored by:</h3>
                </header>

                <div class="flex flex-wrap -ml-8 -mt-8 p-4">
                  <a
                    v-for="sponsor in event.sponsors"
                    :key="sponsor.id"
                    class="pt-8 pl-8 "
                    :href="sponsor.website"
                  >
                    <img
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
  </div>
</template>

<script>
import { toDate } from "@/utils/formater";
import gql from "graphql-tag";
import Talk from "@/components/Talk";
import Spinner from "@/components/feedback/Spinner";
import SectionFeedbacks from "@/components/sections/feedbacks/";
import QueryHome from "~/services/apollo/queries/home";
import Playlist from "@/components/playlist";
import { mapState } from "vuex";

export default {
  components: {
    Talk,
    Spinner,
    SectionFeedbacks,
    Playlist
  },
  data() {
    return {
      events: [],
      feedbacks: [],
      active: false,
      talks: []
    };
  },
  head() {
    return (
      this.event && {
        title: "next: " + this.event.title,
        __dangerouslyDisableSanitizers: ["script"],
        script: [
          {
            innerHTML: JSON.stringify({
              "@context": "http://www.schema.org",
              "@type": "Event",
              name: this.event.title,
              url: "https://webzueri.ch",
              description: `We're excited to announce the next web zurich event! Where we will have 3 15 minutes Talks about web`,
              startDate: this.event.date + "18:30",
              endDate: this.event.date + "22:00",
              location: this.event.venue && {
                "@type": "Place",
                name: this.event.venue.name,
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
              performer: this.event.talks.map(talk => {
                const speaker = talk.speakers[0];
                const {
                  id,
                  name = "",
                  speakerPicture: { url: image }
                } = speaker;

                return {
                  "@type": "Person",
                  image: "/examples/jvanzweden_s.jpg",
                  name,
                  image,
                  sameAs: `https://webzueri.ch/speaker/${id}`
                };
              }),
              offers: {
                "@type": "Offer",
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
      result(response) {
        const { data } = response;
        const { events, talks, feedbacks } = data;
        this.events = events;
        this.talks = talks;
        this.feedbacks = feedbacks;
      }
    }
  },
  computed: {
    ...mapState({
      menu: state => state.menu.menu
    }),
    event() {
      const [first] = this.events;
      return first;
    }
  }
};
</script>
