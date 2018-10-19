<template>
  <div class="bg-primary-dark">
    <nav class="container mx-auto flex items-center p-2 relative" role="navigation">
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

      <chip :dropdown="true" :user="user"/>

      <div class="flex-1 flex justify-end w-full items-center">

        <nuxt-link
          class="no-underline inline-block group hover:bg-green-lightest rounded-full focus:outline-none p-1 m-1"
          v-if="user" to="/profile">
          <div class="flex items-center">
            <span v-if="user.name" class="uppercase text-white group-hover:text-green-darkest font-bold text-sm ml-2">{{user.name}}</span>
              <img v-if="user.picture" class="block w-6 h-6 rounded-full ml-2" :src="user.picture" alt="">
            <svg v-else class="fill-green-dark group-hover:fill-green-lightest h-4 w-4 relative" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>
        </nuxt-link>

        <nuxt-link
          class="no-underline leading-none inline-block group hover:bg-green-lightest rounded-full flex items-center justify-center p-1 m-1"
          v-else to="/login">
          <div class="flex items-center">
            <span class="uppercase text-white group-hover:text-green-darkest font-bold text-sm mx-2">join</span>
            <svg class=" group-hover:fill-green-lightest h-6 w-6 relative" viewBox="0 0 24 24">
              <path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
         </div>
        </nuxt-link>

        <button class="inline-block group hover:bg-green-lightest rounded-full focus:outline-none p-1 m-1" aria-controls="menu" :aria-expanded="mobileNav" ref="open" @click="open" aria-live="assertive">
          <div class="flex items-center">
            <span class="uppercase text-white group-hover:text-green-darkest font-bold text-sm mx-2">Menu</span>
            <svg  class="fill-green-dark group-hover:fill-green-lightest h-6 w-6 relative" viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0V0z"/>
              <path fill="white" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/>
            </svg>
          </div>
        </button>

        <transition name="menu" @after-enter="focusClose" @after-leave="focusOpen">
          <focus-lock id="menu" class="absolute pin-t pin-r absolute z-50 m-2 md:w-sm shadow-lg rounded overflow-hidden" v-show="mobileNav">
            <button class="inline-block absolute group pin-r pin-t rounded-full hover:bg-green-lightest focus:outline-none focus:bg-green-lightest p-1 m-1" @click="close" ref="close">
              <div class="flex items-center">
                <span class="uppercase font-bold text-sm ml-2">close</span>
                <div class="rounded-full bg-green-lightest w-6 h-6 ml-2 flex items-center justify-center group-hover:bg-green-dark">
                  <svg class="fill-green-dark group-hover:fill-green-lightest h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                  </svg>
                </div>
              </div>
            </button>

            <div>
              <div class="intern pt-8 pb-4 px-6 rounded-t-lg  bg-white">
                <h3 class="uppercase text-sm text-grey-darker font-semibold tracking-wide">{{menu.intern.title}}</h3>
                <ul class="list-reset py-2">
                  <li class="text-base" v-for="link in menu.intern.links" :key="link.text">
                    <nuxt-link @click.native="close" :to="link.url" class="no-underline py-2 block group">
                      <div class="flex flex-wrap items-center ">
                        <div class="rounded-full bg-indigo-lightest group-hover:bg-blue w-6 h-6 mr-4 flex items-center justify-center">
                          <svg class="fill-indigo-dark group-hover:fill-blue-lighter h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>

                        <div class="flex-1 flex justify-between leading-normal flex-wrap">
                          <span class="w-full sm:w-auto text-blue-darkest group-hover:text-blue-dark font-bold tracking-wide pr-8">{{link.text}}</span>
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
                    <a v-if="link.url.includes('https')" :href="link.url" target="_blank" rel="noopener" class="no-underline  py-2 block group">

                      <div class="flex items-center ">

                        <div class="rounded-full group-hover:bg-green bg-green-lighter w-6 h-6 mr-4 flex items-center justify-center">
                          <svg class="fill-green-darker h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
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
import Chip from '~/components/chip'
import {mapState} from 'vuex'

export default {
  components: {
    FocusLock,
    Chip
  },
  computed: {
    ...mapState([
      'menu',
      'user'
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

<style>

.skip-link {
  left: 50%;
  transform: translate3d(-50%, -100%, 0);
  transition: transform 200ms ease;
}

.skip-link:focus {
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}
</style>



