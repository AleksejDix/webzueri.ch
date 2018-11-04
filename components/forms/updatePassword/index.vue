<template>
  <form @submit.prevent="handleSubmit" class="owl">
    <Input label="new password" v-model="newPassword" type="password" />
    <div class="flex justify-end">
      <Button>save</Button>
    </div>
  </form>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data() {
    return {
      newPassword: ''
    }
  },
  methods: {
    ...mapActions(['updatePassword']),
    async handleSubmit() {
      try {
        await this.updatePassword(this.newPassword)
        this.newPassword = ''
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

