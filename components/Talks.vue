<template>
  <div>
    <ul v-for="talk in talks" :key="talk.uuid">
      <li>
        <nuxt-link exact :to="`./${talk.full_slug}`">{{talk.name}}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['blok'],
  computed: {
    talks () { return this.$store.state.talks }
  }
}
</script>