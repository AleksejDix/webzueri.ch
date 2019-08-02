<template>
  <iframe
    loading="lazy"
    class="w-full h-full"
    type="text/html"
    allowfullscreen="allowfullscreen"
    :src="video"
    frameborder="0"
  />
</template>

<script>
export default {
  props: ['video']
}
</script>
