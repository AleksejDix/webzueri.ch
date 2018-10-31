<template>
  <div>
    <img v-if="picture" :src="picture" alt="">
    <input v-model.lazy="name" />

    <input @change="handleUpload" type="file" accept="image/*" />

    <Button type="button" @click="$store.dispatch('signOut')">Sign Out</Button>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  computed: {
    name: {
      get () { return ''},
      set (value) { this.userNameUpdate(value) }
    },
    picture () {
      if (this.$store.state.profile) {
        return this.$store.state.profile.picture
      }

    }
  },
  methods: {
    ...mapActions(['userNameUpdate', 'userImageUpload']),
    async handleUpload(e) {

      const file = e.target.files[0];
      this.userImageUpload(file)
    }
  }
}
</script>
