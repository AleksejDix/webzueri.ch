<template>
  <div class="p-12 owl">

    <Prose class="owl">
      <h1>{{talk.title}}</h1>
      {{ talk.abstract }}
    </Prose>

    <div class="flex justify-end">
      <Button :to="{name: 'user-index-talks-index-id-edit'}">edit</Button>
    </div>

  </div>
</template>

<script>
import Prose from '~/components/Prose'
export default {
  components: {Prose},
  computed: {
    talk() {
      return this.$store.state.userTalks.current
    }
  },
  fetch ({ store, params }) {
    return store.dispatch('userTalks/edit', params.id)
  }
}
</script>

