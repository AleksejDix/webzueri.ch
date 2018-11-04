<template>
  <div class="bg-primary-dark">
    <section>
      <header class="text-center pt-8 md:pt-24 md:pb-12 px-4">
        <h2 class="leading-normal max-w-md mx-auto text-on-dark-primary font-display text-16 md:text-21">Unlock your community's peer-to-peer sharing potential</h2>
      </header>
      <div class="flex justify-center overflow-hidden py-12">
        <div class="min-w-60 md:max-w-sm p-2" v-for="feedback in feedbacks" :key="feedback.id">

          <article class="shadow-lg relative">

            <header class="bg-primary px-6 pt-12 pb-2 rounded-lg shadow relative z-10">
              <h3 class="font-display leading-normal text-on-dark-primary" v-if="feedback.speaker.name">{{feedback.speaker.name}}</h3>
              <img class=" absolute pin-t pin-l -mt-8 ml-6 block w-16 shadow rounded-full" v-if="feedback.speaker" :src="feedback.speaker.speakerPicture.url" />
              <img class="absolute pin-r pin-t w-auto h-6 mt-4 mr-4" :src="feedback.sponsor.logo.url" alt="">
            </header>
            <div class="px-2">
              <blockquote class="shadow-lg bg-white px-6 py-4 text-on-light-secondary rounded-b  italic text-10 leading-normal">
                <svg viewBox="0 0 9 8" xmlns="http://www.w3.org/2000/svg" width="9" height="8">
                  <path fill="#657884" d="M2.1 8c-.4 0-.7-.1-1-.4-.4-.3-.6-.6-.8-1L0 5A6.3 6.3 0 0 1 3 0l.7.6v.3A4 4 0 0 0 2.8 2c-.3.5-.4 1.1-.4 1.8 0 .4 0 .7.2 1 0 .1.2.4.5.6l.4.7v.6c0 .4 0 .7-.3 1-.3.2-.6.3-1 .3zm5.4 0c-.4 0-.8-.1-1.1-.4-.4-.3-.6-.6-.8-1L5.3 5a6.3 6.3 0 0 1 3-5.1l.7.6v.3a4 4 0 0 0-1.3 3c0 .3 0 .6.2.8l.5.7.4.7.1.6c0 .4-.1.7-.4 1-.3.2-.6.3-1 .3z" />
                </svg>
                {{feedback.quote}}
              </blockquote>

            </div>

          </article>

        </div>
      </div>
    </section>
  </div>

</template>

<script>
import QueryFeedbacks from '~/services/apollo/queries/feedbacks'

export default {
  data() {
    return {
      feedbacks: [],
    }
  },
  apollo: {
    feedbacks: {
      prefetch: true,
      query: QueryFeedbacks
    }
  }
}
</script>
