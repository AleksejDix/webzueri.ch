<template>
<div>
  <div v-if="$apollo.loading">Loading...</div>
  <div v-else class="bg-indigo-darkest">

  <section class="pt-12 pb-8 bg-indigo-darkest">
    <div class="max-w-3xl mx-auto">
      <div class="px-4">
        <h1 class="mb-4 leading-tight text-3xl md:text-5xl text-base text-yellow font-display font-bold tracking-wide uppercase text-center">Talks given at Web Zürich</h1>
        <p class="max-w-md mx-auto leading-normal text-center text-xl md:text-2xl text-yellow-lighter">Learn, share and collaborate with your local <strong>web professionals</strong> and enthusiasts!</p>
        <div class="text-center pt-8">
          <button @click="openModal" class="bg-yellow hover:bg-yellow-dark inline-block rounded py-4 px-6 uppercase no-underline text-md font-bold">Submit your talk</button>
        </div>
      </div>
    </div>
  </section>


  <div class="p-4">
    <div class="max-w-md mx-auto">

      <template v-for="event in events">
        <div :key="event.id">

      <nuxt-link
        :to="{ name: 'talks-id', params: { id: talk.id }}"
        v-for="talk in event.talks" :key="talk.id"
        v-if="talk"
        class="mt-4 block rounded-lg p-4 md:p-8 bg-indigo-darker text-white md:flex talk no-underline"
      >
        <div class="md:w-2/3 pb-4 md:pb-0 md:pr-4">
          <h2 class="text-white text-2xl leading-tight font-semibold">{{talk.name}}</h2>

          <div class="flex items-center justify-between pt-6 text-white">
            <div class="flex items-center" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
              <div class="rounded-full w-10 h-10 mr-4 border-2 flex-no-shrink overflow-hidden" v-if="speaker.speakerPicture">
                <img :src="speaker.speakerPicture.url" :alt="speaker.name">
              </div>
              <div class="flex-1 opacity-75 text-lg">{{speaker.name}}</div>
            </div>
            <div class="opacity-75 text-lg" v-if="event.date">{{new Date(event.date).toLocaleDateString('de-DE')}}</div>
          </div>

        </div>
        <div class="md:w-1/3 border-t md:border-t-0 md:border-l border-black pt-4 md:pt-0 md:pl-4">
          <span class="inline-flex rounded mr-2 mb-2 leading-none bg-indigo-dark px-2 py-1  font-bold text-xs uppercase whitespace-no-wrap" v-for="n in ['Security', 'JS', 'Ruby', 'Haskel', 'ML', 'Sketch']" :key="n">{{n}}</span>
        </div>
      </nuxt-link>

      </div>
      </template>

    </div>
  </div>
</div>


<modal
  :show="showNewTalkModal"
  @close="showNewTalkModal = false">
  <div slot="header">Submit new talk</div>
</modal>

</div>




</template>

<script>
import gql from 'graphql-tag'
import Modal from "@/components/Modal"
import ButtonDefault from "@/components/ButtonDefault"

export default {
  components: { Modal, ButtonDefault },
  data: () => ({
    events: [],
    showNewTalkModal: false
  }),
  methods: {
    openModal() {
      this.showNewTalkModal = true
      console.log(this)
    }
  },
  apollo: {
    events: gql`
    {
      events(
        orderBy: date_DESC
      )
      {
        id
        date
        talks {
          id
          name
          speakers {
            name
            speakerPicture {
              url
            }
          }
        }
      }
    }`
  }
}
</script>


<style scoped>

.talk {
  transition: transform 160ms
}

.talk:focus,
.talk:hover {
  transform: scale(1.05);
}

</style>

