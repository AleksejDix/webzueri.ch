<template>
  <div>
    <a
      class="bg-blue-light skip-link fixed top-0 bg-white no-underline uppercase rounded-b text-sm font-bold"
      href="#content"
      >Skip to content</a
    >
    <nav class="relative flex ">
      <slot name="logo"></slot>
      <ul class="flex-1 flex owl-x">
        <li v-for="link in menu.intern.links" :key="link.url" class="pt-2">
          <a
            v-if="link.url.includes('http')"
            :key="link.text"
            class="h-full hidden transition no-underline leading-normal  px-3 text-14 font-normal tracking-wide px-4 leading-normal lg:flex pb-2 items-center"
            :href="link.url"
          >
            <span>{{ link.text }}</span>
          </a>

          <nuxt-link
            v-else
            :key="link.text"
            class="h-full lg:flex lg:flex-col items-center hidden transition no-underline rounded-t-xl leading-normal text-14 font-normal tracking-wide px-6 py-2 leading-normal "
            active-class="bg-white"
            :to="link.url"
          >
            <svg class="w-6 h-6 fill-purple-700">
              <use v-bind="{ 'xlink:href': '#' + link.icon }"></use>
            </svg>
            <span>{{ link.text }}</span>
          </nuxt-link>
        </li>
      </ul>

      <div class="w-1/3 xl:relative">
        <div class="flex  owl-x justify-end">
          <!-- <button
            v-if="hasUser"
            class="leading-none p-0 hidden md:inline-block"
            @click="open('showUserMenu')"
          >
            <img
              v-if="user.photoURL"
              loading="lazy"
              class="block w-10 h-10 rounded-full"
              :src="user.photoURL"
              :alt="user.displayName"
            />
            <svg
              v-else
              class="h-10 w-10 fill-blue-lightest"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              ></path>
            </svg>
          </button> -->

          <!-- <template v-if="!user">
            <div class="hidden md:inline-block">
              <Button muted="true" to="/signup/">sign up</Button>
            </div>
            <div class="hidden md:inline-block">
              <Button to="/signin/">login</Button>
            </div>
          </template> -->

          <div class="block md:hidden py-4">
            <Button ref="open" @click="open('mobileNav')">
              <span class="xs:hidden">Menu</span>
              <svg slot="end" class="w-6 h-6 p-1">
                <use xlink:href="#burger"></use>
              </svg>
            </Button>
          </div>
        </div>
        <div
          v-if="mobileNav"
          class="fixed inset-auto z-30 opacity-64 "
          @click="close"
        ></div>

        <transition
          name="menu"
          @after-enter="focusClose"
          @after-leave="focusOpen"
        >
          <div
            v-if="mobileNav"
            class="absolute w-full xl:m-0 right-0 top-0 z-40 p-2 "
          >
            <div
              class="border  relative rounded-xl xl:-mr-2 xl:-mt-2 overflow-hidden"
            >
              <!--  <div class="flex justify-end items-center border-b-lg owl-x p-2 bg-primary-dark rounded">
                <nuxt-link @click.native="close" to="/dashboard/" class="inline-block flex-1 flex no-underline items-center text-gray-500 hover:text-gray-700 transition pl-4" v-if="user">
                  <user-card  :photo="user.photoURL" :name="user.displayName" meta="Hallo, how are you today?" />
                </nuxt-link>
                <div v-if="!hasUser">
                  <Button to="/signup/">sign up</Button>
                  <Button to="/signin/">login</Button>
                </div>

              </div>-->
              <div
                class="absolute right-0 top-0 m-4 flex items-center justify-center "
              >
                <button @click="close">
                  <svg class="w-8 h-8" transform="scale(0.8)">
                    <use v-bind="{ 'xlink:href': '#' + 'close' }"></use>
                  </svg>
                </button>
              </div>

              <div
                v-if="menu && menu.intern"
                class="intern pt-8 pb-4 px-6 bg-white gradient"
              >
                <Overline dark>{{ menu.intern.title }}</Overline>
                <ul class="list-reset py-2">
                  <li
                    v-for="link in menu.intern.links"
                    :key="link.text"
                    class="text-base"
                  >
                    <a
                      v-if="link.url.includes('http')"
                      :key="link.text"
                      class="no-underline py-2 block group"
                      :href="link.url"
                      @click.native="close"
                    >
                      <div class="flex flex-wrap items-center">
                        <div
                          class="transition rounded-full bg-black border w-6 h-6 mr-4 flex items-center justify-center"
                        >
                          <svg
                            class="transition h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
                          </svg>
                        </div>
                        <div
                          class="flex-1 flex justify-between leading-normal flex-wrap"
                        >
                          <span
                            class="transition w-full sm:w-auto text-gray-900 group-hover:text-white font-medium tracking-wide pr-8"
                            >{{ link.text }}</span
                          >
                          <span
                            v-if="link.desc"
                            class="transition text-on-dark-muted group-hover:text-blue-700 inline-block font-base max-w-xs"
                            v-html="link.desc"
                          ></span>
                        </div>
                      </div>
                    </a>

                    <nuxt-link
                      v-else
                      :key="link.text"
                      class="no-underline py-2 block group"
                      :to="link.url"
                      @click.native="close"
                    >
                      <div class="flex flex-wrap items-center">
                        <div
                          class="transition rounded-full bg-purple-200  w-6 h-6 mr-4 flex items-center justify-center"
                        >
                          <svg
                            class="transition h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
                          </svg>
                        </div>
                        <div
                          class="flex-1 flex justify-between leading-normal flex-wrap"
                        >
                          <span
                            class="transition w-full sm:w-auto text-gray-700 group-hover:text-white font-medium tracking-wide pr-8"
                            >{{ link.text }}</span
                          >
                          <span
                            v-if="link.desc"
                            class="transition text-on-dark-muted group-hover:text-blue-700 inline-block font-base max-w-xs"
                            v-html="link.desc"
                          ></span>
                        </div>
                      </div>
                    </nuxt-link>
                  </li>
                </ul>
              </div>
              <div v-if="menu && menu.social" class="intern p-4 md:p-6 bg-main">
                <Overline dark>{{ menu.social.title }}</Overline>
                <ul v-if="menu && menu.social.links" class="list-reset py-2">
                  <li
                    v-for="link in menu.social.links"
                    :key="link.text"
                    class="text-base"
                  >
                    <a
                      v-if="link.url.includes('https')"
                      :href="link.url"
                      target="_blank"
                      rel="noopener"
                      class="no-underline py-2 block group"
                    >
                      <div class="flex items-center">
                        <div
                          class="transition rounded-full bg-purple-200 group-hover:bg-primary-light w-6 h-6 mr-4 flex items-center justify-center"
                        >
                          <svg
                            class="transition  h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
                          </svg>
                        </div>
                        <div
                          class="flex-1 flex flex-wrap justify-between leading-normal"
                        >
                          <span
                            class="transition w-full sm:w-auto text-gray-700 group-hover:text-gray-900 font-medium tracking-wide"
                            >{{ link.text }}</span
                          >
                          <span
                            v-if="link.desc"
                            class="transition text-gray-700 group-hover:text-gray-700 inline-block font-base max-w-xs"
                            v-html="link.desc"
                          ></span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>
  </div>
