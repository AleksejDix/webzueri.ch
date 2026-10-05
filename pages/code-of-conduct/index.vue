<template>
  <div>
    <PageHero
      title="Code of Conduct"
      lede="Web Zürich is for everyone. These are the standards we hold ourselves to at meetups and in our online channels."
    >
      <a href="#enforcement" class="btn btn-primary mt-8">
        <LucideLifeBuoy :size="16" aria-hidden="true" /> Report a problem
      </a>
    </PageHero>

    <div class="mx-auto max-w-[78rem] px-4 pb-[clamp(5rem,8vw,8rem)]">
      <!-- The pledge, said once and big -->
      <section id="our-pledge" class="mx-auto mt-[clamp(4rem,8vw,7rem)] max-w-4xl text-center" aria-labelledby="pledge-title">
        <h2 id="pledge-title" class="sr-only">Our pledge</h2>
        <p class="display text-[clamp(2rem,3.8vw,3.5rem)] leading-[1.1]">
          We pledge to make taking part in Web Zürich a harassment-free experience for everyone.
        </p>
        <p class="mt-8 font-semibold text-muted">Regardless of</p>
        <ul class="mt-4 flex flex-wrap justify-center gap-2">
          <li
            v-for="w in regardless"
            :key="w"
            class="rounded-full bg-soft px-3.5 py-1.5 text-[0.9375rem] font-medium text-heading"
          >{{ w }}</li>
        </ul>
      </section>

      <section id="our-standards" class="mt-[clamp(6rem,10vw,9rem)]" aria-labelledby="standards-title">
        <h2 id="standards-title" class="display text-center text-[clamp(2.25rem,4vw,4rem)] leading-[1.05]">Our standards</h2>
        <div class="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-4">
          <div class="rounded-4xl bg-accent p-[clamp(1.5rem,3vw,2.5rem)] text-white">
            <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em]">What we expect</h3>
            <ul class="mt-6 grid gap-4">
              <li
                v-for="item in expected"
                :key="item"
                class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 text-[1.0625rem] leading-normal"
              >
                <span class="grid size-7 place-items-center rounded-full bg-raised text-link" aria-hidden="true"><LucideCheck :size="16" :stroke-width="3" /></span>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="rounded-4xl bg-raised p-[clamp(1.5rem,3vw,2.5rem)] shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.08),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)]">
            <h3 class="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-heading">What's not okay</h3>
            <ul class="mt-6 grid gap-4">
              <li
                v-for="item in unacceptable"
                :key="item"
                class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 text-[1.0625rem] leading-normal text-ink"
              >
                <span class="grid size-7 place-items-center rounded-full bg-deep text-white" aria-hidden="true"><LucideX :size="16" :stroke-width="3" /></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="scope" class="mt-[clamp(6rem,10vw,9rem)]" aria-labelledby="scope-title">
        <h2 id="scope-title" class="display text-center text-[clamp(2.25rem,4vw,4rem)] leading-[1.05]">Where it applies</h2>
        <ul class="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4">
          <li v-for="p in places" :key="p.title" class="flex flex-col gap-2 rounded-[1.75rem] bg-soft p-7">
            <span class="mb-2 grid size-12 place-items-center rounded-2xl bg-raised text-link" aria-hidden="true"><component :is="p.icon" :size="22" /></span>
            <h3 class="text-[1.375rem] font-semibold tracking-[-0.015em] text-heading">{{ p.title }}</h3>
            <p class="text-[0.9375rem] leading-[1.55] text-muted">{{ p.text }}</p>
          </li>
        </ul>
      </section>

      <!-- The part people come here for when something has gone wrong.
           Navy so it stands apart from everything else on the page -->
      <section
        id="enforcement"
        class="mt-[clamp(6rem,10vw,9rem)] grid scroll-mt-6 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-center gap-x-[clamp(2rem,5vw,4rem)] gap-y-8 rounded-frame bg-deep p-[clamp(2rem,4.5vw,4rem)] text-white"
        aria-labelledby="report-title"
      >
        <div>
          <h2 id="report-title" class="display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] text-white">Something happened?</h2>
          <p class="mt-4 max-w-[30rem] text-[1.0625rem] leading-[1.55] text-[rgb(255_255_255/0.8)]">
            Tell us about abusive, harassing or otherwise unacceptable behaviour. Every report is reviewed and
            investigated, and we keep the name of the person who reported it confidential.
          </p>
        </div>
        <ul class="grid gap-2">
          <li v-for="c in channels" :key="c.title">
            <component :is="c.href ? 'a' : 'div'" v-bind="c.href ? { href: c.href, target: c.external ? '_blank' : undefined, rel: c.external ? 'noopener' : undefined } : {}" class="flex items-center gap-4 rounded-[1.25rem] bg-[rgb(255_255_255/0.07)] px-5 py-4 [transition:background-color_0.2s] focus-visible:outline-white [a&:hover]:bg-[rgb(255_255_255/0.14)]">
              <span class="grid size-11 flex-none place-items-center rounded-[0.875rem] bg-accent text-white" aria-hidden="true"><component :is="c.icon" :size="20" /></span>
              <span class="grid gap-0.5">
                <span class="font-semibold">{{ c.title }}</span>
                <span class="text-[0.875rem] text-[rgb(255_255_255/0.7)]">{{ c.text }}</span>
              </span>
            </component>
          </li>
        </ul>
      </section>

      <!-- What happens next: a real sequence, so it's numbered -->
      <section id="our-responsibilities" class="mt-[clamp(6rem,10vw,9rem)]" aria-labelledby="next-title">
        <h2 id="next-title" class="display text-center text-[clamp(2.25rem,4vw,4rem)] leading-[1.05]">What happens next</h2>
        <ol class="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4">
          <li
            v-for="(s, i) in steps"
            :key="s.title"
            class="flex flex-col gap-2 rounded-[1.75rem] bg-raised p-7 shadow-[0_0_0_1px_rgb(var(--wz-shadow)/0.07),0_8px_24px_-16px_rgb(var(--wz-shadow)/0.18)]"
          >
            <span class="mb-2 grid size-12 place-items-center rounded-2xl bg-accent text-[1.25rem] font-semibold text-white" aria-hidden="true">{{ i + 1 }}</span>
            <h3 class="text-[1.375rem] font-semibold tracking-[-0.015em] text-heading">{{ s.title }}</h3>
            <p class="text-[0.9375rem] leading-[1.55] text-muted">{{ s.text }}</p>
          </li>
        </ol>
        <p class="mx-auto mt-6 max-w-[40rem] text-center text-[0.9375rem] leading-[1.55] text-muted">
          Organisers who don't follow or enforce this Code of Conduct in good faith can face the same consequences, decided
          by the rest of the organising team.
        </p>
      </section>

      <p id="attribution" class="mx-auto mt-[clamp(4rem,7vw,6rem)] max-w-[40rem] text-center text-[0.9375rem] leading-[1.6] text-muted">
        Adapted from the
        <a href="https://www.contributor-covenant.org/version/1/4/code-of-conduct/" target="_blank" rel="noopener" class="inline-link">Contributor Covenant, version 1.4</a>.
        For advertising and job posts, see our
        <NuxtLink to="/advertising-rules" class="inline-link">advertising rules</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AtSign, CalendarDays, Mail, MessagesSquare, Mic, UserRound } from "lucide-vue-next";
