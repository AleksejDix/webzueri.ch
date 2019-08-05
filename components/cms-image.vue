<template>
  <img
    loading="auto"
    :class="[responsive ? 'max-w-full w-full' : '']"
    :src="srcPath"
    :width="width"
    :height="height"
    :alt="alt"
  >
</template>

<script>
const base = 'https://media.graphcms.com/';

export default {
  data () {
    return {
      resize: {
        ...this.fit && { fit: this.fit },
        ...this.height && { height: this.height },
        ...this.width && { width: this.width },
        ...this.align && { align: this.align }
      }
    }
  },
  computed: {
    srcPath () {
      const transormator = JSON.stringify(this.resize).replace(/\"|\{|\}/g, "")
      return `${base}${`crop_faces=b:162/output=quality:85/resize=` + transormator}/${this.src}`
    }
  },
  props: {
    align: String,
    fit: String,
    width: [String, Number],
    height: [String, Number],
    src: {
      type: String,
      required: true
    },
    responsive: {
      type: Boolean,
      default: false
    },
    alt: {
      type: String,
      required: true
    }
  }

}
</script>
