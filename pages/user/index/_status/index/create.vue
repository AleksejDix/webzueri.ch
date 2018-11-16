<template>
  <modal-window @close="$router.go(-1)">
    <div slot="title">{{$route.params.status}}</div>
    <dynamic-component
      class="flex flex-col flex-1"
      :settings="{
          path: 'forms-create',
          type: $route.params.status
        }"
    />
  </modal-window>
</template>

<script>
import ModalWindow from '@/components/ModalWindow'
import DynamicComponent from "@/components/dynamic/"
export default {
  components: {DynamicComponent, ModalWindow}
}
</script>
