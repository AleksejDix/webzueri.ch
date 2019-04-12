<template>
  <div class="">
    <section>
      <header
        class="container mx-auto flex items-center justify-between pt-8 pb-4 px-4"
      >
        <h2
          class="leading-normal text-on-dark-primary font-display text-16 md:text-21 text-shadow"
        >
          featured videos
        </h2>
        <Button to="/events/1">{{ talksCount - 3 }} more videos</Button>
      </header>

      <div class="container mx-auto">
        <div class="flex flex-wrap">
          <div class="w-full xl:w-1/3 p-4" v-for="talk in talks" :key="talk.id">
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
                    `https://www.youtube.com/embed/${
                      talk.youtubecode
                    }?modestbranding=1&showinfo=0`
                  "
                  frameborder="0"
                />
              </Ratio>
              <div slot="footer" v-if="talk.speakers">
                <nuxt-link
                  :to="{ name: 'speaker-id', params: { id: speaker.id } }"
                  class="group no-underline inline-block text-on-dark-secondary hover:text-blue-light transition"
                  v-for="speaker in talk.speakers"
                  :key="speaker.id"
                >
                  <user-card
                    size="lg"
                    :photo="speaker.speakerPicture.url"
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
