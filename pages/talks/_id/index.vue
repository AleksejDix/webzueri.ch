<template>
  <div v-if="!$apollo.loading" class="max-w-4xl bg-white rounded-xl p-6 mx-auto">
    <div v-if="talk.speakers" class="mb-4 flex flex-row items-center gap-3">
      <nuxt-link
        v-for="speaker in talk.speakers"
        :key="speaker.id"
        :to="{ name: 'speakers-id', params: { id: speaker.id } }"
        class="text-gray-700 hover:text-blue-500-light no-underline flex items-center gap-2"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            v-if="speaker.speakerPicture"
            :src="`https://media.graphcms.com/resize=fit:crop,height:32,width:32/${speaker.speakerPicture.handle}`"
            :alt="speaker.name"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="text-sm font-medium">{{ speaker.name }}</span>
      </nuxt-link>
    </div>
      <div
        class="flex-1 relative block bg-primary rounded-xl text-white md:flex no-underline whitespace-normal "
      >
        <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
          <div class="owl-md">
            <Prose color="on-dark" class="owl">
              <h1 class="leading-tight mb-8">{{ talk.name }}</h1>
              {{ talk.abstract }}
            </Prose>
            <Ratio
              v-if="talk.youtubecode"
              class="rounded-xl shadow-lg"
              width="16"
              height="9"
            >
              <iframe
                loading="lazy"
                class="w-full h-full"
                type="text/html"
                :src="`https://www.youtube.com/embed/${talk.youtubecode}`"
                frameborder="0"
              />
            </Ratio>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import QueryTalk from "~/services/apollo/queries/talk";
import Prose from "@/components/Prose";

export default {
  components: { Prose },
  apollo: {
    talk: {
      query: QueryTalk,
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
  },
  data: () => ({
    talk: ""
  }),
  computed: {
    video() {
      return [
        {
          hid: "og:video",
          name: "og:video",
          content: `https://www.youtube.com/embed/${this.talk.youtubecode}`
        },
        { hid: "og:video:type", name: "og:video:type", content: "video/mp4" },
        { hid: "og:video:width", name: "og:video:width", content: "1600" },
        { hid: "og:video:height", name: "og:video:height", content: "900" },
        { hid: "og:site_name", name: "og:site_name", content: "web züri" }
      ];
    },
    cardType() {
      if (!this.talk.youtubecode) {
        return [
          {
            hid: "twitter:card",
            name: "twitter:card",
            content: "summary_large_image"
          }
        ];
      }
      return [{ hid: "twitter:card", name: "twitter:card", content: "player" }];
    }
  },
  head() {
    return {
      title: this.talk.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.talk.abstract
        },
        {
          hid: "og:description",
          name: "og:description",
          content: this.talk.abstract
        },
        {
          hid: "og:url",
          name: "og:url",
          content: process.env.baseUrl + this.$route.path
        },
        { hid: "og:title", name: "og:title", content: this.talk.name },
        {
          hid: "twitter:card",
          name: "twitter:card",
          content:
            this.talk.speakers &&
            this.talk.speakers.length &&
            this.talk.speakers[0].speakerPicture.url
        },
        {
          name: "image",
          property: "og:image",
          content:
            this.talk.speakers &&
            this.talk.speakers.length &&
            this.talk.speakers[0].speakerPicture.url
        }
      ]
    };
  }
};
</script>
