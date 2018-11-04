<template>
  <div class="bg-primary-light pattern min-h-screen">
    <div class="container mx-auto px-4">
      <h1 class="py-12 text-center leading-tight text-3xl md:text-5xl text-base text-white text-shadow font-display font-bold tracking-wide">Speaker</h1>

      <div class="p-2 -m-2 rounded-lg bg-primary-dark">
        <Spinner v-if="$apollo.loading" :active="$apollo.loading" />
        <ul v-else class="list-reset md:flex md:flex-wrap justify-center">
          <li class="w-full md:w-1/2 xl:w-1/3 p-2" v-for="speaker in speakers" :key="speaker.id">
            <nuxt-link :to="`/speaker/${speaker.id}`" class="zoom no-underline p-2 md:p-4 rounded shadow bg-primary md:h-full flex align-center  flex-row-reverse">

              <div class="flex-no-shrink flex items-center p-2 md:p-4">
                <div class="overflow-hidden border-2 border-white rounded-full shadow w-12 h-12 md:w-16 md:h-16 xl:w-24 xl:h-24">
                  <img v-if="speaker.speakerPicture" class="h-full w-full bg-white align-bottom " :src="speaker.speakerPicture.url " :alt="speaker.name ">
                </div>
              </div>

              <div class="flex-1 p-2 md:p-4">
                <h2 class="text-white text-xl xl:text-2xl font-display font-bold tracking-wide mb-4 leading-tight">{{speaker.name}}</h2>
                <div class="text-sm p-1 inline-flex items-center bg-blue-light rounded-full leading-none">
                  <span class="px-2 flex-1 text-blue-dark font-bold">Talks</span>
                  <div class="flex items-center justify-center bg-blue-dark font-bold text-blue-light rounded-full text-white h-6 w-6">{{speaker.talks.length}}</div>
                </div>
              </div>

            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import QuerySpeakers from "~/services/apollo/queries/speakers"

export default {
  apollo: {
    speakers: {
      prefetch: true,
      query: QuerySpeakers,
    }
  },
  data: () => ({
    speakers: []
  }),
  head() {
    return {
      title: "Speakers"
    }
  }
}
</script>
