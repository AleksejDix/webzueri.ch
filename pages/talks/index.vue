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
        <template v-for="talk in event.talks" v-if="talk">
          <talk :talk="talk" :key="talk.id"></talk>
        </template>
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
import Talk from "@/components/Talk"
import ButtonDefault from "@/components/ButtonDefault"

export default {
  components: { Talk, Modal, ButtonDefault },
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