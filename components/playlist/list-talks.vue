<template>
  <ul class="list-reset">
    <li
      v-for="(talk, index) in list"
      :key="talk.id"
      :class="{ 'bg-primary-dark': active === index }"
      class="p-4 border-b border-white cursor-pointer text-gray-700 hover:bg-purple-100"
      @click="$emit('click', { index, talk })"
    >
      <slot :talk="talk" />
    </li>
  </ul>
</template>

<script>
export default {
  props: ["list", "active"]
};
</script>
