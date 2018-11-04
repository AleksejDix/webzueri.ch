<template functional>
  <div :class="{
    'bg-green-dark' : props.color === 'green',
    'bg-red-dark' : props.color === 'red',
    'bg-pink-dark' : props.color === 'pink'
  }" class="leading-none inline-flex rounded-full text-9 uppercase tracking-wide font-bold text-white align-center p-1 px-2 items-center">
    <slot></slot>
  </div>
</template>
