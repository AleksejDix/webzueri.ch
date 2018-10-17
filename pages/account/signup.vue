<template>
  <SignupForm class="bg-grey" />
</template>

<script>
import SignupForm from '~/components/account/SignupForm.vue'
import { mapState } from 'vuex'

export default {
  middleware: 'anonymous',
  components: {
    SignupForm
  },
  watch: {
    // firebase is sometimes slow so we need to account for
    // the user getting authenticated late in the game...
    user (to, from) {
      this.$router.push('/account')
    }
  },
  computed: mapState([
    'user'
  ])
}
</script>
