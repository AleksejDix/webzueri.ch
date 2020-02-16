<template>
  <div>
    <div class="md:p-4 md:py-6  min-h-screen">
      <nuxt />
    </div>
    <svg-symbols />
  </div>
</template>

<script>
import SvgSymbols from "@/components/SvgSymbols";
import { mapGetters } from "vuex";

export default {
  components: { SvgSymbols },
  computed: {
    ...mapGetters(["hasUser"])
  },
  watch: {
    hasUser(value) {
      if (!value) return;
      this.redirectTo(this.$route.query.redirect);
    }
  },
  mounted() {
    if (this.hasUser) {
      this.redirectTo(this.$route.query.redirect);
    }
  },
  methods: {
    redirectTo(routeName) {
      if (!routeName) this.$router.push("/dashboard/settings/");
      this.$router.push({ name: routeName });
    }
  }
};
</script>

<style scoped>
.nuxt-link-active {
  @apply text-gray-500;
}
.nuxt-link-active::after {
  content: "";
  @apply absolute inset-x-0 bottom-0 bg-orange-500 h-1;
}
</style>
