<template>
  <div v-editable="story">
    {{ story.content.title }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['story'])
  },
  async fetch (context) {
    await context.store.dispatch('FETCH_STORY_BY_SLUG', context)
  }
}
</script>
