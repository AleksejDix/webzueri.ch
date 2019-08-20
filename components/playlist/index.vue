<template>
  <div class="flex flex-wrap rounded-lg overflow-hidden shadow-blue">
    <div class="w-full lg:w-3/4 sticky top-0">
      <ratio class="bg-black" :width="16" :height="9">
        <video-player v-if="playing" :video="currentVideoURL"/>
        <template v-else>
          <img :alt="currentVideo.speakers[0].name" class="w-fulls absolute inset-auto flex items-center justify-center z-10" :src="thumb">
          <div
            :style="{backgroundColor: 'rgba(0,0,0,0.35)'}"
            class="w-full h-full absolute inset-auto flex items-center justify-center z-10"
            @click="playing = true"
          >
            <button>
            <svg class="w-24 h-24  text-yellow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" class="fill-current"></circle>
              <path class="black" d="M15.51 11.14a1 1 0 0 1 0 1.72l-5 3A1 1 0 0 1 9 15V9a1 1 0 0 1 1.51-.86z"></path>

            </svg>
          </button>
          </div>
        </template>
      </ratio>
    </div>
    <div class="w-full lg:w-1/4 lg:relative">
      <div
        class="lg:absolute lg:inset-auto bg-primary-dark flex flex-col overflow-hidden max-h-128 lg:max-h-none h-full"
      >
        <div class="p-4 text-grey-dark border-b border-primary-light">
          Playlist •
          <span v-if="talks">{{ talks.length }}</span>
        </div>
        <div class="bg-primary overflow-auto flex-1 h-full">
          <list-talks :list="talks" :active="current" @click="setCurrent">
            <template v-slot:default="{talk, index}">
              <user-card
                :name="talk.speakers[0].name"
                :photo="talk.speakers[0].speakerPicture.handle"
                :meta="talk.name"
              />
            </template>
          </list-talks>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ratio from "@/components/layout/Ratio";
import ListTalks from "@/components/playlist/list-talks";
import UserCard from "@/components/UserCard";
const VideoPlayer = () => import("@/components/VideoPlayer");

export default {
  components: { Ratio, ListTalks, UserCard, VideoPlayer },
  props: ["talks"],
  data () {
    return {
      current: 0,
      playing: false
    };
  },
  computed: {
    thumb () {
      return `https://ssig.io/api/v1/projects/3b014fd9-a98a-4f76-a00e-66d8c0030346?speaker.text=${this.talks[this.current].speakers[0].name}&title.text=${this.talks[this.current].name}&avatar.imageUri=${this.talks[this.current].speakers[0].speakerPicture.url}`
    },
    currentVideoURL () {
      const { youtubecode } = this.currentVideo;
      return `https://www.youtube.com/embed/${youtubecode}?modestbranding=1&showinfo=0`;
    },
    currentVideo() {
      const currentVideo = this.talks[this.current];
      if (!currentVideo) return;
      return currentVideo
    }
  },
  methods: {
    setCurrent ({ index, talk }) {
      this.current = index
    }
  }
};
</script>
