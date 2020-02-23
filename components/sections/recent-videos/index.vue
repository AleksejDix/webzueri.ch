<template>
  <div class="">
    <section>
      <header
        class="container mx-auto flex items-center justify-between pt-8 pb-4 px-4"
      >
        <h2
          class="leading-normal text-gray-700 font-display text-16 md:text-21 "
        >
          featured videos
        </h2>
        <Button to="/events/1">{{ talksCount - 3 }} more videos</Button>
      </header>

      <div class="container mx-auto">
        <div class="flex flex-wrap">
          <div v-for="talk in talks" :key="talk.id" class="w-full xl:w-1/3 p-4">
            <pannel>
              <h1 slot="header" class="text-lg leading-normal">
                {{ talk.name }}
              </h1>
              <Ratio width="210" height="118">
                <iframe
                  class="w-full h-full"
                  type="text/html"
                  allowfullscreen="allowfullscreen"
                  :src="
                    `https://www.youtube.com/embed/${talk.youtubecode}?modestbranding=1&showinfo=0`
                  "
                  frameborder="0"
                />
              </Ratio>
              <div v-if="talk.speakers" slot="footer">
                <nuxt-link
                  v-for="speaker in talk.speakers"
                  :key="speaker.id"
                  :to="{ name: 'speaker-id', params: { id: speaker.id } }"
                  class="group no-underline inline-block text-gray-500 hover:text-blue-500-light transition"
                >
                  <user-card
                    :photo="speaker.speakerPicture.handle"
                    :name="speaker.name"
                  />
                </nuxt-link>
              </div>
            </pannel>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QueryRecentVideos from "~/services/apollo/queries/recentVideos";
import Pannel from "@/components/Pannel";

export default {
  components: { Pannel },
  data() {
    return {
      talks: [],
      talksCount: ""
    };
  },
  apollo: {
    talks: {
      query: QueryRecentVideos,
      prefetch: () => {
        return {
          skip: Math.floor(Math.random() * 10) + 1
        };
      },
      variables() {
        return {
          skip: Math.floor(Math.random() * 10) + 1
        };
      },
      result({ data }) {
        this.talks = data.talks;
        this.talksCount = data.talksConnection.aggregate.count;
      }
    }
  }
};
</script>
