<template>
  <div class="p-12">
    <user-talk-update />
  </div>
</template>


<script>

import UserTalkUpdate from '@/components/forms/userTalk/update'
import {mapActions} from 'vuex'
export default {
  components: {UserTalkUpdate},
  computed: {
    talk() {
      return this.$store.state.userTalks.current
    }
  },
  fetch ({ store, params }) {
    return store.dispatch('userTalks/edit', params.id)
  },
  methods: {
    ...mapActions('userTalks', ['destroy']),
    async handleDelete(id) {
      try {
        const ok = await this.destroy(id)
        this.$router.push({name: "user-index-talks-index"})
      } catch (error) {
        console.log('Deletion was not possible', error)
      }
    }
  }
}
</script>

