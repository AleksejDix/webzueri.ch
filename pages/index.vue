<template>
  <div class="owl">
    <section class="container bg-white mx-auto p-4 rounded-xl">
      <div class="rounded-xl p-4 ">
        <div
          class="relative h-ful overflow-hidden bg-black rounded-xl"
          :style="{ height: '400px' }"
        >
          <img
            class="rounded-xl absolute inset-0 w-full h-full object-cover opacity-75 "
            src="~/assets/img/people.jpeg"
            alt="People networking at web zurich"
          />
          <div class="absolute inset-0 flex items-center">
            <div class="p-4 md:p-8 rounded-xl">
              <h1
                class="mb-4 leading-tight text-3xl md:text-5xl text-base text-white font-display font-bold tracking-wide uppercase"
              >
                People making <br />the web in Zürich
              </h1>
              <p class="leading-normal text-xl xl:text-2xl text-gray-300">
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
          </div>
        </div>
        <div
          v-if="menu && menu.social && menu.social.links"
          class="grid gap-6 lg:grid-cols-3 pt-8"
        >
          <a
            v-for="item in menu.social.links"
            :key="item.url"
            :href="item.url"
            target="_blank"
            rel="noopener"
            class=" no-underline "
          >
            <div
              class="w-full bg-main  rounded-xl py-4 px-6 flex items-center "
            >
              <div class="icon pr-4 md:pr-6">
                <div
                  class="transition w-16 h-16 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 fill-primary-dark"
                    :style="{ fill: item.color }"
                  >
                    <use v-bind="{ 'xlink:href': '#' + item.icon }"></use>
                  </svg>
                </div>
              </div>
              <div class="flex-1 leading-normal">
                <h3 class="text-2xl text-black">{{ item.text }}</h3>
                <div class="text-lg text-grey" v-html="item.desc"></div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="container bg-white mx-auto rounded-xl p-8">
      <div v-if="event">
        <header >
          <h1 class="py-8 leading-tight text-3xl md:text-5xl text-base  font-display font-bold tracking-wide text-center">Next Event</h1>
          <div class="grid gap-6 lg:grid-cols-4 pb-8">
          <div class="grid gap-6 lg:grid-cols-3 lg:col-span-3">
            <div class="text-black text-16 font-sans">
              <div
                class="font-bold font-display text-2xl tracking-tighter uppercase"
              >
                when:
              </div>
              <span>{{ toDate(event.date) }}, 18:00</span>
            </div>

            <div class="text-black text-16 font-sans col-span-2">
              <div
                class="font-bold font-display text-2xl tracking-tighter uppercase"
              >
                where:
              </div>
              <a
                v-if="event.venue"
                target="_blank"
                rel="noopener"
                class="no-underline text-pink-light"
                :href="event.venue.googleMapsUrl"
                >{{ event.venue.name }} • {{ event.venue.street }} •
                {{ event.venue.zip }}, {{ event.venue.city }}</a
              >
            </div>
          </div>

          <div v-if="event.meetupLink" class="flex-shrink-0 md:ml-auto">
            <Button rel="noopener" target="_blank" :href="event.meetupLink"
              >Secure a seat</Button
            >
          </div>

          </div>
        </header>

        <div v-if="!$apollo.loading">
          <div v-if="talks" class="grid gap-6 lg:grid-cols-5">
            <div class="lg:col-span-4">
              <ul class="grid gap-6 lg:grid-cols-3">
                <li v-for="talk in event.talks" :key="talk.id">
                  <talk class="h-full" :talk="talk" :date="event.date"></talk>
                </li>
                <li class="lg:col-span-3">
                  <article>

                <div
                  class="relative bg-purple-100 p-4 rounded-lg md:p-8 owl overflow-hidden"
                >
                  <div
                    class="absolute w-2 h-full left-0 top-0 bottom-0 bg-purple-700 rounded-l"
                  ></div>
                      <h3
                        class="max-w-lg text-purple-700 font-bold text-2xl leading-tight font-medium"
                      >
                        Talk about your latest project, the great tool you found
                        or the problem you just solved recently?
                      </h3>

                      <ul class="list-reset list-bullets">
                        <li>Talks are 15 minutes without Q&A</li>
                        <li>
                          We have HDMI & Thunderbolt available and the
                          resolution is 1080p (1920x1080)
                        </li>
                      </ul>
                      <div>
                        <Button
                          href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1"
                          >Submit your talk</Button
                        >
                      </div>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
            <aside class="bg-gray-700 rounded-xl p-6">
              <header class="md:flex justify-between items-center px-4 ">
                <h3
                  class="text-white text-12 font-display font-bold tracking-wide uppercase"
                >
                  sponsors:
                </h3>
              </header>

              <div class="grid gap-6 py-6">
                <a
                  v-for="sponsor in event.sponsors"
                  :key="sponsor.id"
                  target="_blank"
                  rel="noopener"
                  class="block"
                  :href="sponsor.website"
                >
                  <img
                    v-if="sponsor.name"
                    loading="lazy"
                    style="object-fit: scale-down;"
                    class="w-full transition w-auto opacity-64 hover:opacity-100 h-16"
                    :src="sponsor.logo.url"
                    :alt="sponsor.name"
                  />
                </a>
              </div>
              <Button href="https://forms.gle/kfbyug6aJDngiSfg7">
                Offer a sponsorship
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto p-8 rounded-xl bg-white">
      <playlist :talks="talks" />
    </div>

    <section-feedbacks :feedbacks="feedbacks" />

    <section class="max-w-2xl bg-white rounded-xl p-6 mx-auto">
      <header class="text-center py-6 px-4">
        <h2
          class="font-bold max-w-md mx-auto text-black leading-tight font-display text-3xl md:text-3xl"
        >
          Thank you!
        </h2>
      </header>

      <ul class="grid gap-6 justify-center md:grid-cols-4">
        <li
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          :class="sponsor.events > 1 ? 'col-span-2' : ''"
        >
          <a
            v-if="sponsor.website"
            target="_blank"
            rel="noopener"
            class="h-full block p-6 bg-gray-700  rounded-xl"
            :href="sponsor.website"
          >
            <img
              v-if="sponsor.name"
              class="min-w-12 object-contain w-full h-full"
              :src="sponsor.logo.url"
              :alt="sponsor.name"
            />
          </a>
        </li>
      </ul>

      <div class="p-4 text-center">
        <Button
          target="_blank"
          rel="noopener"
          href="https://forms.gle/kfbyug6aJDngiSfg7"
        >
          Offer a sponsorship
        </Button>
      </div>
    </section>
  </div>
</template>

<script>
import { toDate } from "@/utils/formater";
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
  data() {
    return {
      active: false,
      events: [],
      feedbacks: [],
      talks: [],
      sponsors: []
    };
  },
  methods: {
    toDate
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
              image: [
                "https://secure.meetupstatic.com/photos/event/a/d/1/5/600_487064309.jpeg"
              ],
              performer: {
                "@type": "Person",
                name: "Aleksej Dix"
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
                validFrom: "2019-12-12T12:00",
                availability: "https://schema.org/InStock",
                url: this.eventmeetupLink || "",
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
  apollo: {
    events: {
      prefetch: true,
      query: QueryHome,
      result(response) {
        const { data } = response;
        const { events, talks, feedbacks, sponsorsConnection } = data;
        this.events = events;
        this.talks = talks;
        this.feedbacks = feedbacks;
        this.sponsors = sponsorsConnection.edges
          .map(({ node: { events: eventList, ...rest } }) => ({
            ...rest,
            events: eventList.length
          }))
          .sort((a, b) => (a.events > b.events ? -1 : 1));
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
