<template>
  <label class="min-w-36 block owl-xs" for="grid-first-name">
    <Overline v-if="label">{{label}}</Overline>
    <div v-if="hint" class="text-gray-500 pb-2 px-2 text-11">{{hint}}</div>
    <div
      class="flex relative w-full h-32 bg-grey-light tracking-wide no-underline leading-none inline-block font-semibold rounded text-sm"
    >
      <textarea
        v-bind="$attrs"
        :maxlength="limit"
        v-model="_value"
        class="focus:outline-none focus:shadow-focus focus:bg-white bg-transparent rounded absolute h-full inset-auto w-full px-4 py-3 text-12"
        :placeholder="placeholder"
      ></textarea>
      <div class="z-10 absolute top-0 right-0 p-2 uppercase" v-if="limit">{{+limit - charLimit}}</div>
    </div>
  </label>
</template>

<script>
export default {
  props: ['label', 'hint', 'placeholder', 'value', 'limit'],
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('input', newValue)
      }
    },
    charLimit() {
      if(!this._value) return 0
      return this._value.length
    }
  }
}
</script>
