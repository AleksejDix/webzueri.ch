
<template>
  <Profile />
</template>

<script>
import Profile from '~/components/ui/Profile'

export default {
  middleware: ['auth-check', 'profile-default'],
  components: { Profile },
  created() {
    if (process.browser) {
      this.$store.dispatch('userTalks/sync')
    }
  }
}
</script>

