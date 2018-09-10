<template>
  <div class="bg-indigo-darkest">
    <loader v-if="$apollo.loading" />
    <section v-else>
      <header class="pattern bg-purple-dark py-24">
        <div class="container mx-auto p-2">
          <h1 class="text-shadow max-w-xl mx-auto text-center p-8 text-center leading-tight text-2xl md:text-5xl text-base text-white font-display font-bold tracking-wide uppercase">{{talks[0].name}}</h1>

          <ul class="flex justify-center list-reset">
            <li class="text-center" v-for="speaker in talks[0].speakers" :key="speaker.id">
              <nuxt-link :to="`/speaker/${speaker.id}`" class="no-underline">
                <img class="border-2 border-white shadow rounded-full inline-block w-32 h-32" v-if="speaker.speakerPicture" :src="speaker.speakerPicture.url" :alt="speaker.name">
                <h2 class="text-shadow py-4 text-center text-white text-xl">{{speaker.name}}</h2>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </header>

      <div class="max-w-xl mx-auto">
        <div class="md:flex items-center relative">
          <div class="md:w-full p-4 owl">
            <div v-if="talks[0].youtubecode" class="relative rounded-lg overflow-hidden shadow-lg" style="width: 100%; padding-top: calc(100% * 9 / 16 )">
              <iframe class="absolute pin w-full h-full" type="text/html" :src="`http://www.youtube.com/embed/${talks[0].youtubecode}`" frameborder="0" />
            </div>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-xl p-4">
        <div class="font-sans text-xl  leading-normal text-white text-xl font-light" v-html="talks[0].abstract"></div>
      </div>
    </section>
  </div>
</template>

<script>

import QueryTalk from '~/apollo/queries/talk'

export default {
  apollo: {
    talks: {
      query: QueryTalk,
      prefetch: ({route: {params: {id}}}) => ({ id }),
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
  },
  data: () => ({
    talks: [],
  }),
  head() {
    return {
      title: this.talks[0].name
    }
  }
}
</script>
