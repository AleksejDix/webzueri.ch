<template>
  <article v-editable="speaker" class="flex rounded shadow-md bg-white p-4 overflow-hidden items-center relative">
    <img :src="speaker.image" :alt="fullname" class="rounded rounded-full w-32 h-32 block -ml-8">
    <div class="flex-1 pl-6">
      <h2 class="text-grey-darkest text-sm uppercase">{{ fullname }}</h2>
      <!-- <div class="py-1">
        <a class="no-underline" v-if="speaker.github" :href="`https://github.com/${speaker.github}`">🖥️</a>
        <a class="no-underline" v-if="speaker.twitter" :href="`https://twitter.com//${speaker.twitter}`">🐥</a>
        <a class="no-underline" v-if="speaker.website" :href="`${speaker.website.url}`">🔗</a>
      </div> -->
      <p class="leading-tight text-3xl py-1 text-blue-dark font-light">Neos - an introduction</p>
    </div>
  </article>
</template>

<script>
export default {
  props: ["speaker"],
  computed: {
    fullname() {
      return this.speaker.firstname + ' ' + this.speaker.lastname;
    }
  }
}
</script>

