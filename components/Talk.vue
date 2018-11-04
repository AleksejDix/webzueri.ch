<template>
  <nuxt-link :to="{ name: 'talk-id', params: { id: talk.id }}" class=" block bg-primary rounded-lg p-4 text-white md:flex zoom no-underline whitespace-normal">
    <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
      <div class="owl-md">

        <h2 class="text-on-dark-primary text-2xl md:text-3xl leading-tight font-semibold ">{{talk.name}}</h2>

        <div>
          <Badge color="red" v-if="talk.youtubecode">recorded</Badge>
          <Badge color="green" v-if="isFutureTalk">upcoming</Badge>
        </div>

        <div v-if="talk.abstract" class="abstract leading-normal text-14 text-on-dark-secondary tracking-small">{{talk.abstract }}</div>
      </div>
      <div class="mt-auto">
        <div class=" flex text-white -mt-4 -ml-4 py-4">
          <div class="inline-block pl-4 pt-4" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
            <div class="inline-flex items-center bg-purple rounded-full p-1">
              <div class="inline-block rounded-full w-12 h-12 mr-4 flex-no-shrink overflow-hidden" v-if="speaker.speakerPicture">
                <img class="block w-12 h-12 rounded-full" :src="speaker.speakerPicture.url" :alt="speaker.name">
              </div>
              <div class="flex-1 text-lg pr-8 text-white font-bold">{{speaker.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import Badge from '@/components/Badge'
export default {
  components: {Badge},
  props: ['talk', 'date'],
  computed: {
    isFutureTalk() {
      return new Date(this.date) > new Date()
    }
  }
}
</script>
