<template>
  <button type="button" @click.prevent="GoogleButton">{{label}}</button>
</template>

<script>
export default {
  props: {
    label: {
      required: true
    }
  },
  methods: {
    GoogleButton () {
      this.$store.dispatch('userGoogleLogin')
    }
  }
}
</script>
