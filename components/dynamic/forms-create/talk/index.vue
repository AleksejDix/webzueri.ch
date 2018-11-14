<template>
  <form class="owl pb-6" @submit.prevent="handleSubmit" v-bind="$attrs">
    <div class="flex-1 owl overflow-y-auto overflow-x-hidden">
      <Input-simple label="Title" placeholder="Short Title of your speech" v-model="form.title"/>
      <Input-text
        label="Description"
        limit="500"
        placeholder="Short Title of your speech"
        v-model="form.description"
      />
    </div>
    <div class="sticky pin-b">
      <div class="flex justify-end owl-x">
        <Button type="button" muted="true" @click="handleCreate">create draft</Button>
        <Button>submit for review</Button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        description: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$store.dispatch(`dashboard/${this.$route.params.status}-proposal/set`, this.form)
        this.$router.push({name: 'user-index-status-index'})
      } catch (error) {
        console.warn(error)
      }
    },
    async handleCreate() {
      try {
        await this.$store.dispatch(`dashboard/${this.$route.params.status}-draft/set`, this.form)
        this.$router.push({name: 'user-index-status-index'})
      } catch (error) {
        console.warn(error)
      }
    }
  }
}
</script>

