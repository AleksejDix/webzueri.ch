<template>
  <ul class="list-reset min-w-64 block overflow-y-auto " v-if="list.length > 0">
    <li v-for="talk in list" :key="talk.id">
      <nuxt-link active-class="text-on-light-primary bg-white shadow-lg" :to="{name: 'user-index-talks-index-id', params: { id: talk.id } }" class="transition no-underline block py-1 px-2 hover:bg-white hover:shadow-lg">

        <div class="rounded-lg bg-white flex justify-between items-center zoom transition  p-4">

          <div class="flex owl-x">
            <div class="flex-no-shrink mr-2">
              <img class="rounded-full w-8 h-8 border border-2" :src="talk.authorPhotoURL" :alt="talk.authorDisplayName">
            </div>
            <div class="flex-1 text-12 ">
              <div class="border-b pt-1 pb-2">
                <span class="text-blue-darker">{{talk.authorDisplayName}}</span>
                <time class=" text-on-light-muted leading-normal font-12">{{ talk.submittedAt | humanDate }}</time>
              </div>

              <div class="py-2">
                <h3 class="text-on-light-primary leading-normal font-12">{{talk.title}}</h3>
                <div class="w-64 text-on-light-secondary truncate leading-normal font-12">
                  {{talk.abstract}}
                </div>
              </div>
            </div>
          </div>

          <div class="pl-4">
            <Badge v-if="!talk.status" color="blue">submitted</Badge>
          </div>
        </div>

      </nuxt-link>

    </li>
  </ul>
</template>

<script>


import Card from '@/components/Card'
import TalksEmpty from '@/components/dashboard/talks/empty'
import {mapGetters} from 'vuex'
export default {
  components: {Card, TalksEmpty},
  computed: {
    ...mapGetters('userTalks', ['list']),
  },
  methods: {
    deleteTalk(id) {
      this.$store.dispatch('userTalks/destroy', id)
    }
  },
}
</script>

