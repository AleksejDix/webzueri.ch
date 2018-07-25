<template>
<div class="bg-indigo-darkest">
  <nav class="max-w-5xl mx-auto flex items-center p-4 relative"  role="navigation">

    <a class="bg-green-lightest skip-link fixed pin-t bg-white no-underline uppercase rounded-b text-sm font-bold p-2" href="#content">
      Skip to content</a>

    <nuxt-link to="/" class="flex items-center flex-no-shrink mr-6 no-underline">
      <div class="bg-green-lightest rounded-full w-12 mr-4 h-12 p-2 flex items-center justify-center">
        <svg class="w-6 h-6 fill-teal-dark">
          <use xlink:href="#keyboard" />
        </svg>
      </div>
      <span class="font-bold text-white text-base tracking-wide font-display uppercase">Web Züri</span>
    </nuxt-link>



    <div class="flex-1 flex justify-end w-full">

      <button class="inline-block group hover:bg-green-lightest rounded-full focus:outline-none p-2 m-2" aria-controls="menu" :aria-expanded="mobileNav" ref="open"  @click="open" aria-live="assertive">
        <div class="flex items-center">
          <span class="uppercase text-white group-hover:text-green-darkest font-bold text-sm ml-2">Menu</span>
          <div class="rounded-full bg-green-lightest group-hover:bg-green-dark  w-6 h-6 ml-2 flex items-center justify-center">
            <svg style="top:.5px" class="fill-green-dark group-hover:fill-green-lightest h-4 w-4 relative" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
          </div>
        </div>
      </button>

      <transition name="menu" @after-enter="focusClose" @after-leave="focusOpen">
      <focus-lock
      id="menu"
      class="absolute  z-50 pin-x mx-4 md:m-4 md:pin-none md:w-full md:max-w-sm md:pin-r md:pin-t shadow-lg rounded-lg"
      v-show="mobileNav">
        <button class="inline-block absolute group pin-r pin-t rounded-full hover:bg-green-lightest focus:outline-none focus:bg-green-lightest p-2 m-2" @click="close" ref="close">
          <div class="flex items-center">
            <span class="uppercase font-bold text-sm ml-2">close</span>
            <div class="rounded-full bg-green-lightest w-6 h-6 ml-2 flex items-center justify-center group-hover:bg-green-dark">
              <svg class="fill-green-dark group-hover:fill-green-lightest h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>
            </div>
          </div>
        </button>

        <div>

          <div class="intern pt-8 pb-4 px-6 rounded-t-lg  bg-white">
            <h3 class="uppercase text-sm text-grey-darker font-semibold tracking-wide">{{menu.intern.title}}</h3>
             <ul class="list-reset py-2">
              <li class="text-base" v-for="link in menu.intern.links" :key="link.text">
                <nuxt-link

                  :to="link.url"
                  class="no-underline py-2 block group">
                  <div class="flex flex-wrap items-center ">

                    <div class="rounded-full bg-indigo-lightest group-hover:bg-blue w-6 h-6 mr-4 flex items-center justify-center">
                      <svg class="fill-indigo-dark group-hover:fill-blue-lighter h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                      </svg>
                    </div>

                    <div class="flex-1 flex justify-between leading-normal flex-wrap">
                      <span class="w-full sm:w-auto text-blue-darkest group-hover:text-blue-dark  font-bold tracking-wide">{{link.text}}</span>
                      <span class="text-grey-darker group-hover:text-grey-darkest inline-block font-base max-w-xs" v-if="link.desc" v-html="link.desc"></span>
                    </div>

                  </div>
                  </nuxt-link>
              </li>
            </ul>
          </div>

          <div class="intern pt-8 pb-4 px-6 bg-indigo-darker border-black border-t rounded-b-lg" v-if="menu.social">
            <h3 class="uppercase text-sm text-grey-lighter font-semibold tracking-wide">{{menu.social.title}}</h3>
             <ul class="list-reset py-2">
              <li class="text-base" v-for="link in menu.social.links" :key="link.text">
                <a v-if="link.url.includes('https')"

                    :href="link.url" target="_blank" rel="noopener"
                    class="no-underline  py-2 block group">

                    <div class="flex items-center ">

                      <div class="rounded-full group-hover:bg-green bg-green-lighter w-6 h-6 mr-4 flex items-center justify-center">
                        <svg class="fill-green-darker h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                        </svg>
                      </div>

                      <div class="flex-1 flex flex-wrap justify-between leading-normal">
                        <span class="w-full sm:w-auto text-green-lighter group-hover:text-green font-bold tracking-wide">{{link.text}}</span>
                        <span class="text-grey-light group-hover:text-white inline-block font-base max-w-xs" v-if="link.desc" v-html="link.desc"></span>
                      </div>
                    </div>
                    </a>
              </li>
            </ul>
          </div>
        </div>

      </focus-lock>
      </transition>

    </div>
  </nav>
</div>
</template>

<script>
import FocusLock from 'vue-focus-lock';
import {mapState} from 'vuex'

export default {
  components: {FocusLock},
  computed: {
    ...mapState([
      'menu'
    ])
  },
  data() {
    return {
      mobileNav: false,
      showNav: false
    }
  },
  methods: {
    handleKey(e) {
      if (event.keyCode !== 27) return
      this.close()
    },
    close() {
      this.mobileNav = false
      document.removeEventListener('keyup', this.handleKey)
    },
    open() {
      this.mobileNav = true
      document.addEventListener('keyup', this.handleKey)
    },
    focusOpen() {
      this.$refs.open.focus();
    },
    focusClose() {
      this.$refs.close.focus();
    },
  }
}
</script>

<style lang="scss" scoped>

  .menu-enter-active, .menu-leave-active {
    transform-origin: 100% 0%;
    transition: transform 0.200s,  opacity 0.200s;
    transform: scale(1);
    opacity: 1;
  }
  .menu-enter, .menu-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform-origin: 100% 0%;
    opacity: 0;
    transform: scale(0.7)
  }

  .skip-link {
    left: 50%;
    transform: translate3d(-50%, -100%, 0);
    transition: transform 200ms ease;
  }

  .skip-link:focus {
    left: 50%;
    transform: translate3d(-50%, 0, 0)
  }

</style>



