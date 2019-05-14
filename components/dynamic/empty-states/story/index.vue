<template>
  <div class="owl">
    <Ratio :width="999" :height="834">
      <img
        loading="lazy"
        src="~assets/svg/undraw_blogging_vpvv.svg"
        alt="Woman creating a new Article for the Blog"
      />
    </Ratio>
    <div class="max-w-sm mx-auto owl">
      <div class="flex justify-center">
        <Button :to="{ name: 'dashboard-index-status-index-create' }">
          <svg slot="start" class="w-6 h-6 p-1">
            <use xlink:href="#add" />
          </svg>
          create a new {{ this.$route.params.status }}</Button
        >
      </div>

      <p class="text-on-light-primary leading-normal">
        Why not share your latest <strong>blogpost</strong>, you just wrote
        recently?
      </p>

      <ul class="list-reset list-bullets text-on-light-secondary">
        <li>
          We will share your <strong>blogpost</strong> on
          <nuxt-link class="link" :to="{ name: 'news' }"
            >webzuri.ch/news</nuxt-link
          >
        </li>
        <li>
          All we need is a picture, title, erxcerpt and the original URL of your
          article.
        </li>
        <li>
          You can't write <strong>blogposts</strong> on
          <nuxt-link class="link" :to="{ name: 'index' }">webzuri.ch</nuxt-link>
          directly.
        </li>
      </ul>
    </div>
  </div>
</template>
