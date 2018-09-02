<template>
<div>
  <div v-if="$apollo.loading" class="text-center">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>
  <div v-else>
    <div class="p-4 bg-indigo-darkest">
      <section >
        <div class="max-w-xl mx-auto">
          <div class="md:flex items-center relative" style="min-height: 200px;">
            <div class="md:w-1/2 p-4">
              <h1 class="leading-tight text-2xl md:text-4xl text-base text-white font-display font-bold tracking-wide uppercase">{{talk.name}}</h1>
            </div>
            <div class="md:w-1/2 p-4">
              <div
              :class="{'fixed-scene-active' : video}"
              class="scene3d fixed-scene w-full" v-if="talk.youtubecode">
                <div
                  @click="video = !video"
                  :class="{'video-active' : video}"
                  class="video relative rounded-lg overflow-hidden shadow-lg"
                  style="width: 100%; padding-top: calc(100% * 9 / 16 )">

                  <youtube
                    width="960px"
                    class="absolute w-full h-full pin"
                    @playing="() => {video = true}"
                    @paused="() => {video = false}"
                    @ended="() => {video = false}"
                    :video-id="talk.youtubecode"
                    ref="youtube"></youtube>
                  <div v-show="!video" class="absolute pin bg-white opacity-50 z-50"></div>
                </div>
                </div>

            </div>
          </div>


        </div>

        <div class="mx-auto max-w-xl p-4">
          <div class="font-mono max-w-md leading-normal text-grey text-xl font-light" v-html="talk.abstract"></div>
        </div>


      </section>

    </div>
  </div>
</div>
</template>

<script>

import gql from 'graphql-tag'

const talk = gql`
  query talk($id: ID!) {
    talk(where: {id: $id}) {
      id
      name
      abstract
      youtubecode
    }
  }
`
export default {
  data: () => ({
    talk: '',
    video: false
  }),
  apollo: {
    talk: {
      query: talk,
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
  },
  methods: {
    playVideo() {
      this.video = true
      this.player.playVideo()
    },
  },
  computed: {
    player () {
      console.log(this.$refs.youtube.player)
      return this.$refs.youtube.player
    }
  }
}
</script>



<style scoped>
.scene3d {
  perspective: 35cm;
}

@media screen and (min-width: 640px) {
  .video {
    transition: 500ms all ease-in-out;
    transform: rotate3d(0.5, -0.866, 0, 15deg) rotate(1deg) scale(0.472)
      translate3d(50%, -70%, 0);
  }
}

.video-active {
  transform: none;
}

@media screen and (min-width: 640px) {
  .fixed-scene {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    transition: 5000ms all ease-in-out;
  }
}
</style>
