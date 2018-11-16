<template>
  <div>
    <div class="md:hidden">
      <Button @click="$emit('close')">close</Button>
    </div>
    <Prose class="owl">
      <Ratio width="16" height="9">
        <img class="absolute pin shadow-lg rounded-lg" :src="data.coverPhotoURL" alt="">
      </Ratio>

      <h1><a class="link" rel="noopener" target="_blank" :href="data.url">{{data.title}}</a></h1>
      <div>
        {{data.excerpt}}
      </div>
    </Prose>
  </div>

</template>

<script>
import Prose from '~/components/Prose'
export default {
  components: {Prose},
  props: ['data']
}
</script>
