
<template>
  <Profile />
</template>

<script>
import Profile from '~/components/ui/Profile'

export default {
  middleware: ['auth-check', 'profile-default'],
  components: { Profile }
}
</script>

