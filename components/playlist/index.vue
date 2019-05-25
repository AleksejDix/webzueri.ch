<template>
  <div class="flex flex-wrap rounded-lg overflow-hidden shadow-blue">
    <div class="w-full lg:w-3/4 sticky pin-t">
      <ratio class="bg-black" :width="16" :height="9">
        <iframe
          loading="lazy"
          class="w-full h-full"
          type="text/html"
          allowfullscreen="allowfullscreen"
          :src="currentVideoURL"
          frameborder="0"
        />
      </ratio>
    </div>
    <div class="w-full lg:w-1/4 lg:relative">
      <div
        class="lg:absolute lg:pin bg-primary-dark flex flex-col overflow-hidden max-h-128 lg:max-h-none h-full"
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

export default {
  components: { Ratio, ListTalks, UserCard },
  props: ["talks"],
  data () {
    return {
      current: 0
    };
  },
  computed: {
    currentVideoURL () {
      const first = this.talks[this.current];
      if (!first) return;
      const { youtubecode } = first;
      return `https://www.youtube.com/embed/${youtubecode}?modestbranding=1&showinfo=0`;
    }
  },
  methods: {
    setCurrent ({ index, talk }) {
      this.current = index
    }
  }
};
</script>
