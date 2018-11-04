<template>
  <div class="bg-primary-dark min-h-screen">

    <div class="hidden md:block bg-primary-dark min-h-32 pl-64"></div>

    <div class="bg-primary-light pattern py-4 md:py-1">

      <div class="relative container mx-auto md:-mt-32">

        <div class="py-4 px-8">
          <div class="w-full md:w-48">
            <div class="relative" style="padding-top: 100%">
              <img class="w-full md:w-48 absolute pin rounded-lg shadow-lg bg-white" :src="user.photoURL">
            </div>
          </div>
        </div>

        <div class="relative block bg-primary-dark rounded-lg p-4 owl md:owl-md -mt-4 md:-mt-8">

          <div class="rounded-lg shadow-lg md:shadow-none relative -mt-12 bg-white md:bg-transparent p-6 owl md:-mt-24">
            <div class="flex flex-wrap owl-x items-center md:pl-24 md:ml-24">
              <h1 class="md:pl-4 text-on-light-primary md:text-on-dark-primary font-display font-bold text-16 md:text-21 leading-normal">{{user.displayName}}</h1>
              <Badge color="pink">speaker</Badge>
            </div>
          </div>

          <div class="owl">

            <ul class="list-reset owl-x flex md:mt-0">

              <li>
                <nuxt-link class="transition tracking-wide border-2 font-bold text-11 hover:bg-secondary hover:border-secondary hover:text-on-light-primary text-on-dark-secondary no-underline  h-10  px-3 flex items-center rounded-xl leading-none " exact-active-class="text-on-light-primary border-secondary" to="/user/talks/">Talks</nuxt-link>
              </li>
              <li>
                <nuxt-link class="transition tracking-wide border-2 font-bold text-11 hover:bg-secondary hover:border-secondary hover:text-on-light-primary text-on-dark-secondary no-underline  h-10  px-3 flex items-center rounded-xl leading-none " exact-active-class="text-secondary border-secondary" to="/user/settings/">Settings</nuxt-link>
              </li>
            </ul>

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
