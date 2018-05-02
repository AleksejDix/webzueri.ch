<template>
  <div class="talks">
    <h1>Future Taks</h1>
    <ul class="talks-list">
      <li v-for="talk in talks" :key="talk.uuid">
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
    ...mapState(['story', 'talks'])
  },
  mounted() {
    this.$store.dispatch('GET_TALKS')
  }
}
</script>

<style>
.talks-list {
  display: grid;
  grid-row-gap: 30px;
}

</style>
