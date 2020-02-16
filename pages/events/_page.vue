<template>
  <div id="content">
    <div class="container bg-white mx-auto p-6 rounded-xl">
      <section class="">
        <div class="px-4">
          <h1
            class="py-8 leading-tight text-3xl md:text-5xl text-base tracking-tight  font-display font-bold text-center"
          >
            Web Zurich organized {{ eventsCount }} Events
          </h1>
          <p
            class="max-w-md mx-auto leading-normal text-center text-xl md:text-2xl text-gray-700"
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
              }">Submit your talk</Button>-->
          </div>
        </div>
      </section>
      <div v-if="!$apollo.loading" class="container mx-auto p-4">
        <div class="owl">
          <div v-for="event in events" :key="event.id">
            <h2
              class="pb-4 mt-10 px-4 tracking-tight text-3xl text-black font-light font-display"
            >
              {{ event.date | date("MMMM yyyy") }}
            </h2>
            <div class="grid gap-6 md:grid-cols-3">
              <ul
                v-if="event.talks.length > 0"
                class="md:col-span-2 grid gap-6 md:grid-cols-2"
              >
                <li v-for="talk in event.talks" :key="talk.id">
                  <talk
                    v-if="talk"
                    class="h-full"
                    :talk="talk"
                    :date="event.date"
                  ></talk>
                </li>
              </ul>
              <section v-if="event.sponsors.length > 0" class="col-span-1">
                <div
                  class="bg-gray-700 rounded-xl sticky"
                  :style="{ top: '1rem' }"
                >
                  <h3
                    class="text-white p-4 text-12 font-display font-bold tracking-wide uppercase"
                  >
                    sponsored by:
                  </h3>

                  <a
                    v-for="sponsor in event.sponsors"
                    :key="sponsor.id"
                    :href="sponsor.website"
                    class="inline-block p-4"
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
          </div>
          <pagination :page="page" :max-page="maxPage"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Talk from "@/components/Talk";
import Pagination from "@/components/Pagination";
import QueryEvents from "~/services/apollo/queries/publishedEvents";
import QueryEventsCount from "~/services/apollo/queries/publishedEventsCount";

export default {
  components: { Talk, Pagination },
  data() {
    return {
      postPerPage: 5,
      events: [],
      eventsPerPage: 10
    };
  },
  computed: {
    today() {
      var dateNow = new Date();
      dateNow.setUTCHours(0, 0, 0, 0);
      var dateToISO = dateNow.toISOString();
      return dateToISO;
    },
    page() {
      if (!this.$route.params.page) return;
      return Number(this.$route.params.page) || 1;
    },
    maxPage() {
      return Math.ceil(this.eventsCount / this.eventsPerPage);
    },
    skip() {
      return this.page * this.eventsPerPage - this.eventsPerPage;
    }
  },

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
        const skip = Number(page) * this.eventsPerPage - this.eventsPerPage;
        const first = this.eventsPerPage;
        return {
          skip,
          first,
          date: this.today
        };
      },
      variables() {
        return {
          skip: this.skip,
          first: this.eventsPerPage,
          date: this.today
        };
      }
    },
    eventsCount: {
      prefetch: true,
      query: QueryEventsCount,
      update: ({ eventsConnection }) => eventsConnection.aggregate.count
    }
  }
};
</script>