import PageHero from "~/components/PageHero.vue";
import { MEETUP_URL } from "~/composables/useSiteSearch";
import { SPONSOR_EMAIL } from "~/utils/sponsoring";

const regardless = [
  "age",
  "body size",
  "disability",
  "ethnicity",
  "sex characteristics",
  "gender identity and expression",
  "level of experience",
  "education",
  "socio-economic status",
  "nationality",
  "personal appearance",
  "race",
  "religion",
  "sexual identity and orientation",
];

const expected = [
  "Use welcoming and inclusive language",
  "Respect differing viewpoints and experiences",
  "Accept constructive criticism gracefully",
  "Focus on what is best for the community",
  "Show empathy towards other community members",
];

const unacceptable = [
  "Sexualised language or imagery, and unwelcome sexual attention or advances",
  "Trolling, insulting or derogatory comments, and personal or political attacks",
  "Public or private harassment",
  "Publishing someone's private information, such as a physical or email address, without their explicit permission",
  "Other conduct that could reasonably be considered inappropriate in a professional setting",
];

const places = [
  {
    icon: CalendarDays,
    title: "At our meetups",
    text: "From the moment you arrive until you leave: the talks, the food and the conversations.",
  },
  {
    icon: MessagesSquare,
    title: "In our online channels",
    text: "On Meetup, WhatsApp, Slack and social media, in public posts and private messages alike.",
  },
  {
    icon: Mic,
    title: "When representing us",
    text: "Organisers, speakers and hosts acting for Web Zürich, online or offline.",
  },
];

const channels = [
  {
    icon: UserRound,
    title: "Talk to an organiser at the venue",
    text: "Find one of us during the evening. We'll step aside and listen.",
  },
  {
    icon: Mail,
    title: SPONSOR_EMAIL,
    text: "Write to us any time, also after the event.",
    href: `mailto:${SPONSOR_EMAIL}`,
  },
  {
    icon: CalendarDays,
    title: "Message us on Meetup",
    text: "Send the organisers a private message on the group page.",
    href: MEETUP_URL,
    external: true,
  },
  {
    icon: AtSign,
    title: "Message us on Twitter",
    text: "Send a direct message to @webzuerich.",
    href: "https://twitter.com/webzuerich",
    external: true,
  },
];

const steps = [
  {
    title: "We listen",
    text: "An organiser reviews every report and asks what you need. Your name stays confidential.",
  },
  {
    title: "We look into it",
    text: "We investigate what happened and decide on a response that fits the situation.",
  },
  {
    title: "We act",
    text: "From a warning to removing posts or messages, up to banning someone from our events and channels, temporarily or for good.",
  },
];

useHead({ title: "Code of Conduct" });
useSeoMeta({
  description: "Web Zürich's Code of Conduct: the standards we hold ourselves to at meetups and online, and how to report a problem.",
});
defineOgImage("Page", {
  title: "Code of Conduct",
  description: "The standards we hold ourselves to at meetups and online, and how to report a problem.",
});
</script>
