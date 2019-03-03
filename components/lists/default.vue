<template>
  <ul v-if="list" class="list-reset bg-primary text-white">
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
