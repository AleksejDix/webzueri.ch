<template>
  <ul class="list-reset">
    <li
      v-for="(talk, index) in list"
      :key="talk.id"
      @click="$emit('click', {index, talk})"
      :class="{ 'bg-primary-dark': active === index }"
      class="p-4 border-b border-primary-light cursor-pointer text-on-dark-secondary hover:text-white hover:bg-primary-dark"
    >
      <slot :talk="talk"/>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['list', 'active'],
}
</script>
