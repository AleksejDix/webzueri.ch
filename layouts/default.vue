<template>
  <div>
    <navigation-main></navigation-main>

    <section class="py-8 bg-green-lighter">
      <div class="max-w-3xl mx-auto pt-8">
        <div class="px-4">
          <h1 class="mb-4 leading-tight text-3xl md:text-5xl text-base text-indigo-darker font-display font-bold tracking-wide uppercase text-center">People making <br class="md:hidden"> the web in Zürich</h1>
          <p class="leading-normal text-center text-xl md:text-2xl text-yellow-darkerst">Learn, share and collaborate with your local <strong>web professionals</strong> and enthusiasts!</p>
        </div>
        <div class="my-12 h-64 py-12 bg-auto bg-center bg-no-repeat" style="background-image: url('/people.svg')">
        </div>
      </div>


    </section>



    <section class="max-w-5xl mx-auto p-4">
      <header class="flex items-baseline justify-between border-b-2 border-grey-light mb-8">
        <h2 class="text-xl text-base text-indigo-darker font-display font-bold tracking-wide uppercase py-4 border-b-2 border-indigo -mb-2px">next event</h2>
        <a class="font-semibold text-indigo-dark hover:underline no-underline" href="https://www.meetup.com/Web-Zurich/">RSVG on Meetup</a>
      </header>
    </section>

    <section class="max-w-5xl mx-auto p-4">
      <header class="flex items-baseline justify-between border-b-2 border-grey-light mb-8">
        <h2 class="text-xl text-base text-indigo-darker font-display font-bold tracking-wide uppercase py-4 border-b-2 border-indigo -mb-2px">Recordings</h2>
        <a class="font-semibold text-indigo-dark hover:underline no-underline" href="https://www.youtube.com/channel/UChFcu8mbNjHZO7Zt5mDpSXA/videos">view all</a>
      </header>

      <div class="flex flex-wrap -m-4">

        <div class="w-full md:max-w-xs p-4 flex">
          <aside class="flex flex-col w-full p-6 rounded shadow overflow-hidden" style="background-image: linear-gradient(0deg, #A0F0ED 0, #5661B3 100%);">
            <h4 class="mb-6 text-2xl text-white">You have video skill?</h4>
            <p class="text-grey-lightest text-base font-semibold leading-normal mb-6">We always need help with video recording!</p>
            <button-default class="mt-auto w-full bg-purple text-white">Apply as helper</button-default>
          </aside>
        </div>

        <div class="flex-1 p-4">
          <ol class=" list-reset flex flex-wrap -m-4">
            <li class="w-full md:w-1/2 lg:w-1/3 p-4" v-for="n in 3" :key="n">
              <card></card>
            </li>
          </ol>
        </div>

      </div>

    </section>


    <section class="max-w-5xl mx-auto p-4">
      <header class="flex items-baseline justify-between border-b-2 border-grey-light mb-8">
        <h2 class="text-xl text-base text-indigo-darker font-display font-bold tracking-wide uppercase py-4 border-b-2 border-indigo -mb-2px">Past Events</h2>
        <a class="font-semibold text-indigo-dark hover:underline no-underline" href="https://www.meetup.com/Web-Zurich/">view all</a>
      </header>
    </section>


    <div class="flex">

      <div class="flex-1">

        <main class="max-w-xl m-auto">
          <nav class="action-bar">
            <button-default @click="openModal" class="bg-purple text-white">submit new talk</button-default>
          </nav>
          <nuxt/>
        </main>

      </div>

      <aside class="max-w-xs flex-1 py-4 px-12  border-l">

        <h4 class="py-6 text-xl">Sponsors</h4>

        <p class="text-grey-dark text-sm font-semibold leading-normal mb-4">Without you it would not be possible!</p>

        <div class="bg-grey-light rounded p-4 mb-4">
          <img class="w-32 mx-auto" src="https://zurich.impacthub.ch/wp-content/themes/naked-wordpress-master/img/logos/ihz_black_nobaseline_60px.png" alt="">
        </div>


        <button-default class="w-full bg-purple text-white">become a sponsor</button-default>

      </aside>

    </div>

    <modal
      :show="showNewTalkModal"
      @close="showNewTalkModal = false">
      <div slot="header">Submit new talk</div>
    </modal>

    <svg-symbols></svg-symbols>
  </div>
</template>

<script>

import Modal from "@/components/Modal"
import NavigationMain from "@/components/NavigationMain"
import SvgSymbols from "@/components/SvgSymbols"
import ButtonDefault from '@/components/ButtonDefault'
import Card from '@/components/Card'

export default {
  components: { Card, Modal, SvgSymbols, NavigationMain, ButtonDefault },
  data() {
    return {
      showNewTalkModal: false
    }
  },
  methods: {
    say(msg) {
      console.log(msg)
    },
    openModal() {
      this.showNewTalkModal = true
      console.log(this)
    }
  }
}
</script>

<style>

html {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  line-height: 1;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
  color: #2b2b2b;
  background-repeat: no-repeat;
  background-size: 1900px;
  background-position: 50% -460px;
}

/* html {
  background-image: url('/tm-big.jpg');
} */

html *,
html ::before,
html ::after {
  box-sizing: inherti;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}


.action-bar {
  display: flex;
  justify-content: flex-end;
  padding: 40px 0;
}


</style>
