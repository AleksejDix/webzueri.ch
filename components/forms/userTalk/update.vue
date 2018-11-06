<template>
  <form @submit.prevent="handleSubmit" class="owl">
    <Input label="Title" placeholder="Short Title of your speech" v-model="title" />
    <InputText label="Abstract" placeholder="Description of yout talk" v-model="abstract" limit="480" />
    <div class="flex justify-between owl-x">
      <Button type="button" danger="true" @click="handleDelete(talk.id)">delete</Button>
      <Button>update</Button>
    </div>
  </form>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  computed: {
    title: {
      get() {
        return this.$store.state.userTalks.current.title
      },
      set(value) {
        this.$store.commit('userTalks/updateTitle', value)
      }
    },
    abstract: {
      get() {
        return this.$store.state.userTalks.current.abstract
      },
      set(value) {
        this.$store.commit('userTalks/updateAbstract', value)
      }
    }
  },
  methods: {
    ...mapActions('userTalks', ['update']),
    async handleSubmit() {

      const answer = await this.update();
    }
  }
}
</script>
