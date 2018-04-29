<template>
  <div>
    <ul>
      <li><nuxt-link to="/">home</nuxt-link></li>
      <li><nuxt-link to="/talks/">talks</nuxt-link></li>
    </ul>
    <nuxt/>
  </div>
</template>

<script>

export default {
  mounted () {
    if (this.$storyblok.inEditor) {
      this.$storyblok.init()
      this.$storyblok.on('change', () => {
        location.reload(true)
      })
    }
  },
}
</script>


<style>

html {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  line-height: 1;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
  color: #2b2b2b
}

html *,
html ::before,
html ::after {
  box-sizing: inherti;
}

body {
  height: 100%;
  background-color: #f4f4f4;
}

</style>
