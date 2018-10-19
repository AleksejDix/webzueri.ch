<template>
  <div class="bg-white">
    <EditAccountForm/>
    <button-default type="button" @click="$store.dispatch('userLogout')">Sign Out</button-default>
  </div>
</template>

<script>
import EditAccountForm from '~/components/account/EditAccountForm.vue'
import ButtonDefault from '~/components/button-default.vue'

export default {
  middleware: 'auth-check',
  components: { ButtonDefault, EditAccountForm },
}
</script>
