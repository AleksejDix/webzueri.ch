<template>
  <!-- Full-width light band with a card rail, like america.gov's "More coming" section -->
  <section
    v-if="people?.length"
    class="mt-[clamp(7rem,12vw,11rem)] bg-[#f7f7f7] py-[clamp(5rem,7.5vw,10.75rem)] dark:bg-soft"
    aria-labelledby="spotlight-title"
  >
    <div class="flex flex-col items-center gap-6 px-6 text-center">
      <h2 id="spotlight-title" class="display text-[clamp(2.5rem,4vw,4rem)] leading-[1.06]">Meet our speakers</h2>
      <p class="lede -mt-2 max-w-[34rem]">A few of the {{ total || "many" }} people who have taken the stage. A new selection every day.</p>
      <NuxtLink to="/speakers" class="btn btn-quiet">See all speakers</NuxtLink>
    </div>

    <div class="mt-[clamp(3rem,5vw,5rem)]">
      <ul
        ref="rail"
        class="grid auto-cols-[clamp(14rem,22vw,17.5rem)] grid-flow-col gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-[max(1.5rem,calc((100vw_-_76rem)/2))] px-[max(1.5rem,calc((100vw_-_76rem)/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <li v-for="p in people" :key="p.id" class="snap-start">
          <NuxtLink
            :to="`/speakers/${p.id}`"
            class="group flex h-full flex-col rounded-4xl bg-raised px-3 pt-3 pb-5 shadow-[0_2px_2px_rgb(var(--wz-shadow)/0.04),0_7px_3.5px_rgb(var(--wz-shadow)/0.03),0_15px_4.5px_rgb(var(--wz-shadow)/0.02)] transition-transform duration-400 ease-out-soft hover:-translate-y-1"
          >
            <img
              :src="thumb(p.picture, 520)"
              :alt="p.name"
              class="aspect-square w-full rounded-3xl bg-soft object-cover object-top"
              width="260"
              height="260"
              loading="lazy"
              :style="{ viewTransitionName: `speaker-${p.id}` }"
            />
            <span class="mx-2 mt-4 text-[1.25rem] font-semibold tracking-[-0.02em] text-heading group-hover:text-link">{{ p.name }}</span>
            <span v-if="p.role || p.company" class="mx-2 mt-1 text-[0.9375rem] text-muted">{{ [p.role, p.company].filter(Boolean).join(", ") }}</span>
            <span v-if="p.latestTalk" class="mx-2 mt-auto flex gap-1.5 pt-4 text-[0.875rem] leading-[1.35] text-ink">
              <LucideMic :size="14" class="mt-[0.15em] flex-none text-link" aria-hidden="true" />
              {{ p.latestTalk.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="mt-12 flex justify-center gap-2.5">
      <button
        type="button"
        class="grid size-14 place-items-center rounded-full bg-raised text-heading shadow-[0_2px_2px_rgb(var(--wz-shadow)/0.05),0_7px_3.5px_rgb(var(--wz-shadow)/0.04),0_15px_4.5px_rgb(var(--wz-shadow)/0.03),0_27px_5.5px_rgb(var(--wz-shadow)/0.01)] transition-transform duration-200 ease-[ease] hover:-translate-y-px"
        aria-label="Previous speakers"
        @click="scroll(-1)"
      >
        <LucideChevronLeft :size="18" />
      </button>
      <button
        type="button"
        class="grid size-14 place-items-center rounded-full bg-raised text-heading shadow-[0_2px_2px_rgb(var(--wz-shadow)/0.05),0_7px_3.5px_rgb(var(--wz-shadow)/0.04),0_15px_4.5px_rgb(var(--wz-shadow)/0.03),0_27px_5.5px_rgb(var(--wz-shadow)/0.01)] transition-transform duration-200 ease-[ease] hover:-translate-y-px"
        aria-label="More speakers"
        @click="scroll(1)"
      >
        <LucideChevronRight :size="18" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ total?: number }>();

interface Person {
  id: string;
  name: string;
  picture: string;
  role: string;
  company: string;
  talkCount: number;
  latestTalk: { id: string; name: string; date: string | null } | null;
}

const thumb = useThumb();
const { data: people } = await useFetch<Person[]>("/api/spotlight");

const rail = ref<HTMLElement>();
function scroll(direction: number) {
  const el = rail.value;
  if (!el) return;
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
}
</script>
