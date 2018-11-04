<template>
  <Card>
    <h2 slot="title">Proposals</h2>
    <ul class="list-reset py-4 owl-xs" v-if="list.length > 0">

      <li v-for="talk in list" :key="talk.id">
        <div class="bg-primary shadow rounded-lg py-4 px-6">
          <div class="flex justify-between items-center">
            <div class="owl-sm">
              <h2 class="text-on-dark-primary">{{talk.title}} - {{talk.submittedAt.seconds}} - {{talk.id}}</h2>
              <div class="text-on-dark-secondary">
                {{talk.abstract}}
              </div>
            </div>
            <div class="pl-4">
              <Badge v-if="!talk.status" color="blue">submitted</Badge>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <talks-empty v-else />
  </Card>
</template>

<script>
import Card from '@/components/Card'
import TalksEmpty from '@/components/dashboard/talks/empty'
import {mapGetters} from 'vuex'
export default {
  components: {Card, TalksEmpty},
  computed: {
    ...mapGetters('talks', ['list'])
  }
}
</script>

