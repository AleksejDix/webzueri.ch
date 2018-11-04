<template>
  <div class="lg:flex -m-2">
    <div class="lg:w-1/2 p-2">
      <talk-new />
    </div>
    <div class="lg:w-1/2 p-2">
      <talk-list />
    </div>
  </div>
</template>

<script>
import TalkNew from '@/components/dashboard/talks/new'
import TalkList from '@/components/dashboard/talks/list'

export default {
  components: {TalkNew, TalkList},
  fetch ({ store, params }) {
    return store.dispatch('talks/getTalksByUser')
  }
}
</script>
