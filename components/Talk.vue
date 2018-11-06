<template>
  <div class="owl-lg flex flex-col">

    <nuxt-link :to="{name: 'speaker-id', params: {id: speaker.id}}" class="group no-underline inline-block" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
      <div class="inline-flex items-center">
        <div class="inline-block rounded-full w-12 h-12 mr-4 flex-no-shrink overflow-hidden" v-if="speaker.speakerPicture">
          <img class=" block w-12 h-12 rounded-full" :src="speaker.speakerPicture.url" :alt="speaker.name">
        </div>
        <div class="flex-1 text-14 pr-8 text-on-dark-secondary group-hover:text-white font-bold tracking-wide">
          <div>{{speaker.name}}</div>
        </div>
      </div>
    </nuxt-link>

    <nuxt-link :to="{ name: 'talk-id', params: { id: talk.id }}" class="flex-1 relative block bg-primary rounded-lg p-4 text-white md:flex zoom no-underline whitespace-normal">
      <div style="border-bottom-color: #1a237e" class="border-solid border-r-8 border-b-8 border-l-8 absolute pin-t pin-l -mt-2 ml-4 border-transparent">

      </div>
      <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
        <div class="owl-md">

          <h2 class="text-on-dark-primary text-2xl md:text-3xl leading-tight font-semibold ">{{talk.name}}</h2>

          <div>
            <Badge color="red" v-if="talk.youtubecode">recorded</Badge>
            <Badge color="green" v-if="isFutureTalk">upcoming</Badge>
          </div>

          <div v-if="talk.abstract" class="abstract leading-normal text-14 text-on-dark-secondary tracking-small">{{talk.abstract | shorten(100) }}</div>
        </div>

      </div>
    </nuxt-link>
  </div>
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
  },
  filters: {
    shorten (value, limit) {
      if (!value) return ''
      value = value.toString()
      return (value.length > limit) ? value.substr(0, limit-1) + '…' : value;
    }
  }
}
</script>
