<template>
  <article class="border bg-white rounded-lg">
    <header class="py-4 px-6 text-on-light-primary">
      <slot name="title"></slot>
    </header>
    <div class="py-4 px-6 border-t">
      <slot></slot>
    </div>
  </article>
</template>
