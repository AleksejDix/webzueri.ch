<template>
  <div v-if="user" @click="open = true" class="relative chip m-2 inline-flex items-center rounded-full bg-surface h-8 p-1 pr-3 cursor-pointer focus:outline-none" tabindex="0">

    <img v-if="user.picture" class="w-6 h-6 rounded-full mr-2" :src="user.picture" :alt="user.name">

    <div v-else class="w-6 h-6 bg-grey-light rounded-full mr-2 flex items-center justify-center">
      <svg class="w-4 h-4" viewBox="-2 -3 30 30">
        <path fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
      </svg>
    </div>

    <nuxt-link to="/profile/" class="no-underline body-2 text-on-light-primary">
      {{user.name}}
    </nuxt-link>


    <transition name="menu" v-if="dropdown">
      <section v-show="open" name="dropdown" class="shadow absolute bg-yellow rounded-lg pin-r pin-t w-full" style="min-width: 300px">
        <div class="bg-indigo-darker px-3 py-4 rounded-lg flex">
          <div class="pr-4">
            <img class="rounded-full w-12 h-12 block" :src="user.picture" :alt="user.name">
          </div>
          <div class="leading-normal flex-1">
            <div class="text-on-dark-primary font-display weight-medium text-base leading-normal">{{user.name}}</div>
            <div class="body-2 text-on-dark-secondary">{{user.email}}</div>
          </div>
          <div class="flex items-center">
            <icon-button small @click.stop="open = false"></icon-button>
          </div>
        </div>
      </section>
    </transition>

  </div>
</template>

<script>
import IconButton from "~/components/icon-button"

export default {
  props: ['user', 'dropdown'],
  components: {
    IconButton
  },
  data () {
    return {
      open: false
    }
  }
}
</script>

<style>

</style>


