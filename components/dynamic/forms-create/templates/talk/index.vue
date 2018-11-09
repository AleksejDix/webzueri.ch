<template>
  <form @submit.prevent="$emit('submit', form)" class="owl">
    <Input label="Title" placeholder="Short Title of your speech" v-model="form.title" />
    <InputText label="Abstract" placeholder="Description of yout talk" v-model="form.abstract" limit="480" />
    <div class="flex justify-end">
      <Button>send</Button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        abstract: ''
      }
    }
  }
}
</script>

