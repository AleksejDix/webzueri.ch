<template>
  <form @submit.prevent="$store.dispatch('userRegister', { email, password })">
    {{email}} {{password}}
    <input type="email" v-model="email">
    <input type="password" v-model="password">
    <nuxt-link to="/login">I already have an account</nuxt-link>
    <button type="submit" >Sign Up</button>
  </form>
</template>

<script>
  export default {
    data: () => ({
      email: '',
      password: ''
    })
  }
</script>
