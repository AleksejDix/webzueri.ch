<template>
  <form class="w-full owl-md" @submit.prevent="handleSubmit">
    <Input v-model="form.email" label="Email" type="email" placeholder="user@conf.couch" />
    <div class="flex items-center justify-between owl-x">
      <p>
        <nuxt-link class="link" to="/signin/">I remember my password</nuxt-link>
      </p>
      <Button type="submit">reset my password</Button>
    </div>
  </form>
</template>

<script>
export default {
  data: () => ({
    form: {
      email: '',
    },
    error: ''
  }),
  methods: {
    async handleSubmit() {
      try {
        const ok = await this.$store.dispatch('sendPasswordReset', this.form)
      } catch (error) {
        this.error = '🤔' + error.message
      }
    }
  }
}
</script>
