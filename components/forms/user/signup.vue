<template>
  <form class="w-full owl-md" @submit.prevent="register">
    <Input v-model="form.email" label="Email" type="email" />
    <Input v-model="form.password" label="Password" type="password" />
    <div v-if="error" class="border-2 border-red-light rounded p-4 text-red-light bg-red-lightest font-bold text-sm">
      {{error}}
    </div>
    <div class="flex owl-x justify-between items-center">
      <p>
        <nuxt-link to="/signin/" class="link">I already have an account</nuxt-link>
      </p>
      <Button primary type="submit">Sign Up</Button>
    </div>
  </form>
</template>

<script>
export default {
  data: () => ({
    form : {
      name: '',
      email: '',
      password: '',
    },
    error: '',
  }),
  methods: {
    async register() {
      try {
        await this.$store.dispatch('createUser', this.form)
      } catch (error) {
        this.error = '🤔' + error.message
      }
    }
  }
}
</script>

