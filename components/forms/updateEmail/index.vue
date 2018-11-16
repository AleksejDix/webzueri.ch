<template>
  <form @submit.prevent="handleSubmit" class="owl">
    <input-simple label="new email" v-model="email" type="email"></input-simple>
    <div class="flex justify-end">
      <Button>save</Button>
    </div>
  </form>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  data() {
    return {
      newEmail: ''
    }
  },
  computed: {
    ...mapState(['user']),
    email: {
      get () { return this.user.email },
      set (value) { this.newEmail = value }
    }
  },
  methods: {
    ...mapActions(['updateEmail']),
    handleSubmit() {
      this.updateEmail(this.newEmail || this.user.email)
    }
  }
}
</script>

