<template>
  <div class="bg-on-light-secondary fixed pin p-24 z-50 shadow-inner">
    <section class="modal max-w-sm bg-white rounded-lg mx-auto shadow-lg overflow-hidden">

      <header class="flex justify-between items-center min-h-12 bg-blue-darker">

        <h1 class="text-on-dark-secondary px-6 ">
          <slot name="header">Proposal</slot>
        </h1>

        <icon-close @click="$router.go(-1)" />

      </header>
      <div class="py-4 px-6">
        <user-talk-create />
      </div>
    </section>
  </div>
</template>

<script>
import IconClose from '@/components/icon-button'
import UserTalkCreate from '@/components/forms/userTalk/create/'
export default {
  components: {UserTalkCreate, IconClose},
  mounted() {
    if(process.client) {
      document.body.classList.toggle('overflow-hidden')
    }
  },
  beforeDestroy() {
    if(process.client) {
      document.body.classList.toggle('overflow-hidden')
    }
  }
}
</script>
