<template>
  <div class="bg-indigo-darkest">
    <wz-loader v-if="$apollo.loading" />

    <section v-else class="pattern bg-purple-dark ">
      <header class=" py-24">
        <div class="container mx-auto p-4 text-center">
          <h1 class="text-shadow max-w-xl mx-auto text-center p-8 text-center leading-tight text-2xl md:text-5xl text-base text-white font-display font-bold tracking-wide uppercase">{{speaker.name}}</h1>
          <img class="border-2 border-white shadow rounded-full inline-block w-32 h-32" v-if="speaker.speakerPicture" :src="speaker.speakerPicture.url" :alt="speaker.name">
        </div>
      </header>
    </section>

    <div class="container mx-auto rounded-lg p-4 ">

      <h2 class="py-12 text-center leading-tight text-3xl md:text-5xl text-base text-white font-display font-bold tracking-wide uppercase">Talks</h2>

      <ul class="flex flex-wrap list-reset -m-2">
        <li class="w-full md:w-1/2 p-2" v-for="talk in speaker.talks" :key="talk.id">
          <nuxt-link :to="`/talk/${talk.id}`" class="block no-underline zoom transition p-2 md:p-8 rounded shadow bg-indigo-darker md:h-full">
            <h3 class="text-white text-xl xl:text-2xl font-display font-bold tracking-wide mb-2 leading-tight">{{ talk.name }}</h3>
            <div v-if="talk.abstract" class="abstract leading-normal py-4 text-body text-white">{{ talk.abstract }}</div>
          </nuxt-link>
        </li>
      </ul>

    </div>

  </div>
</template>

<script>
import gql from 'graphql-tag'
import QuerySpeaker from '~/apollo/queries/speaker'

export default {
  data() {
    return {
      speaker: '',
    }
  },
  head() {
    return {
      title: this.speaker.name
    }
  },
  apollo: {
    speaker: {
      query: QuerySpeaker,
      prefetch: ({route: {params: {id}}}) => ({id}),
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
  }
}
</script>
