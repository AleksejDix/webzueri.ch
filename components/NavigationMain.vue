<template>
  <div class="bg-primary-dark">
    <nav class="container mx-auto flex items-center p-2 relative" role="navigation">
      <a class="bg-green-light skip-link fixed pin-t bg-white no-underline uppercase rounded-b text-sm font-bold p-2" href="#content">
        Skip to content</a>

      <nuxt-link to="/" class="flex items-center flex-no-shrink mr-6 no-underline">
        <div class="bg-green-light rounded-full w-12 mr-4 h-12 p-2 flex items-center justify-center">
          <svg class="w-6 h-6 fill-green-dark">
            <use xlink:href="#keyboard" />
          </svg>
        </div>
        <span class="font-bold text-white text-base tracking-wide font-display uppercase">Web Zürich</span>
      </nuxt-link>

      <div class="flex-1 flex justify-end w-full items-center owl-x">

        <nuxt-link class="leading-none p-0 hidden md:inline-block" v-if="hasUser" to="/user/">
          <img v-if="user.photoURL" class="block w-10 h-10 rounded-full" :src="user.photoURL" :alt="user.displayName">
          <svg v-else class=" h-6 w-6 p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
        </nuxt-link>

        <template v-else>
          <div class="hidden md:inline-block">
            <Button to="/signup/">sign up</Button>
          </div>
          <div class="hidden md:inline-block">
            <Button to="/signin/">login</Button>
          </div>
        </template>

        <Button aria-controls="menu" :aria-expanded="mobileNav" ref="open" @click="open" aria-live="assertive">
          <span class="xs:hidden">Menu</span>
          <svg slot="end" class="w-6 h-6 p-1">
            <use xlink:href="#burger" /></svg>
        </Button>

        <transition name="menu" @after-enter="focusClose" @after-leave="focusOpen">
          <focus-lock id="menu" class="absolute pin-t pin-r absolute z-50 m-2 md:w-sm shadow-lg rounded overflow-hidden" v-show="mobileNav">

            <Button class="absolute pin-r m-2" @click="close">close
              <Icon slot="end" type="close" /></Button>

            <div v-if="menu && menu.intern">
              <div class="intern pt-8 pb-4 px-6 rounded-t-lg  bg-white">
                <Overline>{{menu.intern.title}}</Overline>
                <ul class="list-reset py-2">
                  <li class="text-base" v-for="link in menu.intern.links" :key="link.text">

                    <nuxt-link @click.native="close" :to="link.url" class="no-underline py-2 block group">
                      <div class="flex flex-wrap items-center ">
                        <div class="transition rounded-full bg-green-light group-hover:bg-green w-6 h-6 mr-4 flex items-center justify-center">
                          <svg class="transition fill-green-dark group-hover:fill-green-light h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>

                        <div class="flex-1 flex justify-between leading-normal flex-wrap">
                          <span class="transition w-full sm:w-auto text-on-light-secondary group-hover:text-on-light-primary font-bold tracking-wide pr-8">{{link.text}}</span>
                          <span class="transition text-on-light-muted group-hover:text-green-dark inline-block font-base max-w-xs" v-if="link.desc" v-html="link.desc"></span>
                        </div>

                      </div>
                    </nuxt-link>
                  </li>
                </ul>
              </div>

              <!-- <div v-if="menu && menu.social" class="intern p-6 bg-grey-lightest border-t border-b">
                <Overline>{{menu.social.title}}</Overline>
                <ul class="list-reset py-2">
                  <li class="text-base" v-if="menu && menu.social.links" v-for="link in menu.social.links" :key="link.text">
                    <a v-if="link.url.includes('https')" :href="link.url" target="_blank" rel="noopener" class="no-underline  py-2 block group">

                      <div class="flex items-center ">

                        <div class="rounded-full group-hover:bg-green bg-green-light w-6 h-6 mr-4 flex items-center justify-center">
                          <svg class="group-hover:fill-green-light fill-green-dark h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>

                        <div class="flex-1 flex flex-wrap justify-between leading-normal">
                          <span class="w-full sm:w-auto text-green-dark group-hover:text-green font-bold tracking-wide">{{link.text}}</span>
                          <span class="text-on-light-secondary group-hover:text-on-light-primary inline-block font-base max-w-xs" v-if="link.desc" v-html="link.desc"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div> -->

              <div :class="[user ? 'justify-between' : 'justify-end']" class="border-t flex items-center border-b-lg py-4 px-6 bg-white owl-x">

                <nuxt-link @click.native="close" to="/user/" class="inline-block flex-1 flex no-underline items-center" v-if="user">
                  <div class="pr-4 flex-no-shrink">
                    <img class="rounded-full w-10 h-10 block" :src="user.photoURL" :alt="user.displayName">
                  </div>
                  <div class="leading-normal flex-1">
                    <div class="text-on-light-primary font-display weight-medium text-12 leading-tight">{{user.displayName}}</div>
                    <div class="text-12 text-on-light-secondary leading-tight">{{user.email}}</div>
                  </div>
                </nuxt-link>

                <template v-if="!hasUser">
                  <Button to="/signup/">sign up</Button>
                  <Button to="/signin/">login</Button>
                </template>

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
import {mapState, mapGetters} from 'vuex'
import UserChip from '~/components/Chip'

export default {
  components: {
    FocusLock,
    UserChip
  },
  computed: {
    ...mapGetters([
      'hasUser'
    ]),
    ...mapState({
      menu: state => state.menu.menu,
      user: state => state.user
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



