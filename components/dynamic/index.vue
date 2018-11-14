<template>
  <component v-bind="$attrs" :is="component" :data="data"/>
</template>

<script>
const getComponent = (componentType, templateName) => {
  return {
    component: import(`@/components/dynamic/${componentType}/${templateName}/`)
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
