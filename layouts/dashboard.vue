<template>
  <div class="page h-full overflow-hidden" :class="{'debug' : outline}">
    <!-- <button class="absolute pin-l pin-t z-40" @click="outline = !outline">outline</button> -->
    <div class="flex h-full">
      <div class="hidden xl:block w-64 flex-no-shrink bg-white border-r-2">
        <div class="flex justify-center px-2 py-8">
          <logo slot="logo" class="text-grey-darker"/>
        </div>
        <nav class="owl">
          <div>
            <div class="px-6 py-2">
              <Overline>Navigation</Overline>
            </div>
            <ul class="list-reset px-6 owl-sm">
              <li v-for="link in user" :key="link.name">
                <nuxt-link
                  class="text-on-light-primary transition font-medium text-12 hover:bg-blue-lightest hover:text-blue-darkest no-underline h-10 px-3 flex items-center rounded leading-none"
                  active-class="active bg-blue-lightest text-blue-darkest"
                  :to="link.to"
                  v-html="link.name"
                ></nuxt-link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="flex flex-col flex-1 overflow-x-hidden">
        <navigation-bar></navigation-bar>
        <nuxt class="flex-1 h-full py-2 md:py-6"/>
      </div>
    </div>
    <portal-target name="modals"/>
    <svg-symbols/>
  </div>
</template>

<script>
import SvgSymbols from "@/components/SvgSymbols"
import NavigationBar from "@/components/NavigationMain"
import Logo from "@/components/Logo"
import {mapGetters} from 'vuex'
import { log } from 'util';

export default {
  components: {SvgSymbols, NavigationBar, Logo},
  computed: {
    ...mapGetters(['hasUser'])
  },
  data() {
    return {
      outline: false,
      user: [
        {
          name: 'Talks',
          to: {
                name: 'user-index-status-index',
                params: { status: 'talk'}
              }
        },
        {
          name: `<span class='text-red'>Stories Work in Progress</span>`,
          to: {
                name: 'user-index-status-index',
                params: { status: 'story'}
              }
        },
        {
          name: 'Settings',
          to: '/user/settings/'
        }
      ]
    }
  },
  watch: {
    hasUser(value) {
      if(!value) return
      this.redirectTo(this.$route.query.redirect)
    }
  },
}
</script>

<style>
  .debug * {
    outline: 1px solid rgba(255, 0, 255, 0.5);
  }
</style>


