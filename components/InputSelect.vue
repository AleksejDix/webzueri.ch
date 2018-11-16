<template>
  <label class="min-w-36 block owl-xs" for="grid-first-name">
    <Overline v-if="label">{{label}}</Overline>
    <div class="">{{hint}}</div>
    <div
      class="flex relative w-full h-10 bg-grey-light tracking-wide no-underline leading-none inline-block font-semibold rounded text-sm"
    >
      <select
        v-bind="$attrs"
        class="focus:outline-none focus:shadow-focus appearance-none rounded focus:bg-white w-full bg-transparent px-4 py-3 text-12 absolute h-full pin w-full leading-none"
        v-model="selected"
      >
        <option v-for="option in options" :key="option" :value="option" v-text="option"/>
        <option v-if="disabledOption" disabled value="" v-text="disabledOption"/>
      </select>
    </div>
  </label>
</template>

<script>
export default {
  model: {
    // By default, `v-model` reacts to the `input`
    // event for updating the value, we change this
    // to `change` for similar behavior as the
    // native `<select>` element.
    event: 'change',
  },
  props: {
    // The disabled option is necessary because
    // otherwise it isn't possible to select the
    // first item on iOS devices. This prop can
    // be used to configure the text for the
    // disabled option.
    label: {
      type: String
    },
    hint: {
      type: String
    },
    disabledOption: {
      type: [String, Boolean],
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    selected: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value);
      }
    }
  }
};
</script>
