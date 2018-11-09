<template>
  <div class="owl">
    <Ratio :width="999" :height="834">
      <img src="~assets/svg/blank-canvas.svg" alt="Woman standing infront of a white canvas">
    </Ratio>
    <div class="max-w-sm mx-auto owl">
      <div class="flex justify-center">
        <Button :to="{name: 'user-index-status-index-create'}">create a new {{this.$route.params.status}}</Button>
      </div>

      <p class="text-on-light-primary leading-normal">Sharing is caring! Why not talk about your latest project, the great tool you found or the problem you just solved recently?</p>

      <ul class="list-reset list-bullets text-on-light-secondary">
        <li>Talks are 15 minutes without Q&A</li>
        <li>We have HDMI & Thunderbolt available and the resolution is 1080p (1920x1080)</li>
      </ul>

    </div>
  </div>
</template>

