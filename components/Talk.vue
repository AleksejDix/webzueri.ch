<template>
  <nuxt-link
    :to="{ name: 'talks-id', params: { id: talk.id }}"
    class="mt-4 block rounded-lg p-4 md:p-8 bg-indigo-darker text-white md:flex talk no-underline"
  >
    <div class="flex-1 pb-4 md:pb-0 md:pr-4">
      <h2 class="text-white text-2xl leading-tight font-semibold">{{talk.name}}</h2>

      <div class="flex items-center justify-between pt-6 text-white">
        <div class="flex items-center" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
          <div class="rounded-full w-10 h-10 mr-4 border-2 flex-no-shrink overflow-hidden" v-if="speaker.speakerPicture">
            <img :src="speaker.speakerPicture.url" :alt="speaker.name">
          </div>
          <div class="flex-1 opacity-75 text-lg">{{speaker.name}}</div>
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
  props: ['talk']
}
</script>

<style scoped>

.talk {
  transition: transform 160ms
}

.talk:focus,
.talk:hover {
  transform: scale(1.05);
}

</style>


