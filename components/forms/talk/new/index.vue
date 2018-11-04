<template>
  <form @submit.prevent="handleSubmit" class="owl">
    <Input label="Title" placeholder="Short Title of your speech" v-model="form.title" />
    <InputText label="Abstract" placeholder="Description of yout talk" v-model="form.abstract" limit="480" />
    <div class="flex justify-end">
      <Button>send</Button>
    </div>
  </form>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      form: {
        title: '',
        abstract: ''
      }
    }
  },
  methods: {
    ...mapActions('talks', ['submitTalk']),
    async handleSubmit() {
      try {
        const answer = await this.submitTalk(this.form);
        this.form.title = '',
        this.form.abstract = ''
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

