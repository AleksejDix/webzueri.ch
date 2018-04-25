<template>
  <div v-editable="blok" class="page">
    <component
      :key="blok._uid"
      v-for="blok in blok.body"
      :blok="blok"
      :is="blok.component"></component>
  </div>
</template>

<script>
import Sponsors from "~/components/Sponsors"

export default {
  components: {
    Sponsors
  },
  props: ['blok']
}
</script>