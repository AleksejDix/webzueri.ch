<template>
  <component v-if="story.content.component"
    :key="story.content._uid"
    :blok="story.content"
    :is="story.content.component"></component>
</template>

<script>
export default {
  computed: {
    story () { return this.$store.state.story }
  },
  async fetch (context) {
    await context.store.dispatch('FETCH_STORY_BY_SLUG', context)
  }
}
</script>