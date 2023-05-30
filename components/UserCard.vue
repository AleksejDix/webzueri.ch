<template>
  <article class="flex items-center">
    <div class="flex-shrink-0 relative w-12 h-12">
      <cms-img
        v-if="photo"
        :width="64"
        :height="64"
        fit="crop"
        class="absolute inset-auto rounded-full w-full border border-2 border-white"
        :src="photo"
        :alt="name"
      />
      <div class="rounded-full absolute inset-auto shadow-inner"></div>
    </div>
    <div class="flex-1 leading-tight pr-2 pl-4">
      <h3 class="text-black font-book">{{ name }}</h3>
      <slot></slot>
      <div>{{ meta }}</div>
    </div>
  </article>
</template>

<script>
import CmsImg from "@/components/cms-image";

export default {
  components: {
    CmsImg
  },
  props: ["name", "meta", "photo"]
};
</script>
