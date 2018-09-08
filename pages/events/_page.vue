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
              <template v-for="talk in event.talks" v-if="talk">
                <talk :talk="talk" :date="event.date" :key="talk.id"></talk>
              </template>
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

const POSTS_PER_PAGE = 5

export default {
  data: () => ({
    events: [],
    showNewTalkModal: false
  }),
  head() {
    return {
      title: `Events ${this.$route.params.page}`
    }
  },
  scrollToTop: false,
  apollo: {
    events: {
      query: QueryEvents,
      variables() {
        return {
          skip: this.skip,
          first: POSTS_PER_PAGE
        }
      }
    },
    eventsCount: {
      query: QueryEventsCount,
      update: ({ eventsConnection }) => eventsConnection.aggregate.count
    }
  },
  components: { Talk, Modal, ButtonDefault, Pagination },
  computed: {
    page() {
      if (this.$route.params.page) return Number(this.$route.params.page) || 1
    },
    maxPage() {
      return Math.ceil(this.eventsCount / POSTS_PER_PAGE)
    },
    skip() {
      return this.page * POSTS_PER_PAGE - POSTS_PER_PAGE
    }
  },

  methods: {
    openModal() {
      this.showNewTalkModal = true
    }
  }
}
</script>
