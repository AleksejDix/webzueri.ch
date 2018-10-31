<template>
  <div class=" min-h-screen">
    <div class="h-64 bg-primary-light pattern">

    </div>

    <div class="container mx-auto -mt-32 px-4 pb-8" v-if="profile">

      <div class="md:flex md:items-end">
        <div class="profile w-48 h-48 rounded mr-6 p-8">
          <div class="spin-container">
            <div class="shape">
              <div class="bd">
                <img :src="profile.picture">
              </div>
            </div>
          </div>

        </div>

        <div class="flex flex-1 justify-between">
          <h1 class="leading-tight text-4xl text-primary font-display">{{profile.name}}</h1>
          <Button @click="$store.dispatch('signOut')">Sign Out</Button>
        </div>
      </div>

      <div class="py-12 text-on-dark-secondary" v-if="speaker">
        <Talk v-if="speaker.talks" :talk="talk" v-for="talk in speaker.talks" :key="talk.id" />
      </div>

    </div>

    <div class="bg-primary-light pattern min-h-screen">

      <div class="container mx-auto p-2">

        <section class="bg-primary-dark rounded-lg p-2">
          <div class="flex flex-wrap">

            <aside class="w-48 p-2">
              <ul class="list-reset owl-sm">
                <li>
                  <nuxt-link class="hover:bg-primary-light hover:text-on-dark-primary text-on-dark-secondary no-underline min-h-8 px-4 py-3 flex items-center rounded-lg " active-class="bg-primary-light text-on-dark-primary" to="/user/stories/">stories</nuxt-link>
                </li>
                <li>
                  <nuxt-link class="hover:bg-primary-light hover:text-on-dark-primary text-on-dark-secondary no-underline min-h-8 px-4 py-3 flex items-center rounded-lg " active-class="bg-primary-light text-on-light-primary" to="/user/talks/">talks</nuxt-link>
                </li>
              </ul>
            </aside>

            <div class="flex-1 p-2">
              <nuxt-child />
            </div>

          </div>
        </section>
      </div>
    </div>
  </div>
</template>


<script>

import gql from 'graphql-tag'
import QuerySpeaker from '~/services/apollo/queries/speaker'
import Talk from '~/components/Talk'
import { mapGetters } from 'vuex'

export default {
  components: { Talk },
  computed: {
    ...mapGetters(['profile'])
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
  //       if (!context.store.state.profile && !context.store.state.profile.speaker_id) return
  //       return { id: context.store.state.profile.speaker_id }
  //     },
  //     variables () {
  //       return {
  //         id: this.profile.speaker_id
  //       }
  //     }
  //   }
  // }
}
</script>

<style lang="scss">
  .spin-container {
    width: 100%;
    height: 100%;
    animation: spin 12s linear infinite;
    position: relative;
  }

  .shape {
    width: 100%;
    height: 100%;
    transition: border-radius 1s ease-out;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    animation: morph 8s ease-in-out infinite both alternate;
    position: absolute;
    overflow: hidden;
    z-index: 5;
  }

  .bd {
    border: 1px solid red;
    width: 150%;
    height: 150%;
    position: absolute;
    left: -25%;
    top: -25%;
    animation: spin 12s linear infinite reverse;
    opacity: 1;
    z-index: 2;
  }

  @keyframes morph {
    0% {
      border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
    }
    100% {
      border-radius: 40% 60%;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }

  img {
    width: 100%;
    transform: scale(0.75);
  }
</style>
