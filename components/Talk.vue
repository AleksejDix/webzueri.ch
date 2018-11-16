<template>
  <div class="owl-lg">
    <nuxt-link :to="{name: 'speaker-id', params: {id: speaker.id}}" class="group no-underline inline-block text-on-dark-secondary hover:text-blue-light transition" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
      <user-card size="lg" :photo="speaker.speakerPicture.url" :name="speaker.name" />
    </nuxt-link>
    <nuxt-link :to="{ name: 'talk-id', params: { id: talk.id }}" class="group transition flex-1 relative block bg-primary hover:bg-primary-dark rounded-lg p-4 text-white hover:text-blue-light md:flex no-underline whitespace-normal shadow-blue">
      <svg viewBox="0 0 24 8" class="w-8 h-8 absolute pin-l ml-2" style="bottom: 100%">
        <path transform="translate(0,7.3)" class="fill-blue " d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z" />
        <path transform="translate(0,8.2)" class="transition fill-primary group-hover:fill-primary-dark " d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z" />

      </svg>
      <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
        <div class="owl-md">
          <h2 class="text-current-color text-14 md:text-18 leading-tight font-medium">{{talk.name}}</h2>
          <div>
            <Badge color="red" v-if="talk.youtubecode">recorded</Badge>
            <Badge color="blue" v-if="isFutureTalk">upcoming</Badge>
          </div>
          <div v-if="talk.abstract" class="leading-normal text-14 text-on-dark-secondary">{{talk.abstract | shorten(100) }}</div>
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
      const today = new Date();
      const tomorrow = (today.setDate(today.getDate() - 1));
      return new Date(this.date) > new Date(tomorrow)
    }
  }
}
</script>
