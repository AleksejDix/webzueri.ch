<template>
  <div class="bg-primary-light pattern min-h-screen">

    <div class="md:p-2">

      <h1 class="hidden py-12 text-center leading-tight text-3xl md:text-5xl text-base text-white text-shadow font-display font-bold tracking-wide">Dashboard</h1>

      <div class="block bg-primary-dark sm:rounded-lg p-4 owl md:owl-md ">

        <div class="owl">

          <div class="overflow-auto">

            <ul class="list-reset owl-x flex md:mt-0">
              <li v-if="$store.getters['dashboard/talk-proposal/can'].list">
                <nuxt-link class="transition tracking-wide border-2 font-bold text-11 hover:bg-secondary hover:border-secondary hover:text-on-light-primary text-on-dark-secondary no-underline  h-10  px-3 flex items-center rounded-xl leading-none " exact-active-class="text-on-light-primary border-secondary" :to="{
                name: 'user-index-status-index',
                params: { status: 'talk-proposal'}
              }">Proposals</nuxt-link>
              </li>
              <li>
                <nuxt-link class="transition tracking-wide border-2 font-bold text-11 hover:bg-secondary hover:border-secondary hover:text-on-light-primary text-on-dark-secondary no-underline  h-10  px-3 flex items-center rounded-xl leading-none " exact-active-class="text-on-light-primary border-secondary" :to="{
                name: 'user-index-status-index',
                params: { status: 'story'}
              }">Stories</nuxt-link>
              </li>
              <li>
                <nuxt-link class="transition tracking-wide border-2 font-bold text-11 hover:bg-secondary hover:border-secondary hover:text-on-light-primary text-on-dark-secondary no-underline  h-10  px-3 flex items-center rounded-xl leading-none " exact-active-class="text-on-light-primary border-secondary" :to="{
                name: 'user-index-status-index',
                params: { status: 'talk'}
              }">Talks</nuxt-link>
              </li>
              <li>
                <nuxt-link class="transition tracking-wide border-2 font-bold text-11 hover:bg-secondary hover:border-secondary hover:text-on-light-primary text-on-dark-secondary no-underline  h-10  px-3 flex items-center rounded-xl leading-none " exact-active-class="text-secondary border-secondary" to="/user/settings/">Settings</nuxt-link>
              </li>
            </ul>

          </div>

          <div class="content">
            <nuxt-child />
          </div>
        </div>

      </div>

      <div class="xl:flex flex-wrap xl:owl-none" v-if="user">

        <div class="xl:w-1/5 xl:p-4">
          <!-- <Overline>stories</Overline>
        <div class="py-4">
          <div class="flex flex-wrap -m-2">
            <div class="w-1/2 p-2" v-for="n in 3" :key="n">
              <div class="shadow rounded-lg h-32 bg-primary-light gradient-dark bg-cover"> </div>
            </div>
          </div>
        </div> -->
        </div>

      </div>

    </div>
  </div>

</template>


<script>

import gql from 'graphql-tag'
import QuerySpeaker from '~/services/apollo/queries/speaker'
import Talk from '~/components/Talk'
import { mapState } from 'vuex'

export default {
  components: { Talk },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  data() {
    return {
      speaker: '',
    }
  },
  head() {
    return {
      title: ''
    }
  },
  // apollo: {
  //   speaker: {
  //     query: QuerySpeaker,
  //     prefetch: (context) => {
  //       if (!context.store.state.user && !context.store.state.user.speaker_id) return
  //       return { id: context.store.state.user.speaker_id }
  //     },
  //     variables () {
  //       return {
  //         id: this.user.speaker_id
  //       }
  //     }
  //   }
  // }
}
</script>
