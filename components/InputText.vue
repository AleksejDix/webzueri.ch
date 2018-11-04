<template>
  <label class="min-w-36 block" for="grid-first-name">
    <div class="pl-1 pb-1 text-on-light-secondary text-10 tracking-wide font-medium" v-if="label">{{label}}</div>
    <div class="text-on-light-secondary pb-2 px-2 text-11">{{hint}}</div>
    <div class="shadow-inner flex relative w-full h-32 bg-grey-light tracking-wide no-underline leading-none inline-block font-semibold rounded text-sm">
      <textarea :maxlength="limit" v-model="_value" class="focus:outline-none focus:shadow-focus bg-transparent rounded absolute h-full pin w-full px-4 py-3 text-12" :placeholder="placeholder"></textarea>
      <div class="z-10 absolute pin-t pin-r p-2 uppercase" v-if="limit">
        {{+limit - charLimit}}
      </div>
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
      return this._value.length
    }
  }
}
</script>

