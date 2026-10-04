<template>
  <div class="pb-8">
    <div>
      <div class="container mx-auto px-4 lg:pb-0">
        <NavigationMain>
          <template #logo>
            <Logo class="text-black hover:text-black" />
          </template>
        </NavigationMain>
      </div>
    </div>
    <main>
      <slot />
    </main>
    <SvgSymbols />
    <ClientOnly>
      <div id="shamelessplug"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import NavigationMain from '~/components/NavigationMain.vue';
import SvgSymbols from '~/components/SvgSymbols.vue';
import Logo from '~/components/Logo.vue';
</script> 