<template functional>
  <div class=" flex full-h-full -m-4 p-2">

    <div class="w-96 flex flex-col p-2" v-if="slots().sidebar">
      <slot name="sidebar-header"></slot>
      <slot name="sidebar"></slot>
    </div>

    <div class="flex-1 p-2">
      <div class="bg-grey-lightest rounded-lg">
        <slot></slot>
      </div>

    </div>
  </div>
</template>
