<template>

  <div class="pattern  min-h-screen">
    <Spinner
      v-if="$apollo.loading"
      :active="$apollo.loading"
    />
    <div class="max-w-lg rounded-lg p-4 mx-auto">
      <div
        class="owl-lg flex flex-col"
        v-if="workshop.speakers"
      >
        <nuxt-link
          :to="{name: 'speaker-id', params: {id: speaker.id}}"
          class="text-on-dark-primary hover:text-blue-light no-underline inline-block"
          v-for="speaker in workshop.speakers"
          :key="speaker.id"
        >
          <user-card
            size="xl"
            v-if="speaker.speakerPicture"
            :name="speaker.name"
            :photo="speaker.speakerPicture.url"
          />
        </nuxt-link>
        <div class="flex-1 relative block bg-primary rounded-lg p-4 text-white md:flex no-underline whitespace-normal shadow-blue">
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
                <h1>{{workshop.name}}</h1>
                {{workshop.description}}
              </Prose>
              <Ratio
                v-if="workshop.youtubecode"
                class="rounded-lg shadow-lg"
                width="16"
                height="9"
              >
                <iframe
                  class="w-full h-full"
                  type="text/html"
                  :src="`https://www.youtube.com/embed/${workshop.youtubecode}`"
                  frameborder="0"
                />
              </Ratio>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import query from "~/services/apollo/queries/workshop";
  import Prose from "@/components/Prose";

  export default {
    components: { Prose },
    apollo: {
      workshop: {
        query,
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
      workshop: ""
    }),
    computed: {
      cardType() {
        if (!this.workshop.youtubecode) {
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
        title: this.workshop.name,
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.workshop.description
          },
          {
            hid: "og:description",
            name: "og:description",
            content: this.workshop.description
          },
          { hid: "og:site_name", name: "og:site_name", content: "web zürich" },
          {
            hid: "og:url",
            name: "og:url",
            content: process.env.baseUrl + this.$route.path
          },
          { hid: "og:title", name: "og:title", content: this.workshop.name },
          { hid: "twitter:site", name: "twitter:site", content: "@webzuerich" },
          {
            hid: "twitter:creator",
            name: "twitter:creator",
            content: "@aleksejdix"
          },
          {
            hid: "twitter:card",
            name: "twitter:card",
            content: "summary_large_image"
          },
          {
            hid: "og:image",
            name: "og:image",
            content: `https://us-central1-webzuerich-talk-image-gen.cloudfunctions.net/generateImage?id=xYXhOJZttRpkqxERH8MD&name=${this
              .workshop.speakers && this.workshop.speakers[0].name}&title=${
              this.workshop.name
            }&userImg=${this.workshop &&
              this.workshop.speakers[0].speakerPicture.url}`
          }
        ],
        __dangerouslyDisableSanitizersByTagID: {
          "og:image": ["content"]
        }
      };
    }
  };
</script>
