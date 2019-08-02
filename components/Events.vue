<template>
  <div class="events">
    <h1>Future Taks</h1>
    <ul class="events-list list-reset">
      <li v-for="talk in events" :key="talk.uuid">
        <talk :talk="talk"></talk>
      </li>
    </ul>
  </div>
</template>

<script>
import Talk from "@/components/Talk"
import { mapState } from 'vuex'

export default {
  props: ['blok'],
  components: {
    Talk
  },
  computed: {
    ...mapState(['story', 'events'])
  },
  mounted () {
    this.$store.dispatch('GET_events')
  }
}
</script>

<style>
.events-list {
  display: grid;
  grid-row-gap: 30px;
}
</style>
