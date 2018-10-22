<template>
  <div class="bg-on-light-muted fixed pin p-24 z-50">
    <div class="modal max-w-sm bg-white rounded-lg mx-auto shadow-lg overflow-hidden">

      <header class="modal-header px-12 py-6 bg-primary-dark border-b border-yellow-dark">

        <h1 class="text-lg text-on-dark-primary font-display font-bold tracking-wide uppercase text-center">
          {{$route.params.session}}
        </h1>

        </header>

        <footer class="modal-actions flex justify-end -m-2 p-4">
        <div class="p-2">
          <wz-button @click="$router.go(-1)">Cancel</wz-button>
        </div>
      </footer>
    </div>
   </div>
</template>

<script>
export default {
  mounted() {
    if (process.server) return
    const body = document.querySelector('body')
    body.style.overflow = "hidden"
  },
  destroyed() {
    if (process.server) return
    const body = document.querySelector('body')
    body.style.overflow = "visible"
  }
}
</script>
