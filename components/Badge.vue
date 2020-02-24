<template>
  <div
    v-bind="$attrs"
    :class="{
      'border-black bg-grey-100': color === 'black',
      'border-green-700 bg-green-100': color === 'green',
      'border-red-700 bg-red-100': color === 'red',
      'border-pink-700 bg-pink-100': color === 'pink',
      'border-blue-700 bg-blue-100': color === 'blue',
      'border-orange-700 bg-orange-100': color === 'orange',
      'border-purple-700 bg-purple-100': color === 'purple',
      'border-yellow-700 bg-yellow-100': color === 'yellow',
      'border-indigo-700 bg-indigo-100': color === 'indigo'
    }"
    class="leading-none border inline-flex rounded-full text-xs uppercase tracking-wide font-bold  align-center p-1 items-center whitespace-no-wrap"
    v-on="$listeners"
  >
    <div
      class="px-2"
      :class="{
        'text-black': color === 'black',
        'text-green-700': color === 'green',
        'text-red-700': color === 'red',
        'text-pink-700': color === 'pink',
        'text-blue-700': color === 'blue',
        'text-orange-700': color === 'orange',
        'text-yellow-700': color === 'yellow',
        'text-purple-700': color === 'purple',
        'text-indigo-700': color === 'indigo'
      }"
    >
      <slot></slot>
    </div>
    <div
      v-if="number"
      :class="{
        'bg-black': color === 'black',
        'bg-green-700': color === 'green',
        'bg-red-700': color === 'red',
        'bg-pink-700': color === 'pink',
        'bg-blue-700': color === 'blue',
        'bg-orange-700': color === 'orange',
        'bg-yellow-700': color === 'yellow',
        'bg-purple-700': color === 'purple',
        'bg-indigo-700': color === 'indigo'
      }"
      class="text-gray-700 rounded-full h-4 w-4 flex justify-center items-center text-xs"
    >
      {{ number }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: ""
    },
    number: {
      type: Boolean,
      default: false
    }
  }
};
</script>