</template>

<script>
import FocusLock from "vue-focus-lock";
import { mapState } from "vuex";

export default {
  components: {
    FocusLock
  },
  data() {
    return {
      showUserMenu: false,
      mobileNav: false,
      showNav: false
    };
  },
  computed: {
    ...mapState({
      menu: state => state.menu.menu,
      user: state => state.user
    })
  },
  methods: {
    handleKey(event) {
      if (event.keyCode !== 27) return;
      this.close();
    },
    close() {
      this.showUserMenu = false;
      this.mobileNav = false;
      document.removeEventListener("keyup", this.handleKey);
    },
    open(menu) {
      this[menu] = true;
      document.addEventListener("keyup", this.handleKey);
    },
    focusOpen() {},
    focusClose() {}
  }
};
</script>

<style scoped>
.skip-link {
  left: 50%;
  transform: translate3d(-50%, -100%, 0);
  transition: transform 200ms ease;
}

.skip-link:focus {
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.menu-enter-active,
.menu-leave-active {
  transform-origin: 100% 0%;
  transition: transform 0.2s, opacity 0.2s;
  transform: scale(1);
  opacity: 1;
}

.menu-enter, .menu-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform-origin: 100% 0%;
  opacity: 0;
  transform: scale(0.7);
}
</style>
