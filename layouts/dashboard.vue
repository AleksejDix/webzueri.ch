<template>
  <div>
    <page>
      <div class="fixed pin-l pin-t pin-b h-full w-64 hidden xl:block bg-primary">
        <nav class="owl">
          <div>
            <div class="py-4 px-8">
              <Overline class="text-grey-darker">Navigation</Overline>
            </div>
            <ul class="list-reset">
              <li
                v-for="link in user"
                :key="link.name"
              >
                <nuxt-link
                  class="text-pink hover:text-pink-light hover:bg-primary-dark transition text-12 no-underline py-4 px-8 flex items-center leading-none"
                  active-class="text-grey-lightest bg-primary-dark"
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
    </page>
    <modal />
    <svg-symbols />
  </div>
</template>

<script>
  import SvgSymbols from "@/components/SvgSymbols";
  import Logo from "@/components/Logo";
  import { mapGetters } from "vuex";
  import Page from "@/components/page";
  import Modal from "@/components/modal";

  export default {
    components: { SvgSymbols, Logo, Modal, Page },
    computed: {
      ...mapGetters(["hasUser"])
    },
    data() {
      return {
        user: [
          {
            name: "Events",
            to: "/dashboard/events/"
          },
          {
            name: "Talks",
            to: {
              name: "dashboard-index-status-index",
              params: { status: "talk" }
            }
          },
          {
            name: "Stories",
            to: {
              name: "dashboard-index-status-index",
              params: { status: "story" }
            }
          },
          {
            name: "Settings",
            to: "/dashboard/settings/"
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
