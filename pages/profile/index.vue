<template>
  <div class="bg-white">
    <EditAccountForm/>
    <wz-button type="button" @click="$store.dispatch('userLogout')">Sign Out</wz-button>
  </div>
</template>

<script>
import EditAccountForm from '~/components/account/EditAccountForm.vue'

export default {
  middleware: 'auth-check',
  components: {EditAccountForm },
}
</script>
