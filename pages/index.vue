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
            alt="People networking at Web Zurich"
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

    <section class="container bg-white mx-auto rounded-xl p-6 xl:p-8">
      <div v-if="event">
        <header >
          <h1 class="pb-6 leading-tight text-3xl md:text-5xl text-base  font-display font-bold tracking-wide ">Next Event</h1>
          <div class="grid gap-6 lg:grid-cols-4 pb-8">
          <div class="grid gap-6 lg:grid-cols-3 lg:col-span-3">
            <div class="text-black text-16 font-sans">
              <div
                class="font-bold font-display text-2xl tracking-tighter uppercase"
              >
                when:
              </div>
              <span>{{ toDate(event.date) }}, 18:30</span>
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
          <div v-if="talks" class="grid gap-6 xl:grid-cols-5">
            <div class="xl:col-span-4">
              <ul class="grid gap-6 xl:grid-cols-3">
                <li v-for="talk in event.talks" :key="talk.id">
                  <talk class="h-full" :talk="talk" :date="event.date"></talk>
                </li>
                <li class="lg:col-span-3">
                  <article>

                <div
                  class="relative bg-purple-100 p-6 pl-8 rounded-lg md:p-8 md:pl-10 owl overflow-hidden"
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
                          We have <b>HDMI</b> & <b>USB-C</b> available and the
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

    <section v-if="workshops.length > 0" class="workshops container  rounded-xl p-4 ld:p-6 mx-auto">

      <h2 class="pt-2 px-4 md:px-6 text-black font-bold max-w-md  leading-tight font-display text-3xl md:text-3xl text-left">Upcoming Workshops

      </h2>
      <ul class="rounded-xl p-4 md:p-6 grid md:grid-cols-2 gap-6 lg:gap-12">
        <li v-for="workshop in workshops" :key="workshop.id">
          <portal to="shamelessplug">
            <div v-if="showBanner" class="fixed z-20 bottom-0 inset-x-0 pb-2 sm:pb-5 px-6 text-white">
              <div class="max-w-screen-xl mx-auto">
                <div class="p-2 rounded-xl bg-gray-900 shadow-lg">
                  <div class="md:flex md:items-center md:justify-between md:flex-wrap">
                      <p class="md:ml-3 text-sm md:text-base font-medium text-white">
                        <span class="text-white">
                          <strong class="block md:inline text-yellow-500  mr-1">Tickets on sale!</strong>
                          <span class="hidden xl:inline">New Workshop!</span> <span>Smart Responsive Interface Design Patterns by <a href="/talks/ck3zmq30eengd0b20qo9606kq"> Vitaly Friedman</a>.</span>
                        </span>
                      </p>

                    <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                      <div class="rounded-md shadow-sm flex justify-end owl-x">
                        <Button :to="{ name: 'workshops-id', params: { id: workshop.id } }">
                          Learn more
                        </Button>
                         <button type="button" class="-mr-1 flex p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800" @click="hideBanner">
                          <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                      </button>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </portal>
          <nuxt-link
          class="h-full flex flex-col justify-between block rounded-xl py-4 px-6 border-white border-4"
          :to="{ name: 'workshops-id', params: { id: workshop.id } }"
        >
          <div class="owl">
            <div class="text-black text-2xl md:text-5xl font-bold tracking-tighter leading-none">
              {{ workshop.dateAndTime | date('dd.MM.y') }}
            </div>
            <h2
              class="text-2xl block items-center text-black font-bold font-display mb-6 leading-none"
            >
              {{ workshop.name }}
            </h2>
          </div>
          <div class="flex justify-between">
            <user-card
              v-if="workshop.speakers[0].speakerPicture"
              :photo="workshop.speakers[0].speakerPicture.handle"
              :name="workshop.speakers[0].name"
            />
            <div>
              <Button>
                learn more
              </Button>
            </div>
          </div>
        </nuxt-link>
        </li>
      </ul>
    </section>

    <section class="container mx-auto p-8 rounded-xl bg-white">
      <header class="pb-6">
        <h2
          class="font-bold  text-black leading-tight font-display text-3xl md:text-3xl"
        >Web Zurich TV</h2>
      </header>
      <playlist :talks="talks" />
    </section>

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
      showBanner: false,
      active: false,
      events: [],
      feedbacks: [],
      talks: [],
      sponsors: [],
      workshops: []
    };
  },
   computed: {
    ...mapState({
      menu: state => state.menu.menu
    }),
    event() {
      const [first] = this.events;
      return first;
    },
    today() {
      var dateNow = new Date();
      dateNow.setUTCHours(0, 0, 0, 0);
      return dateNow.toISOString();
    },
  },
  mounted() {
    localStorage.getItem('hideBanner') === null
      ? (setTimeout(() => {this.showBanner = true}, 500))
      : (this.showBanner = false)
  },
  methods: {
    toDate,
    hideBanner() {
      localStorage.setItem('hideBanner', true);
      this.showBanner = false
    }
  },
  head() {
    return (
      this.event && {
        title: "next: " + this.toDate(this.event.date),
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
                url: this.event.meetupLink || "",
                description:
                  this.event.talks.length + " awesome talks about web topics",
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
        const { events, talks, feedbacks, sponsorsConnection, workshops } = data;
        this.events = events;
        this.talks = talks;
        this.feedbacks = feedbacks;
        this.workshops = workshops;
        this.sponsors = sponsorsConnection.edges
          .map(({ node: { events: eventList, ...rest } }) => ({
            ...rest,
            events: eventList.length
          }))
          .sort((a, b) => (a.events > b.events ? -1 : 1));
      },
      variables() {
        return {
          date: this.today
        };
      }
    }
  }
};
</script>


<style >
 .workshops {
  background-color: #ffaa00;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23ffb100' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23ffb800' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23ffbf00' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%23ffc500' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23ffcc00' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%23ffd624' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23ffe038' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%23ffeb49' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23fff558' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23ffff66' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: cover;
  background-position: bottom left;
  transition: 200ms ease-in-out background
 }
 .workshops:hover {
     background-position: top right;

 }
</style>
