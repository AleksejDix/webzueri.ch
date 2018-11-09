<template functional>
  <ul class="list-reset min-w-64 block overflow-y-auto" v-if="props.list.length > 0">
    <li v-for="item in props.list" :key="item.id">
      <slot :item="item"></slot>
    </li>
  </ul>
</template>
