<template>
  <div>

    <form class="w-full owl-md" @submit.prevent="handleSubmit">
      <Input v-model="form.email" label="Email" type="email" placeholder="user@conf.couch" />
      <Input v-model="form.password" label="Password" type="password" />
      <div v-if="error" class="border-2 border-red-light rounded p-4 text-red-light bg-red-lightest font-bold text-sm">
        {{error}}
      </div>
      <div class="flex items-center justify-between owl-x">
        <ul class="list-reset owl-sm">
          <li>
            <nuxt-link class="link" to="/signup/">I want to sign up.</nuxt-link>
          </li>
          <li>
            <nuxt-link class="link" to="/password-reset/">I forgot my password.</nuxt-link>
          </li>
        </ul>
        <Button type="submit">Sign in</Button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    error: ''
  }),
  methods: {
    async handleSubmit() {
      try {
        await this.$store.dispatch('signIn', this.form)
      } catch (error) {
        console.log(error)
        this.error = '🤔' + error.message
      }
    }
  }
}
</script>
