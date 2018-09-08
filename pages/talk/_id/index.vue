<template>
  <div>
    <loader v-if="$apollo.loading" />
    <div v-else>
      <div class="p-4 bg-indigo-darkest">
        <section>
          <div class="max-w-xl mx-auto">
            <div class="md:flex items-center relative" style="min-height: 200px;">
              <div class="md:w-full p-4 owl">
                <h1 class="leading-tight text-2xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase">{{talk.name}}</h1>
                <div class=" w-full" v-if="talk.youtubecode">
                  <div class="relative rounded-lg overflow-hidden shadow-lg" style="width: 100%; padding-top: calc(100% * 9 / 16 )">
                    <iframe class="absolute pin w-full h-full" type="text/html" :src="`http://www.youtube.com/embed/${talk.youtubecode}`" frameborder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mx-auto max-w-xl p-4">
            <div class="font-mono max-w-md leading-normal text-grey text-xl font-light" v-html="talk.abstract"></div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>

import gql from 'graphql-tag'
import QueryTalk from '~/apollo/queries/talk'

export default {
  data() {
    return {
      talk: '',
      video: false
    }
  },
  apollo: {
    talk: {
      query: QueryTalk,
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
  }
}
</script>
