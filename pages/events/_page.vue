<template>
  <div id="content">
    <loader v-if="$apollo.loading" />
    <div class="bg-indigo-darkest">

      <section class="pt-12 pb-8 bg-indigo-darkest">
        <div class="max-w-3xl mx-auto">
          <div class="px-4">
            <h1 class="mb-4 leading-tight text-3xl md:text-5xl text-base text-yellow font-display font-bold tracking-wide uppercase text-center">Talks given at Web Zürich</h1>
            <p class="max-w-md mx-auto leading-normal text-center text-xl md:text-2xl text-yellow-lighter">Learn, share and collaborate with your local
              <strong>web professionals</strong> and enthusiasts!</p>
            <div class="text-center pt-8">
              <button @click="openModal" class="bg-yellow hover:bg-yellow-dark inline-block rounded py-4 px-6 uppercase no-underline text-md font-bold">Submit your talk</button>
            </div>
          </div>
        </div>
      </section>

      <div class="px-4">
        <div class="max-w-lg mx-auto">

          <div v-if="$apollo.loading">
            <div class="spinner">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
            </div>
          </div>

          <template v-else>
            <template v-for="event in events">
              <div class="p-2" v-for="talk in event.talks" v-if="talk" :key="talk.id">
                <talk :talk="talk" :date="event.date"></talk>
              </div>
            </template>
            <pagination :page="page" :maxPage="maxPage"></pagination>
          </template>

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
import ButtonDefault from "@/components/ButtonDefault"
import Pagination from "@/components/Pagination"
import QueryEvents from "~/apollo/queries/events"
import QueryEventsCount from "~/apollo/queries/eventsCount"
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
  components: { Talk, Modal, ButtonDefault, Pagination },
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
