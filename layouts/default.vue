<template>
  <div>
    <page>
      <base-layout>
        <nuxt></nuxt>
      </base-layout>
    </page>
    <modal />
  </div>
</template>

<script>
import BaseLayout from "@/layouts/base-layout";
import Modal from "@/components/modal";
import Page from "@/components/page";

export default {
  components: { BaseLayout, Modal, Page }
};
</script>
