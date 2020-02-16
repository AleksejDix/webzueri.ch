<template>
  <div v-if="!$apollo.loading" class="max-w-lg bg-white rounded-xl p-4 mx-auto">
    <div class="owl-lg flex flex-col">
      <div class="text-gray-700 hover:text-blue-500-light no-underline">
        <user-card
          v-if="speaker.speakerPicture"
          size="xl"
          :name="speaker.name"
          :photo="speaker.speakerPicture.handle"
        />
      </div>

      <nuxt-link
        v-for="talk in speaker.talks"
        :key="talk.id"
        :to="{ name: 'talk-id', params: { id: talk.id } }"
        class="flex-1 relative block bg-main rounded-xl p-4 text-white md:flex no-underline whitespace-normal "
      >
        <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
          <div class="owl-md">
            <Prose color="on-dark" class="owl">
              <h1>{{ talk.name }}</h1>
            </Prose>
            <Ratio
              v-if="talk.youtubecode"
              class="rounded-xl shadow-lg"
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
</template>

<script>
import Prose from "@/components/Prose";
import QuerySpeaker from "~/services/apollo/queries/speaker";

export default {
  components: { Prose },
  data() {
    return {
      speaker: ""
    };
  },
  head() {
    return {
      title: this.speaker.name
    };
  },
  apollo: {
    speaker: {
      query: QuerySpeaker,
      prefetch: ({
        route: {
          params: { id }
        }
      }) => ({ id }),
      variables() {
        return {
          id: this.$route.params.id
        };
      }
    }
  }
};
</script>
