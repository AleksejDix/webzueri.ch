<template>
  <div class="prose">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang="scss" scoped>
  .prose {
    font-size: 15px;

    line-height: 1.5;

    > * + * {
      margin-top: 1.5em;
    }

    h1,
    h2,
    h3 {
      line-height: 1.25;
    }

    h1 {
      font-size: 1.75em;
    }
    h2 {
      font-size: 1.625em;
    }
    h3 {
      font-size: 1.5em;
    }
    strong,
    b {
      font-weight: bold;
    }

    i,
    italic {
      font-style: oblique;
    }

    a {
      position: relative;
      color: black;
      font-weight: 600;
      border-bottom: 3px solid #ffeb3b;
      transition: background-color 120ms;
      text-decoration: none;
    }
    a:hover {
      background-color: #ffeb3b;
    }
  }

  @media screen and (min-width: 640px) {
    .prose {
      font-size: 19px;
    }
  }
</style>


