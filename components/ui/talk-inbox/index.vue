<template functional>
  <div class="bg-white rounded-lg overflow-hidden flex full-h-full overflow-hidden" style="height: 700px">
    <div class="w-96 border-r flex flex-col bg-grey-light shadow-inner" v-if="slots().sidebar">
      <div class="flex items-center justify-between p-2">
        <h3 class="text-14 px-2 flex items-center owl-x">
          <span>Proposals</span>
        </h3>
        <Button size="small" to="/user/talks/create">new</Button>
      </div>
      <slot name="sidebar"></slot>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>
