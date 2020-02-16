<template>
  <nuxt-link
    :to="{ name: 'index' }"
    class="flex items-center flex-shrink-0 mr-6 no-underline py-2"
  >
    <div
      class="bg-purple-700 py-2 rounded-full w-12 mr-4 h-12 p-2 flex items-center justify-center text-white"
    >
      <svg class="w-6 h-6 text-white">
        <use xlink:href="#keyboard" />
      </svg>
    </div>
    <span class="font-bold text-base font-display tracking leading-none"
      >Web Zurich</span
    >
  </nuxt-link>
</template>
