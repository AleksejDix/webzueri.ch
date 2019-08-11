<template>
  <div class="pattern min-h-screen">
    <div class="max-w-lg rounded-lg p-4 mx-auto"  v-if="!$apollo.loading">
      <div class="owl-lg flex flex-col">
        <div class="text-on-dark-primary hover:text-blue-light no-underline">
          <user-card
            size="xl"
            v-if="speaker.speakerPicture"
            :name="speaker.name"
            :photo="speaker.speakerPicture.handle"
          />
        </div>

        <nuxt-link
          :to="{ name: 'talk-id', params: { id: talk.id }}"
          v-for="talk in speaker.talks"
          :key="talk.id"
          class="flex-1 relative block bg-primary rounded-lg p-4 text-white md:flex no-underline whitespace-normal shadow-blue"
        >

          <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
            <div class="owl-md">
              <Prose
                color="on-dark"
                class="owl"
              >
                <h1>{{talk.name}}</h1>

              </Prose>
              <Ratio
                v-if="talk.youtubecode"
                class="rounded-lg shadow-lg"
                width="16"
                height="9"
              >
                <iframe
                  class="w-full h-full"
                  type="text/html"
                  :src="`https://www.youtube.com/embed/${talk.youtubecode}`"
                  frameborder="0"
                />
              </Ratio>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Prose from '@/components/Prose'
import gql from 'graphql-tag'
import QuerySpeaker from '~/services/apollo/queries/speaker'

export default {
  components: { Prose },
  data () {
    return {
      speaker: '',
    }
  },
  head () {
    return {
      title: this.speaker.name
    }
  },
  apollo: {
    speaker: {
      query: QuerySpeaker,
      prefetch: ({ route: { params: { id } } }) => ({ id }),
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
  }
}
</script>
