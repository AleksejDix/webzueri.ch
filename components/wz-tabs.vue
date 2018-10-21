<template>
  <div ref="tabs" class="overflow-hidden">
      <div :style="indicator" class="absolute bg-red h-16 w-16 transition z-index"></div>
      <ul class="list-reset flex">
        <wz-tab v-for="(item,index) of ['2019-09-09', '2019-09-10']" :key="index" @hover="handleTabHover">
          <nuxt-link :to="`/schedule/${item}`">{{item}}</nuxt-link>
        </wz-tab>
      </ul>
    <pre> {{indicator}}</pre>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {
      tab: {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0
      },
      tabs: {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0
      },
      show: true
    }
  },
  computed: {
    indicator () {
      return {
        width: this.tab.width + 'px',
        height: this.tab.height + 'px',
        transform: `translate(${this.tab.left - this.tabs.left}px, calc(100% + ${this.tab.top - this.tabs.top}px))`,
      }
    }
  },
  methods: {
    handleTabHover(payload) {
      this.tab = payload.element.getBoundingClientRect();
      this.tabs =  this.$refs.tabs.getBoundingClientRect();
      this.show = payload.show
    }
  },
  mounted () {
    this.tabs = this.$el.getBoundingClientRect()
  }
}
</script>

