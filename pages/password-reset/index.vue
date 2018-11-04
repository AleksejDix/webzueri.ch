<template>
  <div class="w-full md:max-w-sm mx-auto">
    <section class="shadow md:rounded-lg bg-primary-dark">

      <header class="px-6 py-8 owl-sm rounded-t-lg">
        <h1 class="text-16 text-on-dark-primary leading-tight">Reset password</h1>
        <p class="text-on-dark-secondary text-12 leading-normal">To reset your password, enter the email address you use to sign in to <nuxt-link class="link" to="/">webzuri.ch</nuxt-link>
        </p>
      </header>

      <div class="px-4 translate-y-4 -mt-4">
        <div class="flex flex-col owl bg-white shadow-lg rounded-lg py-4 px-6">
          <PasswordReset />
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import PasswordReset from "@/components/forms/user/password-reset"
export default {
  layout: 'tunnel',
  components: {
    PasswordReset
  }
}
</script>

<style>
  .translate-y-4 {
    transform: translateY(1rem);
  }
</style>
