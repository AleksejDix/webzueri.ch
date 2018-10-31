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
        <span class="font-bold text-white text-base tracking-wide font-display uppercase">Web Zürich</span>
      </nuxt-link>

      <UserChip />

      <div class="flex-1 flex justify-end w-full items-center owl-x">

        <Button v-if="profile" to="/user/">
          {{profile.name}}
          <img slot="end" v-if="profile.picture" class="block" :src="profile.picture" :alt="profile.name">
          <svg slot="end" v-else class=" h-6 w-6 p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
        </Button>

        <Button v-else to="/signin/">
          Sign In
          <svg slot="end" class="h-6 w-6 " viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </Button>

        <Button aria-controls="menu" :aria-expanded="mobileNav" ref="open" @click="open" aria-live="assertive">
          Menu
          <svg slot="end" class="w-6 h-6 p-1">
            <use xlink:href="#burger" /></svg>
        </Button>

        <transition name="menu" @after-enter="focusClose" @after-leave="focusOpen">
          <focus-lock id="menu" class="absolute pin-t pin-r absolute z-50 m-2 md:w-sm shadow-lg rounded overflow-hidden" v-show="mobileNav">

            <Button class="absolute pin-r m-2" @click="close">close
              <Icon slot="end" type="close" /></Button>

            <div v-if="menu && menu.intern">
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

              <div v-if="menu && menu.social" class="intern pt-8 pb-4 px-6 bg-indigo-darker border-black border-t rounded-b-lg">
                <h3 class="uppercase text-sm text-grey-lighter font-semibold tracking-wide">{{menu.social.title}}</h3>
                <ul class="list-reset py-2">
                  <li class="text-base" v-if="menu && menu.social.links" v-for="link in menu.social.links" :key="link.text">
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
import {mapState} from 'vuex'
import UserChip from '~/components/Chip'

export default {
  components: {
    FocusLock,
    UserChip
  },
  computed: {
    ...mapState({
      menu: state => state.menu.menu,
      profile: state => state.profile
    })
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
    },
    focusClose() {
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



