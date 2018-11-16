<template>
  <div class="min-w-36 block owl-xs" for="grid-first-name">
    <Overline>{{label}}</Overline>
    <div v-if="$slots['hint']" class="leading-normal text-on-light-secondary">
      <slot name="hint"></slot>
    </div>
    <div
      :class="[error ? 'bg-red-lightest' : 'bg-grey-light']"
      class="flex items-center justify-center relative cursor-pointer text-black shadow-inner rounded-lg min-h-32"
    >
      <div class="p-4 w-full">
        <transition name="fade">
          <div
            class="text-red-dark text-center"
            v-if="error"
          >{{error}}, Drag your new image here or click to browse</div>
          <div v-else-if="image" class="flex">
            <div class="flex-no-shrink">
              <img class="rounded-lg shadow-md w-32" :src="image" alt="Profile Avatar Image">
            </div>
            <div class="pl-4 flex-1 overflow-hidde owl-sm">
              <div class="flex justify-between">
                <b class="w-1/3">size:</b>
                <div class="w-2/3">
                  <span
                    class="rounded-full mr-2 bg-green w-5 h-5 inline-flex justify-center items-center"
                  >
                    <svg
                      class="transition fill-green-lightest group-hover:fill-green-lightest h-3 w-3"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
                    </svg>
                  </span>
                  {{(size / 1024).toFixed(0) }}kb
                </div>
              </div>
              <div class="flex justify-between">
                <b class="w-1/3">height:</b>
                <div class="w-2/3">
                  <span
                    class="rounded-full mr-2 bg-green w-5 h-5 inline-flex justify-center items-center"
                  >
                    <svg
                      class="transition fill-green-lightest group-hover:fill-green-lightest h-3 w-3"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
                    </svg>
                  </span>
                  {{height}}px
                </div>
              </div>
              <div class="flex justify-between">
                <b class="w-1/3">width:</b>
                <div class="w-2/3">
                  <span
                    class="rounded-full mr-2 bg-green w-5 h-5 inline-flex justify-center items-center"
                  >
                    <svg
                      class="transition fill-green-lightest group-hover:fill-green-lightest h-3 w-3"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
                    </svg>
                  </span>
                  {{width}}px
                </div>
              </div>
            </div>
          </div>
        </transition>
        <div
          class="px-4 text-center"
          v-if="!image && !error"
        >Drag your image here or click to browse</div>
      </div>
      <input
        @change="handleChange"
        accept="image/*"
        class="absolute pin opacity-0 cursor-pointer focus:outline-none focus:shadow-focus focus:bg-white rounded-lg"
        name="avatar"
        type="file"
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: undefined,
      image: '',
      size: 0,
      height: 0,
      width: 0,
    }
  },
  props: {
    label: {
      type: String,
      default: 'new image'
    },
    hint: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 2097152 // 2MB in bytes
    }
  },
  methods: {
    async handleChange(event) {
      try {
        this.error = ''
        const file = event.target.files[0]

        const readFile = (file) => {
          let reader = new FileReader()

          return new Promise((resolve, reject) => {
            reader.onload = (event) => {
              file.data = event.target.result
              this.size = file.size

              const img = new Image;
              img.src = event.target.result
              img.onload = () => {
                this.width = img.width
                this.height = img.height

                if (img.height / img.width !== 1) return reject(`your image has wrong proportions 1:${(img.width/img.height).toFixed(2)}`)
                if (file.size > this.limit)  return reject(`your image is to big with ${file.size / 1024}kb`)
                resolve(file)
              }
            }

            reader.onerror = () => {
              return reject(this)
            }

            if (/^image/.test(file.type)) {
              reader.readAsDataURL(file);
            } else {
              reader.readAsText(file);
            }

          })
        }

        const loadedFile = await readFile(file);


        this.image = loadedFile.data
        this.$emit('loaded', loadedFile)

      } catch (error) {

        this.error = error
      }

    }
  }
}
</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
