<template functional>
  <div
    :class="{
    'bg-green-lightest' : props.color === 'green',
    'bg-red-lightest' : props.color === 'red',
    'bg-pink-lightest' : props.color === 'pink',
    'bg-blue-lightest' : props.color === 'blue',
    'bg-orange-lightest' : props.color === 'orange',
    'bg-violet-lightest' : props.color === 'violet',
    'bg-yellow-lightest' : props.color === 'yellow',
    'bg-fuchsia-lightest' : props.color === 'fuchsia'
  }"
    class="leading-none inline-flex rounded-full text-9 uppercase tracking-wide font-bold text-white align-center p-1 items-center"
  >
    <div
      class="px-2"
      :class="{
      'text-green-dark' : props.color === 'green',
      'text-red-dark' : props.color === 'red',
      'text-pink-dark' : props.color === 'pink',
      'text-blue-dark' : props.color === 'blue',
      'text-orange-dark' : props.color === 'orange',
      'text-yellow-dark' : props.color === 'yellow',
      'text-violet-dark' : props.color === 'violet',
      'text-fuchsia-dark' : props.color === 'fuchsia',
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
      class="text-on-dark-primary rounded-full h-4 w-4 flex justify-center items-center text-9"
    >{{props.number}}</div>
  </div>
</template>
