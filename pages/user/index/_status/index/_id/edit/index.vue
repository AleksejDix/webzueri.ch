<template>
  <div class="p-12">
    <form @submit.prevent="handleUpdate" class="owl">
      <Input label="Title" placeholder="Short Title of your speech" v-model="form.title" />
      <Input-text label="Abstract" placeholder="Description of yout talk" v-model="form.abstract" limit="480" />
      <input-select v-if="$store.getters['dashboard/proposal/can'].update" label="Status" :options="['pending', 'approved', 'rejected']" :value="form.status" v-model="form.status"></input-select>
      <div class="flex justify-between owl-x">
        <Button type="button" danger="true" @click="handleDelete(current.id)">delete</Button>
        <Button type="submit">update</Button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        abstract: '',
        status: ''
      }
    }
  },
  computed: {
    current() {
      return this.$store.state.dashboard[this.$route.params.status].current
    }
  },
  fetch ({ store, params }) {
    return store.dispatch(`dashboard/${params.status}/get`, params.id)
  },
  methods: {
    async handleUpdate() {
      this.$store.dispatch(`dashboard/${this.$route.params.status}/update`, this.form)
    },
    async handleDelete(id) {
      try {
        this.$store.dispatch(`dashboard/${this.$route.params.status}/destroy`, this.$route.params.id)
        this.$router.push({
          name: "user-index-status-index",
          params: {
            status: this.$route.params.status
          }
        })
      } catch (error) {
        console.log('Deletion was not possible', error)
      }
    }
  },
  mounted() {
    this.form.title = this.current.title
    this.form.abstract = this.current.abstract
    this.form.status = this.current.status
  }
}
</script>

