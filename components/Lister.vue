<template>
  <ul class="list-reset min-w-64 block overflow-y-auto owl-sm" v-if="list.length > 0">
    <li v-for="item in list" :key="item.id">
      <slot :item="item"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['list']
}
</script>

