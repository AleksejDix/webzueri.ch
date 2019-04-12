<template>
  <form @submit.prevent="handleSubmit" class="owl">
    <div class="owl">
      <input-image label="profile picture" hint @loaded="handleLoaded">
        <div slot="hint">
          Max. file size 2MB. Aspect ratio 1:1 are required. This image is
          required if you want to make any talk suggestion.
        </div>
      </input-image>
      <input-simple
        label="public name"
        v-model="form.displayName"
      ></input-simple>
      <div class="flex justify-end">
        <Button>save</Button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import InputToggle from "@/components/input/toggle";
import InputImage from "@/components/InputImage";

export default {
  components: { InputToggle, InputImage },
  props: ["data"],
  data() {
    return {
      form: {
        displayName: this.data.displayName,
        photoURL: this.data.photoURL
      }
    };
  },
  methods: {
    ...mapActions(["updateProfile", "userImageUpload"]),
    handleLoaded(file) {
      this.file = file;
    },
    async handleSubmit(e) {
      const uploadURL = await this.userImageUpload(this.file);

      const profile = {
        displayName:
          this.form.displayName || this.$store.state.user.displayName,
        photoURL: uploadURL || this.$store.state.user.photoURL
      };
      this.updateProfile(profile);
    }
  }
};
</script>
