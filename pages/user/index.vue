<template>
  <nuxt-child/>
</template>

<script>
export default {
  middleware: ['auth-check', 'profile-default'],
  layout: 'dashboard'
}
</script>
