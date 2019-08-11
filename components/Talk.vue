<template>
  <div class="owl-lg">
    <div class="flex flex-wrap -ml-2 -mt-2">
      <div
        class="ml-2 mt-2"
        v-for="speaker in talk.speakers"
        :key="speaker.id"
      >
        <nuxt-link
          :to="{name: 'speaker-id', params: {id: speaker.id}}"
          class="group no-underline inline-block text-on-dark-secondary hover:text-blue-light transition"
          v-if="talk.speakers"
        >

          <user-card
            :photo="speaker.speakerPicture.handle"
            :name="speaker.name"
          />
        </nuxt-link>
      </div>
    </div>
    <nuxt-link
      :to="{ name: 'talk-id', params: { id: talk.id }}"
      class="group transition flex-1 relative block bg-primary hover:bg-primary-dark rounded-lg p-4 text-white hover:text-blue-light md:flex no-underline whitespace-normal shadow-blue"
    >
      <div class="flex flex-col flex-1 pb-4 md:pb-0 md:pr-4">
        <div class="owl-md">
          <h2 class="text-current-color text-lg md:text-18 leading-tight font-medium">{{talk.name}}</h2>
          <div>
            <Badge
              color="red"
              v-if="talk.youtubecode"
            >recorded</Badge>
            <Badge
              color="blue"
              v-if="isFutureTalk"
            >upcoming</Badge>
          </div>
          <div
            v-if="talk.abstract"
            class="leading-normal text-lg text-on-dark-secondary"
          >{{talk.abstract | shorten(100) }}</div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import Badge from "@/components/Badge";
export default {
  components: { Badge },
  props: ["talk", "date"],
  computed: {
    isFutureTalk () {
      const today = new Date();
      const tomorrow = today.setDate(today.getDate() - 1);
      return new Date(this.date) > new Date(tomorrow);
    }
  }
};
</script>
