<template>
<div class="bg-yellow p-6">
  <nav class="max-w-3xl mx-auto flex items-center justify-between flex-wrap px-2">

    <nuxt-link to="/" class="flex items-center flex-no-shrink mr-6 no-underline">
      <svg class="w-6 mr-4 h-6 fill-black">
        <use xlink:href="#keyboard" />
      </svg>
      <span class="font-bold text-black text-base tracking-wide font-display uppercase">Web Zürich</span>
    </nuxt-link>

    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-teal-lighter">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>

    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <nuxt-link to="/" class="font-semibold no-underline block mt-4 lg:inline-block lg:mt-0 text-white mr-4">
          Talks
        </nuxt-link>
        <nuxt-link to="/" class="font-semibold no-underline block mt-4 lg:inline-block lg:mt-0 text-white mr-4">
          Become a Sponsor
        </nuxt-link>
        <nuxt-link to="/" class="font-semibold no-underline block mt-4 lg:inline-block lg:mt-0 text-white">
          Team
        </nuxt-link>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
export default {

}
</script>

