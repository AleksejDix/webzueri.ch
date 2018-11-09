<template>

  <section class="modal md:p-12  mx-auto  overflow-hidden">
    <div class="bg-on-light-secondary fixed pin p-24 shadow-inner"> </div>

    <div class="max-w-md mx-auto relative z-10 bg-white rounded-lg shadow-lg" style="background-clip: padding-box">
      <header class="flex justify-between items-center min-h-12 bg-blue-dark rounded-t-lg" style="background-clip: padding-box">

        <h1 class="text-on-dark-secondary px-6 ">
          <slot name="header">{{$route.params.status}}</slot>
        </h1>

        <icon-close @click="$router.go(-1)" />

      </header>
      <div class="py-4 px-6">
        <dynamic-component @submit="handleSubmit" :settings="{
          path: 'forms-create',
          type: $route.params.status
        }" />
        <!-- <form @submit.prevent="handleSubmit" class="owl">
          <Input label="Title" placeholder="Short Title of your speech" v-model="form.title" />
          <InputText label="Abstract" placeholder="Description of yout talk" v-model="form.abstract" limit="480" />
          <div class="flex justify-end">
            <Button>send</Button>
          </div>
        </form> -->
      </div>
    </div>
  </section>
</template>

<script>
import IconClose from '@/components/icon-button'
import DynamicComponent from "@/components/dynamic/"
export default {
  components: {IconClose, DynamicComponent},
  methods: {
    async handleSubmit(payload) {
      if (!payload) {
        console.log('no payload')
        return
      }
      try {
        console.log(this.$route.params.status)
        await this.$store.dispatch(`dashboard/${this.$route.params.status}/set`, payload)
        this.$router.push({name: 'user-index-status-index'})
      } catch (error) {
        console.trace(error)
      }
    }
  }
}
</script>
