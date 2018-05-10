<template>
  <div>
    <navigation-main></navigation-main>


    <div class="min-h-screen bg-yellow flex items-center">
      <div class="mx-auto max-w-3xl -mt-8">
        <div class="text-right flex flex-row-reverse">
          <h1 class="font-display text-yellow-darker text-5xl font tracking-tight leading-tight" style="font-size: 72pt">
          upcomming<br> talks<br> for<br>
          27 May 2018</h1>
        </div>

        <div class="text-right flex flex-row-reverse flex-wrap py-12 -m-4">
          <div class="p-4"  v-for="n in 3" :key="n">
            <div class="chip bg-white flex overflow-hidden rounded items-center">
              <div>
                <img class="block w-32" src="https://conf.vuejs.org/img/evan.jpg" alt="">
              </div>
              <div class="flex-1 p-8">
                <h2 class="leading-normal text-xl"><strong>Evan You</strong><br>
                  <span class="text-grey-dark font-normal">Introduction to Vue.js</span>
                </h2>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>



    <div class="flex">

    <div class="flex-1">

    <main class="max-w-xl m-auto">
      <nav class="action-bar">
        <button-default @click="openModal">open</button-default>
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
      <fetch url="sponsors" class="mb-4">

      </fetch>


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
import ButtonDefault from '@/components/ButtonDefault';

export default {
  components: { Modal, SvgSymbols, NavigationMain, ButtonDefault },
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
