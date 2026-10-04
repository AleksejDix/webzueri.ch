<template>
  <div class="relative min-h-screen bg-white">
    <TopNotice />
    <NavigationMain />
    <main id="content">
      <slot />
    </main>
    <Footer />
    <AskBar variant="floating" />
  </div>
</template>

<script setup lang="ts">
import TopNotice from "~/components/TopNotice.vue";
import NavigationMain from "~/components/NavigationMain.vue";
import Footer from "~/components/Footer.vue";
import AskBar from "~/components/AskBar.vue";
</script>
