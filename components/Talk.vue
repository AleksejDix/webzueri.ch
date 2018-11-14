<template>
  <div class="owl-lg flex flex-col">
    <nuxt-link
      :to="{name: 'speaker-id', params: {id: speaker.id}}"
      class="group no-underline inline-block text-on-dark-secondary hover:text-yellow-light transition"
      v-for="speaker in talk.speakers"
      v-if="talk.speakers"
      :key="speaker.id"
    >
      <user-card size="lg" :photo="speaker.speakerPicture.url" :name="speaker.name"/>
    </nuxt-link>
    <nuxt-link
      :to="{ name: 'talk-id', params: { id: talk.id }}"
      class="flex-1 relative block bg-primary rounded-lg p-4 text-white md:flex zoom no-underline whitespace-normal"
    >
      <svg viewBox="0 0 24 24" class="w-4 h-4 absolute pin-l ml-4" style="bottom: 100%">
        <path class="fill-primary" d="M 12,12 L24 24 L0 24 Z"></path>
      </svg>
      <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
        <div class="owl-md">
          <h2
            class="text-on-dark-primary text-2xl md:text-3xl leading-tight font-semibold"
          >{{talk.name}}</h2>
          <div>
            <Badge color="red" v-if="talk.youtubecode">recorded</Badge>
            <Badge color="green" v-if="isFutureTalk">upcoming</Badge>
          </div>
          <div
            v-if="talk.abstract"
            class="leading-normal text-14 text-on-dark-secondary tracking-small"
          >{{talk.abstract | shorten(100) }}</div>
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
  }
}
</script>
