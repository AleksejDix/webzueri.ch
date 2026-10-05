<template>
  <footer class="footer frame">
    <div class="footer__grid">
      <div class="footer__hello">
        <p class="display footer__title">See you at the next meetup.</p>
        <div class="mt-6 flex flex-wrap gap-2">
          <a :href="MEETUP_URL" target="_blank" rel="noopener" class="btn btn-primary">Join on Meetup</a>
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="btn footer__btn-outline">Submit a talk</a>
        </div>
      </div>

      <nav class="footer__nav" aria-label="Footer">
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
    <p class="footer__legal"><LazyLogo hydrate-on-visible /> <span class="ml-3">A free community meetup since 2016.</span></p>
  </footer>
</template>

<script setup lang="ts">
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/composables/useSiteSearch";
</script>

<style scoped>
.footer {
  margin-block: 7rem 0.75rem;
  padding: clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 4rem) 7rem;
}
.footer__grid {
  display: grid;
  gap: 3.5rem;
  max-width: 72rem;
  margin-inline: auto;
}
@media (min-width: 768px) {
  .footer__grid {
    grid-template-columns: 1.2fr 1fr;
    align-items: end;
  }
}
.footer__title {
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  max-width: 12ch;
}
.footer__btn-outline {
  background: #fff;
  color: var(--color-zh-navy);
  box-shadow: 0 1px 2px rgb(0 12 31 / 0.08);
}
.footer__btn-outline:hover {
  color: var(--color-zh-blue);
}

.footer__nav {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  gap: 1.5rem 2.5rem;
}
@media (min-width: 768px) {
  .footer__nav {
    justify-content: end;
  }
}
.footer__nav ul {
  display: grid;
  gap: 0.75rem;
  align-content: start;
}
.footer__nav a {
  font-weight: 500;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.footer__nav a:hover {
  color: var(--color-zh-blue);
}
.footer__legal {
  max-width: 72rem;
  margin: 4rem auto 0;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
</style>
