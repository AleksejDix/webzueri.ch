<template>
    <nav>
      {{ $data }}
      <a href="/a">a</a>
    </nav>
</template>

<script>
export default {
  asyncData (context) {
    return context.app.$storyapi.getAll('cdn/stories/107491', {
      version: 'draft'
    })
    .then(res => res.data)
    .catch(res => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  }
}
</script>

