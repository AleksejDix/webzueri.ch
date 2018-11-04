
<template>
  <Profile />
</template>

<script>
import Profile from '~/components/ui/Profile'

export default {
  middleware: ['auth-check', 'profile-default'],
  components: { Profile },
  scrollToTop: true,
  created() {
    if (process.browser) {
      this.$store.dispatch('talks/realTimeListener')
    }
  }
}
</script>

