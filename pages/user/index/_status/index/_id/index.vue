<template>
  <modal-window @close="$router.go(-1)">
    <div slot="title">{{$route.params.status | capitalize }}</div>
    <div class="flex-1 px-8 owl overflow-scroll" v-if="current">
      <dynamic-component
        :data="current"
        :settings="{
        path: 'post-get',
        type: $route.params.status
    }"
      />
    </div>
  </modal-window>
</template>

<script>

import DynamicComponent from "@/components/dynamic/"

import ModalWindow from '@/components/ModalWindow'
export default {
  components: {DynamicComponent, IconClose, ModalWindow},
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

