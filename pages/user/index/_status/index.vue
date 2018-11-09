<template>
  <talk-inbox>
    <div slot="sidebar-header" class="flex items-center justify-between">
      <h3 class="text-14 px-2 flex items-center owl-x">
        <span class="text-on-dark-secondary">{{$route.params.status | capitalize}}</span>
      </h3>
      <Button size="small" :to="{name: 'user-index-status-index-create'}">new</Button>
    </div>

    <talk-list :list="list" slot="sidebar" v-if="count > 0">
      <div class="py-2" slot-scope="{item : talk}">

        <nuxt-link active-class="text-on-dark-primary bg-primary-light" :to="{name: `user-index-status-index-id`, params: { id: talk.id } }" class="text-on-dark-muted transition no-underline block bg-primary hover:bg-primary-light hover:text-on-dark-primary transition px-3 py-2 rounded-lg shadow owl-sm">

          <user-card :photo="talk.authorPhotoURL" :name="talk.authorDisplayName" :meta="talk.submittedAt | humanDate" />

          <div class="border-t border-primary-dark pt-2 flex flex-start">
            <div class="flex-1">
              <h3 class="text-current-color leading-normal font-12">{{talk.title}}</h3>
              <div class="w-64 text-current-color truncate leading-normal font-12">
                {{talk.abstract}}
              </div>
            </div>
            <div>
              <Badge :color="statusColor(talk.status)">{{talk.status}}</Badge>
            </div>
          </div>
        </nuxt-link>
      </div>
    </talk-list>

    <nuxt-child />
  </talk-inbox>
</template>

<script>
import TalkInbox from '@/components/ui/talk-inbox/'
import TalkList from '@/components/Lister'

export default {
  components: {TalkList, TalkInbox},
  computed: {
    can() {
      return this.$store.getters[`dashboard/${this.$route.params.status}/can`]
    },
    count() {
      return this.$store.getters[`dashboard/${this.$route.params.status}/count`]
    },
    list() {
      return this.$store.getters[`dashboard/${this.$route.params.status}/list`]
    }
  },
  methods: {
    statusColor(status) {
      switch (status) {
        case 'rejected':
          return 'red';
        case 'approved':
          return 'green';
        default:
          return 'orange'
      }
    },
  },
  fetch ({ store, params }) {
    const can = store.getters[`dashboard/${params.status}/can`]
    return store.dispatch(`dashboard/${params.status}/list`)
  },
  created() {
    if (process.browser) {
      this.$store.dispatch(`dashboard/${this.$route.params.status}/sync`)
    }
  }
}
</script>









