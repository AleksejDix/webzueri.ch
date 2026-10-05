<template>
  <div>
    <PageHero
      title="About Web Zürich"
      lede="A free evening meetup for people who build the web. Talks, food and conversation in Zürich, since 2016."
    >
      <!-- Numbers that open the pages behind them -->
      <dl v-if="about" class="mt-10 grid w-[min(100%,44rem)] grid-cols-4 gap-2 [@media(max-width:640px)]:grid-cols-2">
        <NuxtLink
          v-for="f in facts"
          :key="f.label"
          :to="f.to"
          class="group flex flex-col-reverse items-center gap-1 rounded-3xl bg-raised px-2 pt-5 pb-4 [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s] hover:-translate-y-[3px] hover:shadow-[0_14px_28px_-16px_rgb(var(--wz-shadow)/0.3)]"
        >
          <dt class="text-[0.875rem] font-semibold text-muted">{{ f.label }}</dt>
          <dd class="display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none text-heading tabular-nums transition-colors duration-200 ease-[ease] group-hover:text-link">
            {{ f.value }}
          </dd>
        </NuxtLink>
      </dl>
    </PageHero>

    <!-- The community is the people: everyone who has spoken, as one wall of faces -->
    <section v-if="about?.faces.length" class="mx-auto mt-[clamp(5rem,9vw,8rem)] max-w-312 px-4 text-center" aria-labelledby="people-title">
      <h2 id="people-title" class="display mx-auto max-w-200 text-[clamp(2.25rem,4vw,4rem)] leading-[1.05] text-balance">
        {{ about.counts.speakers }} people have spoken at Web Zürich
      </h2>
      <p class="lede mx-auto mt-4 max-w-136">
        From first-timers to conference regulars. Pick a face to see their talks.
      </p>
      <ul class="wall mt-[clamp(2.5rem,4vw,3.5rem)] flex flex-wrap justify-center gap-2">
        <li v-for="(p, i) in about.faces" :key="p.id" :style="{ '--i': i }">
          <NuxtLink
            :to="`/speakers/${p.id}`"
            class="face relative grid size-16 place-items-center rounded-full bg-soft [transition:scale_0.3s_var(--ease-out-soft),box-shadow_0.3s] hover:z-2 hover:scale-125 hover:shadow-[0_0_0_3px_var(--wz-page),0_10px_20px_-8px_rgb(var(--wz-shadow)/0.4)] focus-visible:z-2 focus-visible:scale-125 focus-visible:shadow-[0_0_0_3px_var(--wz-page),0_10px_20px_-8px_rgb(var(--wz-shadow)/0.4)]"
            :data-name="p.name"
          >
            <img :src="thumb(p.picture, 128)" :alt="p.name" width="64" height="64" loading="lazy" class="size-full rounded-[inherit] object-cover" />
          </NuxtLink>
        </li>
        <li :style="{ '--i': about.faces.length }">
          <a
            :href="SUBMIT_TALK_URL"
            target="_blank"
            rel="noopener"
            class="face relative grid size-16 place-items-center rounded-full bg-accent text-white [transition:scale_0.3s_var(--ease-out-soft),box-shadow_0.3s] hover:z-2 hover:scale-125 hover:bg-accent-hover hover:shadow-[0_0_0_3px_var(--wz-page),0_10px_20px_-8px_rgb(var(--wz-shadow)/0.4)] focus-visible:z-2 focus-visible:scale-125 focus-visible:shadow-[0_0_0_3px_var(--wz-page),0_10px_20px_-8px_rgb(var(--wz-shadow)/0.4)]"
            data-name="You? Submit a talk"
          >
            <LucidePlus :size="26" aria-hidden="true" />
            <span class="sr-only">Submit a talk</span>
          </a>
        </li>
      </ul>
    </section>

    <section v-if="about?.milestones.length" class="mx-auto mt-[clamp(6rem,10vw,9rem)] max-w-176 px-4" aria-labelledby="story-title">
      <h2 id="story-title" class="display text-center text-[clamp(2.25rem,4vw,4rem)] leading-[1.05] text-balance">{{ about.counts.years }} years, a few moments</h2>
      <!-- ::before is the line that joins the moments, behind the date tiles -->
      <ol
        class="relative mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-7 before:absolute before:inset-y-8 before:left-[calc(2.375rem-1px)] before:w-0.5 before:rounded-xs before:bg-line"
      >
        <li v-for="m in about.milestones" :key="m.title" class="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6">
          <span
            class="grid size-19 place-items-center content-center rounded-[1.375rem] bg-accent leading-none text-white shadow-[0_0_0_6px_var(--wz-page)]"
            aria-hidden="true"
          >
            <span class="text-[0.8125rem] font-semibold text-[rgb(255_255_255/0.85)]">{{ fmt(m.date, { month: "short" }) }}</span>
            <span class="mt-[0.3rem] text-[1.375rem] font-semibold tracking-[-0.03em]">{{ fmt(m.date, { year: "numeric" }) }}</span>
          </span>
          <div>
            <h3 class="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-[-0.015em] text-heading">{{ m.title }}</h3>
            <p class="mt-1 text-[1rem] leading-[1.55] text-muted">
              <span class="sr-only">{{ fmt(m.date, { month: "long", year: "numeric" }) }}: </span>{{ m.text }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mx-auto mt-[clamp(6rem,10vw,9rem)] max-w-312 px-4" aria-labelledby="evening-title">
      <h2 id="evening-title" class="display text-center text-[clamp(2.25rem,4vw,4rem)] leading-[1.05] text-balance">How an evening works</h2>
      <ol class="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4">
        <li v-for="s in steps" :key="s.title" class="flex flex-col gap-2 rounded-tile bg-soft p-7">
          <span class="mb-2 grid size-12 place-items-center rounded-2xl bg-raised text-link" aria-hidden="true"><component :is="s.icon" :size="22" /></span>
          <span class="text-[0.875rem] font-semibold text-link">{{ s.when }}</span>
          <h3 class="text-[1.375rem] font-semibold tracking-[-0.015em] text-heading">{{ s.title }}</h3>
          <p class="text-[0.9375rem] leading-[1.55] text-muted">{{ s.text }}</p>
        </li>
      </ol>
      <p class="mt-6 text-center text-muted">
        Everyone is welcome, and everyone follows our
        <NuxtLink to="/code-of-conduct" class="inline-link">Code of Conduct</NuxtLink>.
      </p>
    </section>

    <section class="mx-auto mt-[clamp(6rem,10vw,9rem)] max-w-312 px-4 pb-[clamp(5rem,8vw,8rem)]" aria-labelledby="join-title">
      <h2 id="join-title" class="display text-center text-[clamp(2.25rem,4vw,4rem)] leading-[1.05] text-balance">Be part of it</h2>
      <ul class="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4">
        <li v-for="w in ways" :key="w.title" class="flex">
          <!-- The main invitation, in Zürich blue -->
          <component
            :is="w.external ? 'a' : NuxtLink"
            v-bind="w.external ? { href: w.to, target: '_blank', rel: 'noopener' } : { to: w.to }"
            class="group flex w-full flex-col gap-2 rounded-tile p-7 [transition:translate_0.4s_var(--ease-out-soft),box-shadow_0.4s,background-color_0.3s] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08),0_1px_2px_rgb(var(--wz-shadow)/0.05),0_14px_28px_-14px_rgb(var(--wz-shadow)/0.28)]"
            :class="w.primary ? 'bg-accent hover:bg-accent-hover' : 'bg-raised shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_1px_2px_rgb(var(--wz-shadow)/0.04),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)]'"
          >
            <span
              class="mb-2 grid size-12 place-items-center rounded-2xl"
              :class="w.primary ? 'bg-[rgb(255_255_255/0.15)] text-white' : 'bg-accent/10 text-link'"
              aria-hidden="true"
            >
              <component :is="w.icon" :size="22" />
            </span>
            <span class="text-[1.375rem] font-semibold tracking-[-0.015em]" :class="w.primary ? 'text-white' : 'text-heading'">{{ w.title }}</span>
            <span class="text-[0.9375rem] leading-[1.55]" :class="w.primary ? 'text-[rgb(255_255_255/0.85)]' : 'text-muted'">{{ w.text }}</span>
            <span class="mt-auto inline-flex items-center gap-1 pt-4 text-[0.9375rem] font-semibold" :class="w.primary ? 'text-white' : 'text-link'">
              {{ w.cta }}
              <LucideArrowUpRight
                v-if="w.external"
                :size="16"
                class="transition-transform duration-300 ease-out-soft group-hover:translate-x-[3px]"
                aria-hidden="true"
              />
              <LucideArrowRight v-else :size="16" class="transition-transform duration-300 ease-out-soft group-hover:translate-x-[3px]" aria-hidden="true" />
            </span>
          </component>
        </li>
      </ul>

      <div v-if="about?.founders.length" class="mt-[clamp(4rem,7vw,6rem)] text-center">
        <p class="text-muted">Web Zürich is run by volunteers. It was founded by</p>
        <ul class="mt-4 flex flex-wrap justify-center gap-2">
          <li v-for="f in about.founders" :key="f.id">
            <NuxtLink
              :to="`/speakers/${f.id}`"
              class="group flex items-center gap-3.5 rounded-full py-1.5 pr-5 pl-1.5 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07)] transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-soft hover:shadow-[0_0_0_1px_transparent]"
            >
              <Avatar :url="f.picture" :name="f.name" :size="56" />
              <span class="font-semibold text-heading transition-colors duration-200 ease-[ease] group-hover:text-link">{{ f.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NuxtLink } from "#components";
import { CalendarDays, DoorOpen, HandHeart, Mic, Users, UtensilsCrossed } from "lucide-vue-next";
import PageHero from "~/components/PageHero.vue";
import Avatar from "~/components/Avatar.vue";
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/composables/useSiteSearch";

// /team was a page on the old site; keep the URL alive

const { data: about } = await useFetch("/api/about");
const thumb = useThumb();

const facts = computed(() => {
  const c = about.value!.counts;
  return [
    { label: "Meetups", value: c.meetups, to: "/events" },
    { label: "Talks", value: c.talks, to: "/talks" },
    { label: "Recordings", value: c.recordings, to: "/talks?recored=true" },
    { label: "Sponsors", value: c.sponsors, to: "/sponsors" },
  ];
});

const steps = [
  {
    icon: DoorOpen,
    when: "18:30",
    title: "Doors open",
    text: "Grab a drink, find a seat and say hello. Coming alone is completely normal.",
  },
  {
    icon: Mic,
    when: "Then",
    title: "Talks",
    text: "A few talks from people in the community, from first-timers to people who speak at conferences.",
  },
  {
    icon: UtensilsCrossed,
    when: "Afterwards",
    title: "Food and conversation",
    text: "Our sponsors cover food, drinks and the venue, so the evening stays free for everyone.",
  },
];

const ways = [
  {
    icon: CalendarDays,
    title: "Come along",
    text: "Join the group on Meetup to hear about the next evening and save your seat.",
    cta: "Join on Meetup",
    to: MEETUP_URL,
    external: true,
    primary: true,
  },
  {
    icon: Mic,
    title: "Give a talk",
    text: "Share something you built, learned or broke. First talks are welcome.",
    cta: "Submit a talk",
    to: SUBMIT_TALK_URL,
    external: true,
  },
  {
    icon: HandHeart,
    title: "Support an evening",
    text: "Host us, or cover the food or the cleanup, and get a few minutes on stage.",
    cta: "See how",
    to: "/sponsors#support",
  },
  {
    icon: Users,
    title: "Find more groups",
    text: "Web Zürich is one evening a month. Other communities fill the rest of the calendar.",
    cta: "Browse communities",
    to: "/communities",
  },
];

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

useHead({ title: "About" });
useSeoMeta({
  description: "Web Zürich is a free, volunteer-run meetup for people who build for the web, held in Zürich since 2016. Meet the organisers and find out how to take part.",
});
defineOgImage("Page", {
  kicker: "About Web Zürich",
  title: "A free meetup for people who build the web",
  description: "Run by volunteers in Zürich since 2016. Come to a meetup, give a talk or host an evening.",
});
</script>

<style scoped>
/* One orchestrated moment: the faces arrive in a quick wave. Scoped keyframe names are rewritten by Vue, so this stays here */
.wall > li {
  animation: face-in 0.6s var(--ease-out-soft) both;
  animation-delay: calc(min(var(--i), 200) * 6ms);
}
@keyframes face-in {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}

/* The name as a tooltip */
.face::after {
  content: attr(data-name);
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  background: var(--wz-deep);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 0.25rem);
  transition: opacity 0.2s, transform 0.2s;
}
.face:hover::after,
.face:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
