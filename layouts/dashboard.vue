<template>
  <div class="page min-h-screen dashboard bg-grey-lightest">

    <div class="fixed pin-l pin-t pin-b h-full w-64 hidden xl:block border-r">
      <nav class="owl">
        <div>
          <div class="pt-6 px-12">
            <Overline class="text-grey-darker">Navigation</Overline>
          </div>
          <ul class="list-reset py-6 px-12 owl-sm">
            <li
              v-for="link in user"
              :key="link.name"
            >
              <nuxt-link
                class="text-on-light-secondary transition text-12 no-underline py-2 flex items-center rounded leading-none"
                active-class="text-blue-dark"
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
            name: "Events",
            to: "/user/events/"
          },
          {
            name: "Talks",
            to: {
              name: "user-index-status-index",
              params: { status: "talk" }
            }
          },
          {
            name: "Stories",
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
