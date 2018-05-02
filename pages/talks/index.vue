<template>
  <component v-if="story.content.component"
    :key="story.content._uid"
    :blok="story.content"
    :is="story.content.component"></component>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['story', 'talks'])
  },
  async fetch (context) {
    await context.store.dispatch('FETCH_STORY_BY_SLUG')
  }
}
</script>