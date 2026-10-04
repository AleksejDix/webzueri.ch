<template>
  <div>
    <PageHero
      title="Code of Conduct"
      lede="Web Zürich is for everyone. These are the standards we hold ourselves to at meetups and in our online channels."
    >
      <a href="#enforcement" class="btn btn-primary hero-report">
        <LucideLifeBuoy :size="16" aria-hidden="true" /> Report a problem
      </a>
    </PageHero>

    <div class="coc">
      <!-- The pledge, said once and big -->
      <section id="our-pledge" class="pledge" aria-labelledby="pledge-title">
        <h2 id="pledge-title" class="sr-only">Our pledge</h2>
        <p class="display pledge__text">
          We pledge to make taking part in Web Zürich a harassment-free experience for everyone.
        </p>
        <p class="pledge__who">Regardless of</p>
        <ul class="pledge__list">
          <li v-for="w in regardless" :key="w">{{ w }}</li>
        </ul>
      </section>

      <section id="our-standards" class="standards" aria-labelledby="standards-title">
        <h2 id="standards-title" class="display section-title">Our standards</h2>
        <div class="columns">
          <div class="column column--do">
            <h3 class="column__title">What we expect</h3>
            <ul class="column__list">
              <li v-for="item in expected" :key="item">
                <span class="mark mark--do" aria-hidden="true"><LucideCheck :size="16" :stroke-width="3" /></span>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="column column--dont">
            <h3 class="column__title">What's not okay</h3>
            <ul class="column__list">
              <li v-for="item in unacceptable" :key="item">
                <span class="mark mark--dont" aria-hidden="true"><LucideX :size="16" :stroke-width="3" /></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="scope" class="scope" aria-labelledby="scope-title">
        <h2 id="scope-title" class="display section-title">Where it applies</h2>
        <ul class="places">
          <li v-for="p in places" :key="p.title" class="place">
            <span class="place__icon" aria-hidden="true"><component :is="p.icon" :size="22" /></span>
            <h3 class="place__title">{{ p.title }}</h3>
            <p class="place__text">{{ p.text }}</p>
          </li>
        </ul>
      </section>

      <!-- The part people come here for when something has gone wrong -->
      <section id="enforcement" class="report" aria-labelledby="report-title">
        <div class="report__intro">
          <h2 id="report-title" class="display report__title">Something happened?</h2>
          <p class="report__lede">
            Tell us about abusive, harassing or otherwise unacceptable behaviour. Every report is reviewed and
            investigated, and we keep the name of the person who reported it confidential.
          </p>
        </div>
        <ul class="channels">
          <li v-for="c in channels" :key="c.title">
            <component :is="c.href ? 'a' : 'div'" v-bind="c.href ? { href: c.href, target: c.external ? '_blank' : undefined, rel: c.external ? 'noopener' : undefined } : {}" class="channel">
              <span class="channel__icon" aria-hidden="true"><component :is="c.icon" :size="20" /></span>
              <span>
                <span class="channel__title">{{ c.title }}</span>
                <span class="channel__text">{{ c.text }}</span>
              </span>
            </component>
          </li>
        </ul>
      </section>

      <section id="our-responsibilities" class="next" aria-labelledby="next-title">
        <h2 id="next-title" class="display section-title">What happens next</h2>
        <ol class="steps">
          <li v-for="(s, i) in steps" :key="s.title" class="step">
            <span class="step__n" aria-hidden="true">{{ i + 1 }}</span>
            <h3 class="step__title">{{ s.title }}</h3>
            <p class="step__text">{{ s.text }}</p>
          </li>
        </ol>
        <p class="next__note">
          Organisers who don't follow or enforce this Code of Conduct in good faith can face the same consequences, decided
          by the rest of the organising team.
        </p>
      </section>

      <p id="attribution" class="attribution">
        Adapted from the
        <a href="https://www.contributor-covenant.org/version/1/4/code-of-conduct/" target="_blank" rel="noopener" class="text-link">Contributor Covenant, version 1.4</a>.
        For advertising and job posts, see our
        <NuxtLink to="/advertising-rules" class="text-link">advertising rules</NuxtLink>.
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
</script>

