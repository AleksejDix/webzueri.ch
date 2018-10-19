<template>
  <nuxt-link :to="{ name: 'talk-id', params: { id: talk.id }}" class=" block bg-primary rounded-lg p-4 md:p-8 text-white md:flex zoom no-underline whitespace-normal">
    <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
      <div>
        <div class="inline-flex items-center rounded-full bg-grey-light text-red inline-block p-1 px-2 mb-4 leading-none uppercase text-xs tracking-wide font-bold" v-if="talk.youtubecode">
          <span class="inline-block w-2 h-2 bg-red rounded-full mr-1 "></span>
          <span class="relative" style="bottom: 1px"> recorded</span>
        </div>
        <div class="rounded-full bg-pink-dark inline-block p-1 px-2 mb-4 leading-none uppercase text-xs tracking-wide font-bold" v-if="isFutureTalk">uppcomming</div>

        <h2 class="text-white text-2xl md:text-3xl leading-tight font-semibold">{{talk.name}}</h2>
        <div v-if="talk.abstract" class="abstract leading-normal py-4 text-body">{{talk.abstract | shorten }}</div>
      </div>
      <div class="mt-auto">
        <div class=" flex text-white -mt-4 -ml-4 py-4">
          <div class="inline-block pl-4 pt-4" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
            <div class="inline-flex items-center bg-purple rounded-full p-1">
              <div class="inline-block rounded-full w-12 h-12 mr-4 flex-no-shrink overflow-hidden" v-if="speaker.speakerPicture">
                <img class="block w-12 h-12" :src="speaker.speakerPicture.url" :alt="speaker.name">
              </div>
              <div class="flex-1 text-lg pr-8 text-white font-bold">{{speaker.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="md:w-1/3 border-t md:border-t-0 md:border-l border-black pt-4 md:pt-0 md:pl-4">
      <span class="inline-flex rounded mr-2 mb-2 leading-none bg-indigo-dark px-2 py-1  font-bold text-xs uppercase whitespace-no-wrap" v-for="n in ['Security', 'JS', 'Ruby', 'Haskel', 'ML', 'Sketch']" :key="n">{{n}}</span>
    </div> -->
  </nuxt-link>
</template>

<script>
export default {
  props: ['talk', 'date'],
  computed: {
    isFutureTalk() {
      return new Date(this.date) > new Date()
    },
  },
  filters: {
    shorten(value) {
      return value
      // if (value.length <= 160) return value
      // const result = value.substring(0, 160)
      // return result + '…'
    }
  }
}
</script>
