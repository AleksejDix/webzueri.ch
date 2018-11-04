<template>
  <div>
    <div class="md:p-4 md:py-6 bg-primary-light pattern h-screen">
      <nuxt />
    </div>
    <svg-symbols />
  </div>
</template>

<script>
import SvgSymbols from "@/components/SvgSymbols"
import {mapGetters} from 'vuex'

export default {
  components: {SvgSymbols},
  computed: {
    ...mapGetters(['hasUser'])
  },
  watch: {
    hasUser(value) {
      if(!value) return
      this.redirectTo(this.$route.query.redirect)
    }
  },
  methods: {
    redirectTo(routeName) {
      if (!routeName) this.$router.push('/user/settings/')
      this.$router.push({name: routeName})
    }
  },
  mounted() {
    if (this.hasUser) {
       this.redirectTo(this.$route.query.redirect)
    }
  }
}
</script>


<style scoped>
  .nuxt-link-active {
    @apply text-secondary;
  }
  .nuxt-link-active::after {
    content: '';
    @apply absolute pin-x pin-b bg-secondary h-1;
  }
</style>

