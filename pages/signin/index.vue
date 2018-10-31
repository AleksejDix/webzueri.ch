<template>

  <div class="p-8 bg-primary-light pattern h-screen">
    <div class="shadow-lg bg-white max-w-md mx-auto rounded-lg overflow-hidden">
      <header class="modal-header bg-primary-dark flex">
        <nuxt-link to="/signin" class="relative tab flex-1 text-on-dark-secondary tracking-wide no-underline leading-none uppercase inline-block items-center justify-center text-center py-6 px-6  font-semibold text-sm">
          Sign In
        </nuxt-link>
        <nuxt-link to="/signup" class="relative tab flex-1 text-on-dark-secondary tracking-wide no-underline leading-none uppercase inline-block items-center justify-center text-center py-6 px-6  font-semibold text-sm">
          Sign Up
        </nuxt-link>
      </header>
      <div class="flex ">

        <Signin />

        <div class="p-4 owl">
          <Button type="button" @click.prevent="$store.dispatch('userGoogleLogin')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#google" /></svg>
            Sign in with google</Button>
          <Button type="button" @click.prevent="$store.dispatch('userGithubLogin')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#github" /></svg>
            Sign in with github
          </Button>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import Signin from "@/components/forms/user/signin"
export default {
  components: {
    Signin
  }
}
</script>

<style scoped>
  .nuxt-link-active {
    @apply text-secondary;
  }
  .nuxt-link-active::after {
    content: '';
    @apply absolute pin-x pin-b bg-secondary h-1;
  }
</style>
