<template>
  <div class="flex flex-wrap rounded-lg overflow-hidden shadow-blue">
    <div class="w-full lg:w-3/4">
      <ratio
        class="bg-black"
        :width="16"
        :height="9"
      >
        <iframe
          class="w-full h-full"
          type="text/html"
          allowfullscreen="allowfullscreen"
          v-if="talks[0]"
          :src="`https://www.youtube.com/embed/${talks[current].youtubecode}?modestbranding=1&showinfo=0`"
          frameborder="0"
        />

      </ratio>
    </div>
    <div class="w-full lg:w-1/4 lg:relative">
      <div class="lg:absolute lg:pin bg-primary-dark flex flex-col h-full overflow-hidden">
        <div class="p-4 text-grey-dark border-b border-primary-light">
          Playlist • <span v-if="talks">{{talks.length}}</span>
        </div>
        <div class="bg-primary overflow-auto flex-1 h-full">
          <ul
            class="list-reset"
            v-if="talks"
          >
            <li
              v-for="(video, index) in talks"
              :key="video.id"
              @click="current = video.youtubecode"
              :class="{'bg-primary-dark': index === current}"
              class="p-4 border-b border-primary-light cursor-pointer text-on-dark-secondary hover:text-white hover:bg-primary-dark"
            >
              <div class="flex items-start">
                <div
                  class="flex-no-shrink mr-4"
                  v-if="video.speakers"
                >
                  <div
                    v-for="speaker in video.speakers"
                    :key="speaker.id"
                  >
                    <img
                      class="rounded-full w-10 h-10"
                      :src="speaker.speakerPicture.url"
                      alt="speaker.name"
                    >
                  </div>
                </div>
                <div class="flex-1 leading-tight">
                  <div
                    v-for="speaker in video.speakers"
                    :key="speaker.id"
                    class="text-pink-light"
                  >
                    {{speaker.name}}
                  </div>
                  <div class="">
                    {{video.name}}
                  </div>

                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Ratio from "@/components/layout/Ratio";
  import QueryVideos from "~/services/apollo/queries/videos";

  export default {
    components: { Ratio },
    data() {
      return {
        current: 0,
        talks: []
      };
    },
    apollo: {
      talks: {
        prefetch: true,
        query: QueryVideos
      }
    }
  };
</script>
