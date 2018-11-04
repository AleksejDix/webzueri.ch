<template>
  <label class="min-w-36 block" for="grid-first-name">
    <div class="pl-1 pb-1 text-on-light-secondary text-10 tracking-wide font-medium" v-if="label">{{label}}</div>
    <div class="">{{hint}}</div>
    <div class="flex relative w-full h-10 bg-grey-light tracking-wide no-underline leading-none inline-block font-semibold rounded text-sm">
      <input v-model="_value" :autocomplete="type" class="focus:outline-none focus:shadow-focus bg-transparent rounded absolute h-full pin w-full px-4 py-3 text-12" :type="!isVisible && type === 'password' ? 'password' : 'text'" :placeholder="placeholder">
      <Button size="small" v-if="type === 'password'" class="absolute pin-r pin-y m-1 bg-grey-light hover:bg-grey px-3 rounded text-on-light-secondary hover:text-on-light-primary" type="button" @click="isVisible = !isVisible">{{isVisible ? 'hide' : 'show' }}</Button>
    </div>
  </label>
</template>

<script>
export default {
  props: ['label', 'hint', 'placeholder', 'type', 'value'],
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


