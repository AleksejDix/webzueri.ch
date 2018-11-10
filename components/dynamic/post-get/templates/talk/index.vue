<template>
  <div>
    <div class="md:hidden">
      <Button @click="$emit('close')">close</Button>
    </div>
    <Prose class="owl">
      <h1><a class="link" rel="noopener" target="_blank" :href="data.url">{{data.title}}</a></h1>
      <div>
        {{data.abstract}}
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
