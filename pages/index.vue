<template>
  <div
    id="content"
    class="bg-primary-light pattern"
  >
    <section class="bg-primary-dark py-12">
      <div class="container mx-auto px-2">
        <div class="lg:flex">
          <div class="lg:w-2/5 px-2 pb-8">
            <h1 class="mb-4 leading-tight text-3xl md:text-4xl text-base text-on-dark-primary text-shadow font-display font-bold tracking-wide uppercase">People making
              <br>the web in Zürich
            </h1>
            <p class="leading-normal text-xl xl:text-2xl text-grey-lighter">
              Learn, share and collaborate
              <br>with your local
              <strong>web professionals</strong>
              <br>and enthusiasts!
            </p>
          </div>
          <div class="lg:w-3/5">
            <div class="md:flex md:flex-wrap -m-2">
              <a
                :href="item.url"
                target="_blank"
                class=" block md:flex md:flex-column w-full md:w-1/2 p-2 no-underline"
                v-if="menu && menu.social && menu.social.links"
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
    <div class="">
      <section class="container mx-auto p-2 rounded">
        <header
          class="py-8 flex flex-col md:flex-row items-start md:justify-between md:items-center px-2 owl md:owl-none"
          v-if="event"
        >
          <h2 class="leading-tight text-21 md:text-4xl text-on-dark-primary text-shadow font-display font-bold tracking-wide">Next Event: {{ event.date | date }}</h2>
          <div class="flex-no-shrink">
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
            <div class="xl:flex">
              <div
                class="xl:flex-1 xl:w-1/3 p-4"
                v-for="talk in event.talks"
                v-if="talk"
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
                    name: 'user-index-status-index-create',
                      query: {
                        redirect: 'user-index-status-index-create'
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
              <ul class="flex flex-wrap list-reset">
                <li
                  class="p-2 flex-no-grow"
                  v-for="sponsor in event.sponsors"
                  :key="sponsor.id"
                >
                  <a
                    class="p-4 rounded-lg block mr-8"
                    :href="sponsor.website"
                  >
                    <img
                      class="block transition h-20 opacity-64 hover:opacity-100 object-contain"
                      :src="sponsor.logo.url"
                      :alt="sponsor.name"
                    >
                  </a>
                </li>
              </ul>
            </section>
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
    <section-recent-videos />
    <section-feedbacks />
  </div>
</template>

<script>
  import gql from "graphql-tag";
  import Talk from "@/components/Talk";
  import Spinner from "@/components/feedback/Spinner";
  import SectionFeedbacks from "@/components/sections/feedbacks/";
  import SectionRecentVideos from "@/components/sections/recent-videos/";
  import QueryHome from "~/services/apollo/queries/home";
  import { mapState } from "vuex";

  export default {
    components: { Talk, Spinner, SectionFeedbacks, SectionRecentVideos },
    data() {
      return {
        users: [],
        events: [],
        active: false,
        talksCount: 0,
        talks: []
      };
    },
    head() {
      return {
        title: "Next Event"
      };
    },
    apollo: {
      events: {
        prefetch: true,
        query: QueryHome
      }
    },
    filters: {
      date(value) {
        if (!value) return "";
        const date = new Date(value);
        var options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        };
        return date.toLocaleDateString("en-US", options);
      }
    },
    computed: {
      ...mapState({
        menu: state => state.menu.menu
      }),
      event() {
        return this.events[0];
      }
    }
  };
</script>
