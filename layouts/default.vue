<template>
  <div>
    <navigation-main></navigation-main>
    <main>
    <nuxt/>
    </main>


    <modal
      :show="showNewTalkModal"
      @close="showNewTalkModal = false">
      <div slot="header">Submit new talk</div>
    </modal>

    <svg-symbols></svg-symbols>
  </div>
</template>

<script>

import Modal from "@/components/Modal"
import NavigationMain from "@/components/NavigationMain"
import SvgSymbols from "@/components/SvgSymbols"
import ButtonDefault from '@/components/ButtonDefault'
import Card from '@/components/Card'

export default {
  components: { Card, Modal, SvgSymbols, NavigationMain, ButtonDefault },
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
