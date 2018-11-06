<template>

  <div class="bg-white rounded-lg overflow-hidden flex full-h-full overflow-hidden" style="height: 700px">
    <div class="w-96 border-r flex flex-col bg-grey-light shadow-inner" v-if="count > 0">
      <div class="flex items-center justify-between p-2">
        <h3 class="text-14 px-2 flex items-center owl-x">
          <span> Proposals</span>

          <Badge color="blue">{{count}}</Badge>
        </h3>
        <Button size="small" to="/user/talks/create">new</Button>
      </div>
      <talk-list />
    </div>
    <div class="flex-1">
      <nuxt-child />
    </div>
  </div>

</template>

<script>
import TalkList from '@/components/dashboard/talks/list'
import {mapGetters} from 'vuex'

export default {
  components: {TalkList},
  scrollTop: true,
  computed: {
    ...mapGetters('userTalks', ['count'])
  },
  fetch ({ store, params }) {
    return store.dispatch('userTalks/list')
  }
}
</script>
