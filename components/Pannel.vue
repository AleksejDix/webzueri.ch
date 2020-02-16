<template>
  <article class="card bg-primary rounded-xl  ">
    <header class="border-b border-black p-4">
      <slot name="header"></slot>
    </header>
    <slot></slot>
    <footer class="footer p-4">
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script>
  export default {};
</script>
