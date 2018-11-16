<template>
  <article class="flex flex-col border bg-white rounded-lg">
    <header v-if="$slots['title'] || $slots['title']" class="border-b flex justify-between items-center px-6 h-16">
      <slot name="title"></slot>
      <slot name="actions"></slot>
    </header>
    <slot></slot>
  </article>
</template>
