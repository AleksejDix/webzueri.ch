<template>
  <div class="p-12 owl" v-if="current">

    <dynamic-component @close="$emit('close')" :data="current" :settings="{
        path: 'post-get',
        type: $route.params.status
    }" />

    <div class="flex justify-end">
      <Button :to="{name: 'user-index-status-index-id-edit'}">edit</Button>
    </div>
  </div>
</template>

<script>

import DynamicComponent from "@/components/dynamic/"
export default {
  components: {DynamicComponent},
  computed: {
    current() {
      return this.$store.state.dashboard[this.$route.params.status].current
    }
  },
  fetch ({ store, params }) {
    return store.dispatch(`dashboard/${params.status}/get`, params.id)
  },
}
</script>

