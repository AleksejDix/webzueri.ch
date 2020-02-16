<template functional>
  <div
    :class="{
      'border-green-700 bg-green-100': props.color === 'green',
      'border-red-700 bg-red-100': props.color === 'red',
      'border-pink-700 bg-pink-100': props.color === 'pink',
      'border-blue-700 bg-blue-100': props.color === 'blue',
      'border-orange-700 bg-orange-100': props.color === 'orange',
      'border-purple-700 bg-purple-100': props.color === 'purple',
      'border-yellow-700 bg-yellow-100': props.color === 'yellow',
      'border-indigo-700 bg-indigo-100': props.color === 'indigo'
    }"
    class="leading-none border inline-flex rounded-full text-xs uppercase tracking-wide font-bold  align-center p-1 items-center whitespace-no-wrap"
  >
    <div
      class="px-2"
      :class="{
        'text-green-700': props.color === 'green',
        'text-red-700': props.color === 'red',
        'text-pink-700': props.color === 'pink',
        'text-blue-700': props.color === 'blue',
        'text-orange-700': props.color === 'orange',
        'text-yellow-700': props.color === 'yellow',
        'text-purple-700': props.color === 'purple',
        'text-indigo-700': props.color === 'indigo'
      }"
    >
      <slot></slot>
    </div>
    <div
      v-if="props.number"
      :class="{
        'bg-green-700': props.color === 'green',
        'bg-red-700': props.color === 'red',
        'bg-pink-700': props.color === 'pink',
        'bg-blue-700': props.color === 'blue',
        'bg-orange-700': props.color === 'orange',
        'bg-yellow-700': props.color === 'yellow',
        'bg-purple-700': props.color === 'purple',
        'bg-indigo-700': props.color === 'indigo'
      }"
      class="text-gray-700 rounded-full h-4 w-4 flex justify-center items-center text-xs"
    >
      {{ props.number }}
    </div>
  </div>
</template>
