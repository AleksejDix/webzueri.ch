<template>
  <div class="flex h-full px-2 md:px-4 overflow-auto scrolling-touch xl:overflow-hidden">
    <section
      class="flex flex-col w-screen-3/4 md:w-screen-3/5 flex-no-shrink lg:w-1/3 owl-sm xl:px-2"
    >
      <header class="flex-no-shrink px-2">
        <div class="flex items-center">
          <h3 class="text-16 px-2 flex items-center owl-x font-normal text-on-light-primary">drafts</h3>
          <Badge color="fuchsia">{{drafts.length}}</Badge>
        </div>
      </header>
      <div class="flex-1 flex flex-col overflow-y-auto scrolling-touch px-2 h-full">
        <div class="flex flex-col flex-1 flex-no-shrink h-full owl-xs">
          <resize-observer>
            <draggable
              @start="drag=true"
              @end="drag=false"
              element="ul"
              slot-scope="{width, height}"
              :class="{'empty' : drafts.length === 0 }"
              class="transition list-reset min-w-64 block owl relative drag-area flex-1 shadow-inner rounded-lg p-2 md:p-4 bg-grey-lighter"
              :list="drafts"
              :options="{
              group: {
                name: 'drafts',
              },
              delay: 0,
              touchStartThreshold: 3,
              animation: 150,
              scroll: true,
              ghostClass: 'ghost',
              filter: '.ignore-elements',
              draggable: '.drag-item',
              handle:'.handle'
            }"
              @change="(e) => handleChange(e, 'draft')"
            >
              <transition-group class="block w-full">
                <li
                  class="bg-white shadow hover:shadow-lg text-on-light-secondary hover:text-on-light-primary"
                  v-for="(talk, index) in drafts"
                  :key="talk.id"
                  :class="{
                    'rounded-t-lg': index === 0,
                    'rounded-b-lg' : index === drafts.length - 1,
                    'border-t border-grey': index > 0 && index < drafts.length,
                    'drag-item': width > 293,
                    'bg-red-lightest border border-red' :  talk.rejected
                  }"
                >
                  <talk-item :width="width" :data="talk">
                    <icon-button title="drag & drop" class="handle cursor-move" icon="drag"/>
                  </talk-item>
                </li>
              </transition-group>
            </draggable>
          </resize-observer>
          <div class="sticky pin-b bg-grey-lightest py-2">
            <Button :to="{name: 'user-index-status-index-create'}">
              <svg slot="start" class="w-6 h-6 p-1">
                <use xlink:href="#add"></use>
              </svg>
              add new {{this.$route.params.status}}
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section
      class="flex flex-col w-screen-3/4 md:w-screen-3/5 flex-no-shrink lg:w-1/3 owl-sm xl:px-2"
    >
      <header class="flex-no-shrink px-2">
        <div class="flex items-center">
          <h3
            class="text-16 px-2 flex items-center owl-x font-normal text-on-light-primary"
          >proposals</h3>
          <Badge color="fuchsia">{{proposals.length}}</Badge>
        </div>
      </header>
      <div class="flex-1 flex flex-col overflow-y-auto scrolling-touch px-2 h-full">
        <div class="flex flex-col flex-1 flex-no-shrink h-full owl">
          <resize-observer>
            <draggable
              @start="drag=true"
              @end="drag=false"
              element="ul"
              slot-scope="{width, height}"
              :class="{'empty' : proposals.length === 0 }"
              class="transition list-reset min-w-64 block owl relative drag-area flex-1 shadow-inner rounded-lg p-2 md:p-4 bg-grey-lighter"
              :list="proposals"
              :options="{
              group: {
                name: 'proposals',
                put: ['drafts'],
              },
              delay: 0,
              animation: 0,
              touchStartThreshold: 3,
              ghostClass: 'ghost',
              draggable: '.drag-item',
              filter: '.ignore-elements',
            }"
              @change="(e) => handleChange(e, 'proposal')"
            >
              <transition-group class="block w-full">
                <li
                  class="bg-white shadow hover:shadow-lg text-on-light-secondary hover:text-on-light-primary"
                  v-for="(talk, index) in proposals"
                  :key="talk.id"
                  :class="{
                    'rounded-t-lg': index === 0,
                    'rounded-b-lg' : index === proposals.length - 1,
                    'border-t border-grey': index > 0 && index < proposals.length,
                    'drag-item': width > 293,
                    'bg-red-lightest border border-red' :  talk.rejected
                  }"
                >
                  <talk-item :width="width" :data="talk"></talk-item>
                </li>
              </transition-group>
            </draggable>
          </resize-observer>
        </div>
      </div>
    </section>
    <section
      class="flex flex-col w-screen-3/4 md:w-screen-3/5 flex-no-shrink lg:w-1/3 owl-sm xl:px-2"
    >
      <header class="flex-no-shrink px-2">
        <div class="flex items-center">
          <h3
            class="text-16 px-2 flex items-center owl-x font-normal text-on-light-primary"
          >approved</h3>
          <Badge color="fuchsia">{{approved.length}}</Badge>
        </div>
      </header>
      <div class="flex-1 flex flex-col overflow-y-auto scrolling-touch px-2 h-full">
        <div class="flex flex-col flex-1 flex-no-shrink h-full owl">
          <resize-observer>
            <draggable
              @start="drag=true"
              @end="drag=false"
              element="ul"
              slot-scope="{width, height}"
              :class="{'empty' : approved.length === 0 }"
              class="transition list-reset min-w-64 block owl relative drag-area flex-1 shadow-inner rounded-lg p-2 md:p-4 bg-grey-lighter"
              :list="approved"
              :options="{
              group: {
                name: 'approved',
                put: ['proposals'],
              },
              delay: 0,
              sort: false,
              animation: 150,
              touchStartThreshold: 3,
              draggable: '.drag-item',
              ghostClass: 'ghost',
            }"
              @change="(e) => handleChange(e, 'approved')"
            >
              <transition-group class="block w-full">
                <li
                  class="bg-white shadow hover:shadow-lg text-on-light-secondary hover:text-on-light-primary"
                  v-for="(talk, index) in approved"
                  :key="talk.id"
                  :class="{
                    'rounded-t-lg': index === 0,
                    'rounded-b-lg' : index === approved.length - 1,
                    'border-t border-grey': index > 0 && index < approved.length,
                    'drag-item': width > 293,
                    'bg-red-lightest border border-red' :  talk.rejected
                  }"
                >
                  <talk-item :width="width" :data="talk"></talk-item>
                </li>
              </transition-group>
            </draggable>
          </resize-observer>
        </div>
      </div>
    </section>
    <section class="md:flex-1">
      <div class="bg-grey-lightest rounded-lg">
        <nuxt-child/>
      </div>
    </section>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import TalkList from '@/components/Lister'
