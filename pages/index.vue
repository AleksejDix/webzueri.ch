<style>
  .container ul li {
    display: grid;
    justify-content: center;
    grid-template-columns: 100px min-content 1fr;
  }

  .time {
    align-self: center;
    justify-self: right;
  }
  .grid {
    display: grid;
  }

  .timeline {
    grid-template-rows: 1fr min-content 1fr;
  }

  .timeline.first .line {
    grid-row:3/4;
  }

  .timeline.last .line {
    grid-row: 1/2;
  }

  .line {
    grid-row:1/4;
    grid-column: 1/2;
    justify-self: center;
  }

  .ball {
    grid-row:2/3;
    grid-column: 1/2;
    justify-self: center;
  }


</style>

<template>
  <section class="container mx-auto">
    <h1>Speakers</h1>
    <ul>
      <li v-for="(speaker,index) in data.stories" :key="speaker.uuid">
        <div class="time font-bold time text-xl font-mono text-grey-darkest">19:{{ (index + 1) * 15 }}</div>
        <span class="timeline grid mx-8" :class="[(index === 0) ? 'first' : (index === data.stories.length - 1) ? 'last' : '' ]">
          <span class="line block w-1 bg-blue-lighter "></span>
          <span class="ball block h-4 w-4 rounded-full bg-blue-dark border-blue-lighter border-4"></span>
        </span>
        <div class="speaker py-4 relative">
          <speaker-card :speaker="speaker.content"></speaker-card>
          <span class="minutes absolute bg-blue-dark text-white font-black font-mono pin-r pin-t mt-8 mr-4 p-2 rounded">15 min</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import SpeakerCard from "~/components/speakers/card"

export default {
  components: {
    SpeakerCard
  },
   mounted () {
    if (this.$storyblok.inEditor) {
      this.$storyblok.init()

      this.$storyblok.on('change', () => {
        location.reload(true)
      })
    }
  },
  data () {
    return { total: 0, data: { stories: [] } }
  },
  asyncData (context) {
    let version = context.query._storyblok || context.isDev ? 'draft' : 'published'
    return context.app.$storyapi
    .get('cdn/stories', {
      version: version,
      starts_with: `speakers`
    })
    .then((res) => res)
    .catch((res) => context.error({ statusCode: res.response.status, message: res.response.data }))
  }
}
</script>