<style scoped>
.hero-report {
  margin-top: 2rem;
}

.coc {
  max-width: 78rem;
  margin: 0 auto;
  padding: 0 1rem clamp(5rem, 8vw, 8rem);
}
.section-title {
  font-size: clamp(2.25rem, 4vw, 4rem);
  line-height: 1.05;
  text-align: center;
  text-wrap: balance;
}

/* Pledge */
.pledge {
  max-width: 56rem;
  margin: clamp(4rem, 8vw, 7rem) auto 0;
  text-align: center;
}
.pledge__text {
  font-size: clamp(2rem, 3.8vw, 3.5rem);
  line-height: 1.1;
  text-wrap: balance;
}
.pledge__who {
  margin-top: 2rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}
.pledge__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.pledge__list li {
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-zh-navy);
}

/* Standards */
.standards {
  margin-top: clamp(6rem, 10vw, 9rem);
}
.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: 1rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
.column {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border-radius: 2rem;
}
.column--do {
  background: var(--color-zh-blue);
  color: #fff;
}
.column--dont {
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.08), 0 8px 24px -16px rgb(0 12 31 / 0.18);
}
.column__title {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}
.column--dont .column__title {
  color: var(--color-zh-navy);
}
.column__list {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}
.column__list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 0.875rem;
  font-size: 1.0625rem;
  line-height: 1.5;
}
.column--dont .column__list li {
  color: var(--color-zh-ink);
}
.mark {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
}
.mark--do {
  background: #fff;
  color: var(--color-zh-blue);
}
.mark--dont {
  background: var(--color-zh-navy);
  color: #fff;
}

/* Scope */
.scope {
  margin-top: clamp(6rem, 10vw, 9rem);
}
.places {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
.place {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.75rem;
  border-radius: 1.75rem;
  background: var(--color-zh-soft);
}
.place__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  background: #fff;
  color: var(--color-zh-blue);
}
.place__title {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
}
.place__text {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-zh-muted);
}

/* Report: navy so it stands apart from everything else on the page */
.report {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
  align-items: center;
  gap: 2rem clamp(2rem, 5vw, 4rem);
  margin-top: clamp(6rem, 10vw, 9rem);
  padding: clamp(2rem, 4.5vw, 4rem);
  border-radius: var(--radius-frame);
  background: var(--color-zh-navy);
  color: #fff;
  scroll-margin-top: 1.5rem;
}
.report__title {
  font-size: clamp(2.25rem, 4vw, 3.75rem);
  line-height: 1.05;
  color: #fff;
}
.report__lede {
  max-width: 30rem;
  margin-top: 1rem;
  font-size: 1.0625rem;
  line-height: 1.55;
  color: rgb(255 255 255 / 0.8);
}
.channels {
  display: grid;
  gap: 0.5rem;
}
.channel {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  background: rgb(255 255 255 / 0.07);
  transition: background-color 0.2s;
}
a.channel:hover {
  background: rgb(255 255 255 / 0.14);
}
.channel:focus-visible {
  outline-color: #fff;
  border-radius: 1.25rem;
}
.channel__icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  background: var(--color-zh-blue);
  color: #fff;
}
.channel > span:last-child {
  display: grid;
  gap: 0.125rem;
}
.channel__title {
  font-weight: 600;
}
.channel__text {
  font-size: 0.875rem;
  color: rgb(255 255 255 / 0.7);
}

/* What happens next: a real sequence, so it's numbered */
.next {
  margin-top: clamp(6rem, 10vw, 9rem);
}
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
.step {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.75rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 8px 24px -16px rgb(0 12 31 / 0.18);
}
.step__n {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  background: var(--color-zh-blue);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
}
.step__title {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
}
.step__text {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-zh-muted);
}
.next__note {
  max-width: 40rem;
  margin: 1.5rem auto 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  text-align: center;
  color: var(--color-zh-muted);
}

.attribution {
  max-width: 40rem;
  margin: clamp(4rem, 7vw, 6rem) auto 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  text-align: center;
  color: var(--color-zh-muted);
}
</style>
