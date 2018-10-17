<template>
  <div>
    <label>
      <span>Username</span>
      <input v-model.lazy="name">
    </label>
    <label>
      <span>Image</span>
      <input @change="handleUpload" type="file" accept="image/*">
    </label>
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
    image () {
      return this.$store.state.account.image
    }
  },
  methods: {
    ...mapActions(['userNameUpdate', 'userImageUpload']),
    async handleUpload(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.userImageUpload(files[0])
    }
  }
}
</script>
