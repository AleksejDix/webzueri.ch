<template>
  <NuxtLink to="/" class="logo" aria-label="Web Zürich, home">
    <KeycapLogo />
  </NuxtLink>
</template>

<script setup lang="ts">
import KeycapLogo from "~/components/KeycapLogo.vue";
</script>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  margin: -0.25rem -0.6rem;
  border-radius: 1rem;
}
</style>
