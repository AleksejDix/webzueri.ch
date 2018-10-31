<template>
  <form class="p-8 w-full owl" @submit.prevent="register">
    <Input v-model="form.name" label="name" type="text" />
    <Input v-model="form.email" label="email" type="email" />
    <Input v-model="form.password" label="password" type="password" />
    <div v-if="error" class="border-2 border-red-light rounded p-4 text-red-light bg-red-lightest font-bold text-sm">
      {{error}}
    </div>
    <div class="flex owl-x justify-end">
      <Button primary type="submit">Sign Up</Button>
    </div>
  </form>
</template>

<script>
export default {
  data: () => ({
    form : {
      name: '',
      email: '',
      password: '',
    },
    error: '',
  }),
  methods: {
    async register() {
      this.error = await this.$store.dispatch('createUser', form)
    }
  }
}
</script>

