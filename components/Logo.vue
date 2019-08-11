<template>
  <nuxt-link :to="{name: 'index'}" class="flex items-center flex-shrink-0 mr-6 no-underline">
    <div class="bg-blue-dark rounded-full w-12 mr-4 h-12 p-2 flex items-center justify-center">
      <svg class="w-6 h-6 fill-white">
        <use xlink:href="#keyboard" />
      </svg>
    </div>
    <span class="font-bold text-current-color text-base tracking-wide font-display uppercase">Web Zürich</span>
  </nuxt-link>
</template>

<script>
export default {

}
</script>
