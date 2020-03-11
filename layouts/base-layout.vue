<template>
  <div class="pb-8">
    <div>
      <div class="container mx-auto px-4 lg:pb-0">
        <navigation-main>
          <logo slot="logo" class="text-black hover:text-black" />
        </navigation-main>
      </div>
    </div>
    <main>
      <slot />
    </main>
    <svg-symbols />
    <portal-target name="shamelessplug"></portal-target>
  </div>
</template>

<script>
import NavigationMain from "@/components/NavigationMain";
import SvgSymbols from "@/components/SvgSymbols";
import Logo from "@/components/Logo";

export default {
  components: { SvgSymbols, NavigationMain, Logo }
};
</script>
