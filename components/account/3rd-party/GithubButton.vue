<template>
  <button type="button" @click.prevent="GithubButton" v-text="label"></button>
</template>

<script>

export default {
  props: {
    label: {
      required: true
    }
  },
  methods: {
    GithubButton () {
      this.$store.dispatch('userGithubLogin')
    }
  }
}
</script>
