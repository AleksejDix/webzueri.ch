<template>
  <div v-editable="blok">
    <pre>
      {{ blok }}
    </pre>
  </div>
</template>

<script>
export default {
  props: ['blok']
}
</script>