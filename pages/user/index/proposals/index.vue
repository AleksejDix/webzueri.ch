<template>
  <talk-inbox>
    <talk-list slot="sidebar" v-if="count > 0" />
    <nuxt-child />
  </talk-inbox>
</template>

<script>
import TalkInbox from '@/components/ui/talk-inbox/'
import TalkList from '@/components/dashboard/talks/list'
import {mapGetters} from 'vuex'

export default {
  components: {TalkList, TalkInbox},
  computed: {
    ...mapGetters('proposals', ['count', 'list'])
  },
  fetch ({ store, params }) {
    console.log('asd')
    return store.dispatch('proposals/list')
  }
}
</script>
