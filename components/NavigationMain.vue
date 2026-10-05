<template>
  <!-- Sits over the top of the first frame on every page: 16px below the frame's top edge
       and 24px in from its sides, as on america.gov -->
  <header class="absolute inset-[calc(var(--notice-h)+1rem)_calc(var(--frame-inset)+1.5rem)_auto] z-50">
    <a
      class="fixed top-2 left-1/2 z-60 -translate-x-1/2 -translate-y-[150%] rounded-full bg-accent px-4 py-2 font-semibold text-white [transition:translate_0.2s] focus:translate-y-0"
      href="#content"
    >Skip to content</a>

    <nav class="flex items-center justify-between p-6" aria-label="Main">
      <Logo />
      <button
        type="button"
        class="btn btn-ink relative z-2 h-11 px-5 pt-0 pb-0.5 text-[1rem] leading-none font-medium tracking-[-0.03em] bg-[#002664] hover:bg-[#001b47] dark:bg-strong dark:hover:bg-strong"
        :aria-expanded="menuOpen"
        aria-controls="site-menu"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "Close" : "Menu" }}
      </button>
    </nav>

    <Transition name="sheet">
      <div
        v-if="menuOpen"
        id="site-menu"
        class="absolute top-[4.25rem] right-[clamp(0.5rem,2vw,1.25rem)] z-1 w-[min(calc(100vw-2.5rem),22rem)] origin-top-right rounded-[1.75rem] bg-raised p-6 shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.06),0_30px_60px_-20px_rgb(var(--wz-shadow)/0.35)]"
      >
        <ul class="sheet__links grid">
          <li v-for="(link, i) in links" :key="link.to" :style="{ '--i': i }">
            <NuxtLink
              :to="link.to"
              class="block rounded-xl px-2 py-1.5 text-[1.625rem] leading-[1.2] font-medium tracking-[-0.035em] text-heading [transition:color_0.2s] hover:text-link [&.router-link-active]:text-link"
            >{{ link.text }}</NuxtLink>
          </li>
        </ul>
        <div class="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="btn btn-primary">Submit a talk</a>
          <a :href="MEETUP_URL" target="_blank" rel="noopener" class="btn btn-quiet">Join on Meetup</a>
          <ThemeSwitch class="ml-auto" />
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="menuOpen" class="fixed inset-0 z-0" aria-hidden="true" @click="menuOpen = false" />
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
