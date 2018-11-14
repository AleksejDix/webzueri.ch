<template>
  <div>
    <div class="bg-primary-dark">
      <div class="container mx-auto">
        <navigation-main>
          <logo slot="logo" class="text-on-dark-secondary hover:text-on-dark-primary"/>
        </navigation-main>
      </div>
    </div>
    <main>
      <slot/>
    </main>
    <svg-symbols/>
  </div>
</template>

<script>

import NavigationMain from "@/components/NavigationMain"
import SvgSymbols from "@/components/SvgSymbols"
import Logo from "@/components/Logo"

export default {
  components: { SvgSymbols, NavigationMain, Logo }
}
</script>
