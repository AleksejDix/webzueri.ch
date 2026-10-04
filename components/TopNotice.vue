<template>
  <p class="notice">
    Everyone at Web Zürich follows our
    <NuxtLink to="/code-of-conduct">Code of Conduct</NuxtLink>
    and
    <NuxtLink to="/advertising-rules">advertising rules</NuxtLink>.
  </p>
</template>

<style scoped>
/* The thin line above the frame, like america.gov's "official website" notice */
.notice {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0 0.3em;
  height: var(--notice-h);
  padding-inline: 1rem;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--color-zh-muted);
  text-align: center;
}
.notice a {
  font-weight: 600;
  color: var(--color-zh-navy);
  text-decoration: underline;
  text-decoration-color: var(--color-zh-line);
  text-underline-offset: 3px;
  transition: color 0.2s, text-decoration-color 0.2s;
}
.notice a:hover {
  color: var(--color-zh-blue);
  text-decoration-color: var(--color-zh-blue);
}
</style>
