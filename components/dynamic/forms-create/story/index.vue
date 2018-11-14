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
      <file-pond
        name="photoURL"
        :instantUpload="false"
        ref="pond"
        accepted-file-types="image/jpeg, image/png"
        @init="handleFilePondInit"
        @addfile="handleAdd"
      />
    </div>
    <div class="flex justify-end">
      <Button :disabled="loading">send</Button>
    </div>
  </form>
</template>

<script>
import vueFilePond from 'vue-filepond';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);
import { mapActions } from 'vuex'

export default {
  compoennts: {FilePond},
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

    handleFilePondInit(e) {
      this.$refs.pond.getFile();
    }
  }
}
</script>

