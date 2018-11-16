<template>
  <div ref="tabs" class="overflow-hidden -m-2 -p-4">
      <div :style="indicator" class="absolute  h-16 w-16 bounce  z-index py-4">
        <div class=" border-secondary border-4 rounded-full p-4 -mx-2">

        </div>
      </div>
      <ul class="list-reset flex relative z-40 ">
        <wz-tab v-for="(item,index) of ['2019-09-09', '2019-09-10']" :key="index" @hover="handleTabHover">
          <nuxt-link class="text-secondary"  :to="`/schedule/${item}`">{{item}}</nuxt-link>
        </wz-tab>
      </ul>
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
        transform: `translate(
          ${this.tab.left - this.tabs.left}px,
          calc(-50% + ${this.tab.top - this.tabs.top}px))`,
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


<style>
  .bounce {
    transition: 1000ms all cubic-bezier(.17,.67,.34,1.28);
  }
</style>


