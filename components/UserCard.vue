<template functional>
  <article class="flex items-center">
    <div class="flex-no-shrink w-12 h-12 mr-4" :class="[props.big ? 'w-16 h-16' : 'w-12 h-12']">
      <img class="rounded-full w-full shadow-lg" :src="props.photo" :alt="props.name">
    </div>
    <div class="flex-1">
      <h3 class="leading-none text-current-color" :class="[props.big ? 'text-16' : 'text-12']">{{props.name}}</h3>
      <aside class="text-current-color leading-normal text-11">{{ props.meta }}</aside>
    </div>
  </article>
</template>
