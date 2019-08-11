<template>
  <label class="min-w-36 block owl-xs" for="grid-first-name">
    <Overline v-if="label">{{label}}</Overline>
    <div class="">{{hint}}</div>
    <div
      class="flex relative w-full h-10 bg-grey-light tracking-wide no-underline leading-none inline-block font-semibold rounded text-sm"
    >
      <input
        v-bind="$attrs"
        v-model="_value"
        :autocomplete="type"
        class="focus:outline-none focus:shadow-focus focus:bg-white bg-transparent rounded absolute h-full inset-auto w-full px-4 py-3 text-12"
        :type="!isVisible && type === 'password' ? 'password' : 'text'"
      >
      <Button
        size="small"
        v-if="type === 'password'"
        class="absolute right-0 inset-auto-y m-1"
        type="button"
        @click="isVisible = !isVisible"
      >{{isVisible ? 'hide' : 'show' }}</Button>
    </div>
  </label>
</template>

<script>
export default {
  props: ['label', 'hint', 'type', 'value'],
  data: () => ({
    isVisible: false
  }),
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style>
</style>
