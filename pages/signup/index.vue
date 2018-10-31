<template>
  <div class="p-8 bg-primary-light pattern h-screen">
    <div class="shadow-lg bg-white max-w-md mx-auto rounded-lg overflow-hidden">
      <header class="modal-header bg-primary-dark flex">
        <nuxt-link to="/signin/" class="relative tab flex-1 text-on-dark-secondary tracking-wide no-underline leading-none uppercase inline-block items-center justify-center text-center py-6 px-6  font-semibold text-sm">
          Sign In
        </nuxt-link>
        <nuxt-link to="/signup/" class="relative tab flex-1 text-on-dark-secondary tracking-wide no-underline leading-none uppercase inline-block items-center justify-center text-center py-6 px-6  font-semibold text-sm">
          Sign Up
        </nuxt-link>
      </header>
      <div>
        <Signup />

        <Button type="submit">
          <nuxt-link to="/signin" class="no-underline text-primary">I already have an account</nuxt-link>
        </Button>

      </div>
    </div>
  </div>
</template>

<script>
import Signup from "@/components/forms/user/signup"
export default {
  components: {
    Signup
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
