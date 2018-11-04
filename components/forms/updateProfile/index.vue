<template>
  <form @submit.prevent="handleSubmit" class="owl">

    <div>
      <div class="pl-1 pb-1 text-on-light-secondary text-10 tracking-wide font-medium">new picture</div>

      <file-pond name="photoURL" :instantUpload="false" ref="pond" accepted-file-types="image/jpeg, image/png" @init="handleFilePondInit" @addfile="handleAdd" />
    </div>

    <Input label="new name" hint="However you want to be announced" v-model.lazy="name" />

    <div class="flex justify-end">
      <Button>save</Button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import vueFilePond from 'vue-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);


export default {
  components: { FilePond },
  data: () => ({
    form: {
      displayName: null,
      photoURL: null
    }
  }),
  computed: {
    name: {
      get () { return this.$store.state.user.displayName},
      set (value) { this.form.displayName = value }
    },
    photo () {
      return this.$store.state.user.photoURL
    }
  },
  methods: {
    ...mapActions(['updateProfile', 'userImageUpload']),
    handleSubmit(e) {
      const profile = {
        displayName: this.form.displayName || this.$store.state.user.displayName,
        photoURL: this.form.photoURL || this.$store.state.user.photoURL
      }
      this.updateProfile(profile)
    },

    async handleAdd(error, file) {
      try {
        this.form.photoURL = await this.userImageUpload(file.file)
      } catch (error) {
        console.log(error)
      }
    },

    handleFilePondInit(e) {
      this.$refs.pond.getFile();
    },
  }
}
</script>


<style>
  .filepond--panel-root,
  .filepond--wrapper {
    @apply bg-grey-light rounded;
  }
</style>
