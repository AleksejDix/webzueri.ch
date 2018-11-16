<template>
  <form @submit.prevent="$emit('submit', form)" class="owl">
    <Input-simple
      label="URL of the Blogpost you wrote"
      placeholder="https://yoururl.com"
      v-model="form.url"
    />
    <Input-simple
      label="Blogpost Title"
      placeholder="Short Title of your speech"
      v-model="form.title"
    />
    <InputText
      label="Blogpost Excerpt"
      placeholder="Description of yout talk"
      v-model="form.excerpt"
      limit="480"
    />
    <div>
      <div
        class="pl-1 pb-1 text-on-light-secondary text-10 tracking-wide font-medium"
      >Cover Image, Ratio 16:9, max 2mb</div>
    </div>
    <div class="flex justify-end">
      <Button :disabled="loading">send</Button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      form: {
        title: '',
        url: '',
        excerpt: '',
        coverPhotoURL: ''
      }
    }
  },
  methods: {
    async handleAdd(error, file) {
      try {
        this.loading = true
        this.form.coverPhotoURL = await this.$store.dispatch(`dashboard/${this.$route.params.status}-image/set`, file.file)
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

