<template functional>
  <div
    :class="{
    'border-green' : props.color === 'green',
    'border-red' : props.color === 'red',
    'border-pink' : props.color === 'pink',
    'border-blue' : props.color === 'blue',
    'border-orange' : props.color === 'orange',
    'border-violet' : props.color === 'violet',
    'border-yellow' : props.color === 'yellow',
    'border-fuchsia' : props.color === 'fuchsia'
  }"
    class="border leading-none inline-flex rounded-full text-xs uppercase tracking-wide font-book text-white align-center p-1 items-center"
  >
    <div
      class="px-2"
      :class="{
      'text-green' : props.color === 'green',
      'text-red' : props.color === 'red',
      'text-pink' : props.color === 'pink',
      'text-blue' : props.color === 'blue',
      'text-orange' : props.color === 'orange',
      'text-yellow' : props.color === 'yellow',
      'text-violet' : props.color === 'violet',
      'text-fuchsia' : props.color === 'fuchsia',
    }"
    >
      <slot></slot>
    </div>
    <div
      v-if="props.number"
      :class="{
      'bg-green-dark' : props.color === 'green',
      'bg-red-dark' : props.color === 'red',
      'bg-pink-dark' : props.color === 'pink',
      'bg-blue-dark' : props.color === 'blue',
      'bg-orange-dark' : props.color === 'orange',
      'bg-yellow-dark' : props.color === 'yellow',
      'bg-violet-dark' : props.color === 'violet',
      'bg-fuchsia-dark' : props.color === 'fuchsia',
    }"
      class="text-on-dark-primary rounded-full h-4 w-4 flex justify-center items-center text-xs"
    >{{props.number}}</div>
  </div>
</template>
