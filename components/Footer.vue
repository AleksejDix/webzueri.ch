<template>
  <footer class="frame mt-28 mb-3 px-[clamp(1.5rem,5vw,4rem)] pt-[clamp(2.5rem,6vw,4.5rem)] pb-28">
    <div class="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.2fr_1fr] md:items-end">
      <div>
        <p class="display max-w-[12ch] text-[clamp(2.25rem,5vw,3.75rem)]">See you at the next meetup.</p>
        <div class="mt-6 flex flex-wrap gap-2">
          <a :href="MEETUP_URL" target="_blank" rel="noopener" class="btn btn-primary">Join on Meetup</a>
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="btn bg-raised text-heading shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.08)] hover:text-link">Submit a talk</a>
        </div>
      </div>

      <nav
        class="grid grid-cols-[repeat(3,auto)] justify-start gap-x-10 gap-y-6 md:justify-end *:grid *:content-start *:gap-3 [&_a]:font-medium [&_a]:text-heading [&_a]:[transition:color_0.2s] [&_a:hover]:text-link"
        aria-label="Footer"
      >
        <ul>
          <li><NuxtLink to="/events">Events</NuxtLink></li>
          <li><NuxtLink to="/talks">Talks</NuxtLink></li>
          <li><NuxtLink to="/speakers">Speakers</NuxtLink></li>
          <li><NuxtLink to="/communities">Communities</NuxtLink></li>
        </ul>
        <ul>
          <li><NuxtLink to="/sponsors">Sponsors</NuxtLink></li>
          <li><NuxtLink to="/about">About</NuxtLink></li>
          <li><NuxtLink to="/code-of-conduct">Code of Conduct</NuxtLink></li>
          <li><NuxtLink to="/advertising-rules">Advertising rules</NuxtLink></li>
        </ul>
        <ul>
          <li><a href="https://chat.whatsapp.com/FxOfVTK9nf431xHtVl3eGK" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="https://webzurich.slack.com" target="_blank" rel="noopener">Slack</a></li>
          <li><a href="https://twitter.com/webzuerich" target="_blank" rel="noopener">Twitter</a></li>
          <li><a href="https://github.com/webzuri/webzuri.ch" target="_blank" rel="noopener">GitHub</a></li>
        </ul>
      </nav>
    </div>
    <!-- The logo is rendered on the server and wakes up (starting its 3D keycaps) only once scrolled into view -->
    <p class="mx-auto mt-16 max-w-6xl text-[0.875rem] text-muted"><LazyLogo hydrate-on-visible /> <span class="ml-3">A free community meetup since 2016.</span></p>
  </footer>
</template>

<script setup lang="ts">
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/composables/useSiteSearch";
</script>
