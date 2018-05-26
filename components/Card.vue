<template>
  <a href="#" class="no-underline">
    <article class="flex flex-col overflow-hidden shadow rounded">
      <div
      class="w-full bg-cover bg-center"
      style="padding-bottom: 42.85%; background-image: url(http://timeline-covers.net/-/pics/video/486-video-facebook-cover.jpg)" >

      </div>
      <header class="flex-1 p-6">
        <h3 class="text-indigo-darkest text-xl">{{card.title}}</h3>
      </header>
      <footer class="bg-grey-lightest p-6 border-t">
        <h5 class="font-bold text-grey-darker text-sm pb-2">SPEAKER</h5>
        <span class="text-indigo-dark font-book">Pascal Kaufmann</span>
      </footer>
    </article>
  </a>
</template>

<script>
  export default {
    props: {
      card: {
        type: Object,
        default: () => ({
          title: "Building a Headless Shop",
          thumbnail: "http://timeline-covers.net/-/pics/video/486-video-facebook-cover.jpg"
        })
      }
    }
  }
</script>
