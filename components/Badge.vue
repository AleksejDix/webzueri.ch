<template functional>
  <div :class="{
    'bg-green-dark' : props.color === 'green',
    'bg-red-dark' : props.color === 'red',
    'bg-pink-dark' : props.color === 'pink',
    'bg-blue-dark' : props.color === 'blue'
  }" class="leading-none inline-flex rounded-full text-9 uppercase tracking-wide font-bold text-white align-center p-1 items-center">
    <div class="px-2">
      <slot></slot>
    </div>
    <div v-if="props.number" class="bg-on-light-muted rounded-full h-4 w-4 flex justify-center items-center text-9">{{props.number}}</div>
  </div>
</template>
