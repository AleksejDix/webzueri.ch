<template>
  <div>
    <navigation-main></navigation-main>
    <main>
      <slot />
    </main>
    <modal :show="showNewTalkModal" @close="showNewTalkModal = false">
      <div slot="header">Submit new talk</div>
    </modal>
    <svg-symbols />
    <div class="bg-primary-dark text-center p-4 text-on-dark-secondary">
      made with 💚 by <a class="link" target="_blank" rel="noopener" href="https://twitter.com/aleksejdix">Aleksej Dix</a>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal"
import NavigationMain from "@/components/NavigationMain"
import SvgSymbols from "@/components/SvgSymbols"

export default {
  components: { Modal, SvgSymbols, NavigationMain },
  data() {
    return {
      showNewTalkModal: false
    }
  },
  methods: {
    openModal() {
      this.showNewTalkModal = true
    }
  }
}
</script>
