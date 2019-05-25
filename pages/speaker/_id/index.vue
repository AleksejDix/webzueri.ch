

<template>
  <div class="pattern  min-h-screen">
    <Spinner
      v-if="$apollo.loading"
      :active="$apollo.loading"
    />
    <div class="max-w-lg rounded-lg p-4 mx-auto">
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
          <svg
            viewBox="0 0 24 8"
            class="w-8 h-8 absolute pin-l ml-4"
            style="bottom: 100%"
          >
            <path
              transform="translate(0,7.3)"
              class="fill-blue "
              d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z"
            />
            <path
              transform="translate(0,8.2)"
              class="transition fill-primary group-hover:fill-primary-dark "
              d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z"
            />

          </svg>
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