import DynamicComponent from "@/components/dynamic/"
import TalkItem from "@/components/dashboard/TalkItem"
import ResizeObserver from "@/components/resize-observer"
import IconButton from "@/components/icon-button"

export default {
  components: {TalkList, DynamicComponent, TalkItem, Draggable, ResizeObserver, IconButton },
  computed: {
    canReview() {
      return this.$store.getters[`dashboard/${this.$route.params.status}-proposal/can`]
    },
    canApprove() {
      return this.$store.getters[`dashboard/${this.$route.params.status}-approved/can`]
    },
    drafts() {
      return this.$store.state.dashboard[this.$route.params.status+"-draft"].list
    },
    proposals() {
      return this.$store.state.dashboard[this.$route.params.status+"-proposal"].list
    },
    approved() {
      return this.$store.state.dashboard[this.$route.params.status+"-approved"].list
    }
  },
  async fetch ({ store, params }) {
    await store.dispatch(`dashboard/${params.status}-approved/list`)
    await store.dispatch(`dashboard/${params.status}-draft/list`)
    await store.dispatch(`dashboard/${params.status}-proposal/list`)
  },
  created() {
    this.$store.dispatch(`dashboard/${this.$route.params.status}-draft/sync`)
    this.$store.dispatch(`dashboard/${this.$route.params.status}-proposal/sync`)
    this.$store.dispatch(`dashboard/${this.$route.params.status}-approved/sync`)
  },
  methods: {
    async handleChange(e, status) {
      if ('added' in e) {
        try {
            const {id} = e.added.element
            const data = {
              status
            }
            const ok = await this.$store.dispatch(`dashboard/${this.$route.params.status}-${status}/update`,{id, data})
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>


<style scoped>
  .ghost {
    @apply bg-grey shadow-inner rounded-lg !important;
  }

  .empty {
    background-image: url('~assets/svg/ghost.svg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100px auto;
  }

  .drag-area > .drag-item {
    @apply absolute pin m-0;
  }

  .drag-area > .drag-item * {
    @apply hidden;
  }
  .sortable-chosen {
    @apply shadow-lg bg-blue-lightest;
  }
</style>
