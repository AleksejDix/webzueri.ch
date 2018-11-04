<template>
  <div id="content ">

    <div class="bg-primary-light pattern min-h-screen">
      <section class="pt-12 pb-8">
        <div class="max-w-3xl mx-auto">
          <div class="px-4">
            <h1 class="text-shadow mb-4 leading-tight text-3xl md:text-5xl text-base text-on-dark-primary font-display font-bold tracking-wide  text-center">Talks given at webzürich</h1>
            <p class="max-w-md mx-auto leading-normal text-center text-xl md:text-2xl text-on-dark-secondary">Learn, share and collaborate with your local
              <strong>web professionals</strong> and enthusiasts!</p>
            <div class="text-center pt-8">
              <Button :to="{ name: 'user-index-talks', query: { redirect: 'user-index-talks' }}">Submit your talk</Button>
            </div>
          </div>
        </div>
      </section>

      <div class="px-4">

        <div v-if="$apollo.loading" class="container mx-auto bg-primary-dark rounded-lg p-2">
          <Spinner :active="$apollo.loading" />
        </div>
        <div v-else class="owl">
          <div class="xl:flex xl:flex-wrap max-w-xl mx-auto bg-primary-dark rounded-lg p-2" v-for="event in events" :key="event.id" v-if="event.talks.length > 0">
            <div class="p-2 xl:w-full" v-for="talk in event.talks" v-if="talk" :key="talk.id">
              <talk class="h-full" :talk="talk" :date="event.date"></talk>
            </div>
          </div>
          <pagination :page="page" :maxPage="maxPage"></pagination>
        </div>

      </div>
    </div>

    <modal :show="showNewTalkModal" @close="showNewTalkModal = false">
      <div slot="header">Submit new talk</div>
    </modal>

  </div>

</template>

<script>
import gql from 'graphql-tag'
import Modal from "@/components/Modal"
import Talk from "@/components/Talk"
import Pagination from "@/components/Pagination"
import QueryEvents from "~/services/apollo/queries/events"
import QueryEventsCount from "~/services/apollo/queries/eventsCount"
import { mapState } from 'vuex'

export default {
  data: () => ({
    postPerPage: 5,
    events: [],
    showNewTalkModal: false
  }),
  head() {
    return {
      title: `Events ${this.$route.params.page}`
    }
  },
  apollo: {
    events: {
      query: QueryEvents,
      prefetch: (context) => {
        const {page} = context.route.params || 1
        const {eventsPerPage} = context.store.state
        const skip = Number(page) * eventsPerPage - eventsPerPage
        const first = eventsPerPage
        return {
          skip,
          first
        }
      },
      variables() {
        return {
          skip: this.skip,
          first: this.eventsPerPage
        }
      }
    },
    eventsCount: {
      prefetch: true,
      query: QueryEventsCount,
      update: ({ eventsConnection }) => eventsConnection.aggregate.count
    }
  },
  components: { Talk, Modal, Pagination },
  computed: {
    ...mapState(['eventsPerPage']),
    page() {
      if (this.$route.params.page) return Number(this.$route.params.page) || 1
    },
    maxPage() {
      return Math.ceil(this.eventsCount / this.eventsPerPage)
    },
    skip() {
      return this.page * this.eventsPerPage - this.eventsPerPage
    }
  },

  methods: {
    openModal() {
      this.showNewTalkModal = true
    }
  }
}
</script>
