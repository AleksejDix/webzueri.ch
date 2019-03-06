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
  data() {
    return {
      component: null
    }
  },
  watch: {
    settings: {
      handler (val) {
        this.component = () => getComponent(val.path, val.type)
     },
     immediate: true,
     deep: true
    }
  }
}
</script>
