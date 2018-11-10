<template>
  <div class="overflow-hidden">

    <div class="transition relative flex h-full -m-4 " :class="{'open': open}">

      <div class="w-1/2 md:w-96 flex flex-col p-4" v-if="count > 0">
        <div class="flex items-center justify-between">
          <h3 class="text-14 px-2 flex items-center owl-x">
            <span class="text-on-dark-secondary">{{$route.params.status | capitalize}}</span>
          </h3>
          <Button size="small" :to="{name: 'user-index-status-index-create'}">new</Button>
        </div>

        <talk-list :list="list">
          <div class="py-2" slot-scope="{item : talk}">

            <nuxt-link @click.native="open = true" active-class="text-on-dark-primary bg-primary-light" :to="{name: `user-index-status-index-id`, params: { id: talk.id } }" class="text-on-dark-muted transition no-underline block bg-primary hover:bg-primary-light hover:text-on-dark-primary transition px-3 py-2 rounded-lg shadow owl-sm">

              <user-card :photo="talk.authorPhotoURL" :name="talk.authorDisplayName" :meta="talk.submittedAt | humanDate" />

              <div class="border-t border-primary-dark pt-2 flex flex-start">
                <div class="flex-1">
                  <h3 class="text-current-color leading-normal font-12">{{talk.title}}</h3>
                  <div class=" text-current-color truncate leading-normal font-12">
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
      </div>

      <div class="w-1/2 md:flex-1  p-2">
        <div class="bg-grey-lightest rounded-lg">
          <nuxt-child @close="open = false" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import TalkList from '@/components/Lister'

export default {
  components: {TalkList},
  data() {
    return {
      open: false
    }
  },
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
    handleClick(){
      console.log('close')
    },
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
    this.$store.dispatch(`dashboard/${this.$route.params.status}/sync`)
  }
}
</script>

<style scoped>
  .open {
    transform: translateX(-50%);
  }
  /* @media screen and (min-width: 20rem) {
                                                                .open {
                                                                  transform: translateX(-0rem);
                                                                }
                                                              } */
</style>






