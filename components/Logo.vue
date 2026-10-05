<template>
  <!-- Its own <a> without route-dependent classes or aria-current: the footer logo hydrates
       lazily, and server and client disagreed about those on the home page -->
  <NuxtLink v-slot="{ href, navigate }" to="/" custom>
    <a
      :href="href"
      class="-mx-[0.6rem] -my-1 inline-flex items-center rounded-2xl"
      aria-label="Web Zürich, home"
      @click="navigate"
    >
      <KeycapLogo />
    </a>
  </NuxtLink>
</template>
<script setup lang="ts">
import KeycapLogo from "~/components/KeycapLogo.vue";
</script>
