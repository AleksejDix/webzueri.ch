<template>
  <div class="bg-on-light-muted fixed pin p-24">
    <div class=" bg-white rounded shadow container mx-auto">
      <button class="close" @click="$router.go(-1)">close</button>
      {{$route.params.session}}
      <h1>Awesome</h1>
    </div>
   </div>
</template>
