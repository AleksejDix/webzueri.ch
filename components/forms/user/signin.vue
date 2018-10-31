<template>
  <form class="p-8 w-full owl" @submit.prevent="signIn">
    <Input v-model="form.email" label="email" type="email" placeholder="user@conf.couch" />
    <Input v-model="form.password" label="password" type="password" />

    <div class="flex justify-end owl-x">
      <Button type="submit">Sign in</Button>
    </div>

  </form>
</template>

<script>
export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  methods: {
    signIn() {
      this.$store.dispatch('signIn', this.form)
    }
  }
}
</script>
