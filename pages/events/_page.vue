<template>
  <div id="content ">
    <div class="bg-primary-light pattern min-h-screen">
      <section class="pt-12 pb-8">
        <div class="max-w-3xl mx-auto">
          <div class="px-4">
            <h1
              class="text-shadow mb-4 leading-tight text-3xl md:text-5xl text-base text-on-dark-primary font-display font-bold tracking-wide text-center"
            >
              Talks given at webzürich
            </h1>
            <p
              class="max-w-md mx-auto leading-normal text-center text-xl md:text-2xl text-on-dark-secondary"
            >
              Learn, share and collaborate with your local
              <strong>web professionals</strong>and enthusiasts!
            </p>
            <div class="flex justify-center pt-8">
              <Button
                href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1"
                >Submit your talk</Button
              >
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
          </div>
        </div>
      </section>
      <div class="container mx-auto p-4">
        <div
          v-if="$apollo.loading"
          class="container mx-auto bg-primary-dark rounded-lg p-2"
        >
          <Spinner :active="$apollo.loading" />
        </div>
        <div v-else class="owl">
          <div
            class="bg-primary-dark rounded-lg shadow-blue-darker "
            v-for="event in events"
            :key="event.id"
          >
            <ul
              class="list-reset xl:flex xl:flex-wrap p-2 -m-2"
              v-if="event.talks.length > 0"
            >
              <li
                class="p-4 xl:w-1/3"
                v-for="talk in event.talks"
                :key="talk.id"
              >
                <talk
                  v-if="talk"
                  class="h-full"
                  :talk="talk"
                  :date="event.date"
                ></talk>
              </li>
            </ul>
            <section>
              <header>
                <h3
                  class="text-white p-4 text-12 font-display font-bold tracking-wide uppercase"
                >
                  sponsored by:
                </h3>
              </header>

              <div class="flex flex-wrap -ml-8 -mt-8 p-4">
                <a
                  v-for="sponsor in event.sponsors"
                  :key="sponsor.id"
                  class="pt-8 pl-8 "
                  :href="sponsor.website"
                >
                  <img
                    loading="lazy"
                    class="max-w-10 transition w-auto opacity-64 hover:opacity-100 h-10 object-fit"
                    :src="sponsor.logo.url"
                    :alt="sponsor.name"
                  />
                </a>
              </div>
            </section>
          </div>
          <pagination :page="page" :maxPage="maxPage"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Talk from "@/components/Talk";
import Pagination from "@/components/Pagination";
import QueryEvents from "~/services/apollo/queries/publishedEvents";
import QueryEventsCount from "~/services/apollo/queries/publishedEventsCount";
import { mapState } from "vuex";

export default {
  data: () => ({
    postPerPage: 5,
    events: []
  }),
  head() {
    return {
      title: `Events ${this.$route.params.page}`
    };
  },
  apollo: {
    events: {
      query: QueryEvents,
      prefetch: context => {
        const { page } = context.route.params || 1;
        const { eventsPerPage } = context.store.state;
        const skip = Number(page) * eventsPerPage - eventsPerPage;
        const first = eventsPerPage;
        return {
          skip,
          first
        };
      },
      variables() {
        return {
          skip: this.skip,
          first: this.eventsPerPage
        };
      }
    },
    eventsCount: {
      prefetch: true,
      query: QueryEventsCount,
      update: ({ eventsConnection }) => eventsConnection.aggregate.count
    }
  },
  components: { Talk, Pagination },
  computed: {
    ...mapState(["eventsPerPage"]),
    page() {
      if (this.$route.params.page) return Number(this.$route.params.page) || 1;
    },
    maxPage() {
      return Math.ceil(this.eventsCount / this.eventsPerPage);
    },
    skip() {
      return this.page * this.eventsPerPage - this.eventsPerPage;
    }
  }
};
</script>
