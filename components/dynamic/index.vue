<template>
  <div>
    <component @close="$emit('close')" @submit="(payload) => $emit('submit', payload)" :is=" component" :data="data" />
  </div>
</template>


<script>
const getComponent = (componentType, templateName) => {
  return {
    component: import(`@/components/dynamic/${componentType}/templates/${templateName}/`)
    .then(component => component)
    .catch(err => import(`@/components/dynamic/default/`))
  }
}
export default {
  props: {
    settings: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      default() {
        return {
          name: this.$route.params.status
        }
      }
    }
  },
  watch: {
    settings: {
      handler (val) {
        this.component = () => getComponent(val.path, val.type)
        this.$forceUpdate()
     },
     immediate: true,
     deep: true
    }
  }
}
</script>
