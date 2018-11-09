<template>
  <Prose class="owl">
    <img class="shadow-lg rounded-lg" :src="data.coverPhotoURL" alt="">
    <h1><a class="link" rel="noopener" target="_blank" :href="data.url">{{data.title}}</a></h1>
    <div>
      {{data.abstract}}
    </div>
  </Prose>
</template>

<script>
import Prose from '~/components/Prose'
export default {
  components: {Prose},
  props: ['data']
}
</script>
