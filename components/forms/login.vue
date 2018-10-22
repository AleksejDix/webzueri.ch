<template>
  <form class="w-full max-w-md px-12" @submit.prevent="signup">
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="email">
        Email
      </label>
      <input v-model="email" class="appearance-none block w-full bg-grey-lighter text-grey-darkest border border-grey-lighter rounded py-3 px-4 mb-3" id="email" type="email" placeholder="user@webzuri.ch">
    </div>
    <div class="w-full md:w-1/2 px-3">
      <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="password">
        Password
      </label>
      <input v-model="password" class="appearance-none block w-full bg-grey-lighter text-grey-darkest border border-grey-lighter rounded py-3 px-4" id="password" type="password" placeholder="yourpassword">
    </div>
  </div>

  <wz-button type="submit">Log In</wz-button>
  <wz-button type="button" @click.prevent="$store.dispatch('userGoogleLogin')">with google</wz-button>
  <wz-button type="button" @click.prevent="$store.dispatch('userGithubLogin')">with github</wz-button>

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
