<template>
  <div class="page min-h-screen dashboard ">

    <div>
      Logo
    </div>

    <div class="fixed pin-l pin-t pin-b h-full w-64 hidden xl:block">
      <nav class="owl">
        <div>
          <div class="px-6 py-2">
            <Overline>Navigation</Overline>
          </div>
          <ul class="list-reset px-6 owl-sm">
            <li
              v-for="link in user"
              :key="link.name"
            >
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

    <div class="pl-0 xl:pl-64 min-h-screen ">
      <nuxt />
      <footer>
        <div class="flex justify-center px-3 py-4">
          <logo
            slot="logo"
            class="text-grey-darker"
          />
        </div>
      </footer>
    </div>

    <portal-target name="modals" />
    <svg-symbols />
  </div>
</template>

<script>
  import SvgSymbols from "@/components/SvgSymbols";
  import NavigationBar from "@/components/NavigationMain";
  import Logo from "@/components/Logo";
  import { mapGetters } from "vuex";

  export default {
    components: { SvgSymbols, NavigationBar, Logo },
    computed: {
      ...mapGetters(["hasUser"])
    },
    data() {
      return {
        user: [
          {
            name: "Talks",
            to: {
              name: "user-index-status-index",
              params: { status: "talk" }
            }
          },
          {
            name: `Stories`,
            to: {
              name: "user-index-status-index",
              params: { status: "story" }
            }
          },
          {
            name: "Settings",
            to: "/user/settings/"
          }
        ]
      };
    },
    watch: {
      hasUser(value) {
        if (!value) return;
        this.redirectTo(this.$route.query.redirect);
      }
    }
  };
</script>
