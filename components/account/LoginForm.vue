<template>
  <form @submit.prevent="signup">
    <input type="email" v-model="email">
    <input type="password" v-model="password">
    <button type="submit">Log In</button>
    <button type="button" @click.prevent="$store.dispatch('userGoogleLogin')">with google</button>
    <button type="button" @click.prevent="$store.dispatch('userGithubLogin')">with github</button>
  </form>
</template>

<script>

export default {
  data () {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async signup () {
      try {
        await this.$store.dispatch('userLogin', { email: this.email, password: this.password})
        this.$router.push('/account')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
