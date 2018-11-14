<template>
  <div class="pattern bg-primary-dark min-h-screen">
    <Spinner v-if="$apollo.loading" :active="$apollo.loading" />
    <div class="max-w-lg rounded-lg p-4 mx-auto">
      <div class="owl-lg flex flex-col">
        <nuxt-link :to="{name: 'speaker-id', params: {id: speaker.id}}" class="text-on-dark-primary hover:text-yellow-light group no-underline inline-block" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
          <user-card size="xl" v-if="speaker.speakerPicture" :name="speaker.name" :photo="speaker.speakerPicture.url" />
        </nuxt-link>
        <nuxt-link :to="{ name: 'talk-id', params: { id: talk.id }}" class="flex-1 relative block bg-primary rounded-lg p-4 text-white md:flex no-underline whitespace-normal">
          <svg viewBox="0 0 24 24" class="w-6 h-6 absolute pin-l ml-5" style="bottom: 100%">
            <path class="fill-primary" d="M 12,12 L24 24 0 24 Z"></path>
          </svg>
          <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
            <div class="owl-md">
              <Prose color="on-dark" class="owl">
                <h1>{{talk.name}}</h1>
                {{talk.description}}
              </Prose>
              <Ratio v-if="talk.youtubecode" class="rounded-lg shadow-lg" width="16" height="9">
                <iframe class="w-full h-full" type="text/html" :src="`https://www.youtube.com/embed/${talk.youtubecode}`" frameborder="0" />
              </Ratio>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>

import QueryTalk from '~/services/apollo/queries/talk'
import Prose from '@/components/Prose'

export default {
  components: {Prose},
  apollo: {
    talk: {
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
    talk: '',
  }),
  computed: {
    video() {
      return [
        { hid: 'og:video', name: "og:video", content: `https://www.youtube.com/embed/${this.talk.youtubecode}`},
        { hid: 'og:video:type', name:"og:video:type", content:"video/mp4" },
        { hid: 'og:video:width', name:"og:video:width", content:"1600" },
        { hid: 'og:video:height', name:"og:video:height", content:"900" },
        { hid: 'og:site_name', name:"og:site_name", content:"web züri" },
      ]
    },
    cardType() {
      if (!this.talk.youtubecode) {
        return [{ hid: 'twitter:card', name: "twitter:card", content: "summary_large_image"}]
      }
      return [{ hid: 'twitter:card', name: "twitter:card", content: "player"}]
    }
  },
  head() {
    return {
      title: this.talk.name,
      meta: [
        { hid: 'description', name: 'description', content: this.talk.abstract },
        { hid: 'og:description', name: "og:description", content: this.talk.abstract},
        { hid: 'og:site_name', name:"og:site_name", content:"web zürich" },
        { hid: 'og:url', name: "og:url", content: process.env.baseUrl + this.$route.path },
        { hid: 'og:title', name: "og:title", content: this.talk.name},
        { hid: 'twitter:site', name: "twitter:site", content: "@webzuerich"},
        { hid: 'twitter:creator', name: "twitter:creator", content: "@aleksejdix"},
        { hid: 'twitter:card', name: "twitter:card", content: "summary_large_image"},
        { hid: 'og:image', name: "og:image", content: `https://us-central1-webzuerich-talk-image-gen.cloudfunctions.net/generateImage?id=xYXhOJZttRpkqxERH8MD&name=${this.talk.speakers && this.talk.speakers[0].name}&title=${this.talk.name}&userImg=${this.talk && this.talk.speakers[0].speakerPicture.url}`},
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'og:image': ['content']
      }
    }
  }
}
</script>
