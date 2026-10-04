<template>
  <header class="site-header">
    <a class="skip-link" href="#content">Skip to content</a>

    <nav class="site-header__bar" aria-label="Main">
      <Logo />
      <button
        type="button"
        class="btn btn-ink site-header__menu"
        :aria-expanded="menuOpen"
        aria-controls="site-menu"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "Close" : "Menu" }}
      </button>
    </nav>

    <Transition name="sheet">
      <div v-if="menuOpen" id="site-menu" class="sheet">
        <ul class="sheet__links">
          <li v-for="(link, i) in links" :key="link.to" :style="{ '--i': i }">
            <NuxtLink :to="link.to" class="sheet__link">{{ link.text }}</NuxtLink>
          </li>
        </ul>
        <div class="sheet__footer">
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="btn btn-primary">Submit a talk</a>
          <a :href="MEETUP_URL" target="_blank" rel="noopener" class="btn btn-quiet">Join on Meetup</a>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="menuOpen" class="scrim" aria-hidden="true" @click="menuOpen = false" />
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Logo from "~/components/Logo.vue";
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/composables/useSiteSearch";

const links = [
  { text: "Events", to: "/events" },
  { text: "Talks", to: "/talks" },
  { text: "Speakers", to: "/speakers" },
  { text: "Communities", to: "/communities" },
  { text: "Sponsors", to: "/sponsors" },
  { text: "About", to: "/about" },
  { text: "Code of Conduct", to: "/code-of-conduct" },
  { text: "Advertising rules", to: "/advertising-rules" },
];

const menuOpen = ref(false);
const route = useRoute();
watch(() => route.fullPath, () => (menuOpen.value = false));

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") menuOpen.value = false;
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<style scoped>
/* Sits over the top of the first frame on every page */
.site-header {
  position: absolute;
  /* 16px below the frame's top edge and 24px in from its sides, as on america.gov */
  inset: calc(var(--notice-h) + 1rem) calc(var(--frame-inset) + 1.5rem) auto;
  z-index: 50;
}
.site-header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
}
.site-header__menu {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  padding: 0 1.25rem 2px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  background: #002664;
}
.site-header__menu:hover {
  background: #001b47;
}

.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 50%;
  z-index: 60;
  transform: translate(-50%, -150%);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: var(--color-zh-blue);
  color: #fff;
  font-weight: 600;
  transition: transform 0.2s;
}
.skip-link:focus {
  transform: translate(-50%, 0);
}

.sheet {
  position: absolute;
  top: 4.25rem;
  right: clamp(0.5rem, 2vw, 1.25rem);
  z-index: 1;
  width: min(calc(100vw - 2.5rem), 22rem);
  padding: 1.5rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 12 31 / 0.06), 0 30px 60px -20px rgb(0 12 31 / 0.35);
  transform-origin: top right;
}
.sheet__links {
  display: grid;
}
.sheet__link {
  display: block;
  padding: 0.375rem 0.5rem;
  border-radius: 0.75rem;
  font-variation-settings: "opsz" 32;
  font-size: 1.625rem;
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.2;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.sheet__link:hover,
.sheet__link.router-link-active {
  color: var(--color-zh-blue);
}
.sheet__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-zh-line);
}
.scrim {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.sheet-enter-active {
  transition: opacity 0.25s, transform 0.35s var(--ease-out-soft);
}
.sheet-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-0.5rem);
}
.sheet-enter-active .sheet__links li {
  animation: link-in 0.45s var(--ease-out-soft) both;
  animation-delay: calc(var(--i) * 30ms + 60ms);
}
@keyframes link-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
