<template>
  <nuxt-link
    class="flex flex-col justify-between block rounded-xl py-4 px-6 bg-main owl"
    :to="{ name: 'talks-id', params: { id: talk.id } }"
  >
    <div class="owl-sm">
      <h2
        class="text-2xl block items-center text-black font-bold font-display leading-tight tracking-tight"
      >
        {{ talk.name }}
      </h2>
      <div>
        <slot />
        <Badge v-if="talk.youtubecode" color="red">recorded</Badge>
      </div>
    </div>
    <div class="owl-sm">
      <user-card
        v-for="speaker in talk.speakers"
        :key="speaker.id"
        :photo="speaker.speakerPicture && speaker.speakerPicture.handle"
        :name="speaker.name"
      />
    </div>
  </nuxt-link>
</template>

<script>
import Badge from "@/components/Badge";
export default {
  components: { Badge },
  props: {
    talk: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
