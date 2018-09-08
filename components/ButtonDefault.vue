<template functional>
  <button @click="$emit('click')" class="min-w-32 no-underline leading-tight antialiased uppercase flex items-center justify-center text-center  py-4 px-6 text-gray md:flex-none hover:bg-gray font-semibold rounded text-sm tracking-wide">
    <slot></slot>
  </button>
</template>
