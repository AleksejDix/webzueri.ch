<template >
  <div class="w-3/5 max-w-sm mx-auto py-8">
    <dynamic-component :settings="{
      path: 'empty-states',
      type: $route.params.status
    }" />
  </div>
</template>

<script>
import DynamicComponent from "@/components/dynamic/"
export default {
  components: {DynamicComponent}
}
</script>

