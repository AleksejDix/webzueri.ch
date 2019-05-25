<template>
  <div class="flex items-start">
    <div class="flex-no-shrink mr-4" v-if="talk.speakers">
      <div v-for="speaker in talk.speakers" :key="speaker.id">
        <img
          loading="lazy"
          class="rounded-full w-10 h-10"
          :src="speaker.speakerPicture.handle"
          alt="speaker.name"
        >
      </div>
    </div>
    <div class="flex-1 leading-tight">
      <div
        v-for="speaker in talk.speakers"
        :key="speaker.id"
        class="text-pink-light"
      >{{ speaker.name }}</div>
      <div>{{ talk.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['talk']
}
</script>
