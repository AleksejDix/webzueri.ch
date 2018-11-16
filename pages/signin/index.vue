<template>

  <div class="w-full max-w-sm mx-auto">

    <section class=" md:rounded-lg bg-primary shadow-blue ">
      <header class="py-4 px-6 owl-lg">
        <h1 class="text-on-dark-primary text-14 font-display leading-tight text-center">Join</h1>
      </header>

      <div class="flex flex-col  owl">
        <div class="py-4 px-6">
          <Signin />
        </div>

        <div class="flex flex-col owl-sm py-6 px-6 rounded-b-lg">
          <Button type="button" @click.prevent="$store.dispatch('userGoogleLogin')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#google" /></svg>
            use google
          </Button>

          <Button type="button" @click.prevent="$store.dispatch('userGithubLogin')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#github" /></svg>
            use github
          </Button>

          <Button type="button" @click.prevent="$store.dispatch('userTwitterLogin')">
            <svg slot="start" class="w-6 h-6 p-1">
              <use xlink:href="#twitter" /></svg>
            use twitter
          </Button>
        </div>
      </div>

    </section>

  </div>

</template>

<script>
import Signin from "@/components/forms/user/signin"

export default {
  layout: 'tunnel',
  components: {Signin},
  head() {
    return {
      title: this.$store.state.page
    }
  },
}
</script>

