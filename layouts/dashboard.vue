<template>
  <div>
    <PageComponent>
      <div
        class="fixed left-0 top-0 bottom-0 h-full w-64 hidden xl:block bg-primary"
      >
        <nav class="space-y-4">
          <div>
            <div class="py-4 px-8 min-h-16 flex items-center bg-blue-600">
              <div class="text-white text-xs uppercase tracking-wider">Navigation</div>
            </div>
            <ul class="list-none">
              <li v-for="link in user" :key="link.name">
                <NuxtLink
                  class="text-pink-500 hover:text-pink-300 hover:bg-gray-800 transition text-sm no-underline py-4 px-8 flex items-center leading-none"
                  active-class="text-gray-100 bg-gray-800"
                  :to="link.to"
                  v-html="link.name"
                ></NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="pl-0 xl:pl-64 bg-gray-100">
        <slot />
        <footer>
          <div class="flex justify-center px-3 py-4">
            <Logo class="text-gray-600" />
          </div>
        </footer>
      </div>
    </PageComponent>
    <ModalComponent />
    <SvgSymbols />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SvgSymbols from '~/components/SvgSymbols.vue';
import Logo from '~/components/Logo.vue';
import PageComponent from '~/components/page.vue';
import ModalComponent from '~/components/modal.vue';

const user = ref([
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
]);
</script> 