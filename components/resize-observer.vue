
<script>
// import elementResizeDetectorMaker from "element-resize-detector";


export default {
  data() {
    return {
      width: 0,
      height: 0
    }
  },
  mounted() {
    if (process.browser) {

      import("element-resize-detector")
        .then(({default: elementResizeDetectorMaker}) => {

            const erd = elementResizeDetectorMaker({strategy: 'scroll'});

            erd.listenTo(this.$el, el => {
              this.width = el.offsetWidth
              this.height = el.offsetHeight
            })
          }
        )


    }

  },
  render() {
    return this.$scopedSlots.default({
      width: this.width,
      height: this.height
    })
  }
}
</script>




