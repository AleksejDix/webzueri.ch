<template>
<div class="bg-green-lighter">
  <nav class="max-w-5xl mx-auto flex items-center justify-between flex-wrap py-6 px-4">

    <nuxt-link to="/" class="flex items-center flex-no-shrink mr-6 no-underline">
      <div class="bg-green-lightest rounded-full w-12 mr-4 h-12 p-2 flex items-center justify-center">
        <svg class="w-6 h-6 fill-teal-dark">
          <use xlink:href="#keyboard" />
        </svg>
      </div>
      <span class="font-bold text-black text-base tracking-wide font-display uppercase">Web Züri</span>
    </nuxt-link>

    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 rounded " @click="showNav = !showNav">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>

    <div class="w-full lg:flex lg:items-center lg:w-auto ml-auto pt-4 md:pt-0" v-show="showNav">
      <div class="text-base lg:flex-grow">
        <nuxt-link to="/code-of-conduct" class="font-semibold no-underline block lg:inline-block text-indigo-darkest py-4 px-6 hover:bg-white rounded-full">
          code of conduct
        </nuxt-link>
      </div>
      <div class="text-base lg:flex-grow">
        <nuxt-link to="/talks" class="font-semibold no-underline block lg:inline-block text-indigo-darkest py-4 px-6 hover:bg-white rounded-full">
          talks
        </nuxt-link>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
export default {
  data() {
    return {
      showNav: true
    }
  }
}
</script>


