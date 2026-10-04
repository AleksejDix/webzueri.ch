<template>
  <div>
    <PageHero
      title="About Web Zürich"
      lede="A free evening meetup for people who build the web. Talks, food and conversation in Zürich, since 2016."
    >
      <dl v-if="about" class="facts">
        <NuxtLink v-for="f in facts" :key="f.label" :to="f.to" class="fact">
          <dt class="fact__label">{{ f.label }}</dt>
          <dd class="display fact__value">{{ f.value }}</dd>
        </NuxtLink>
      </dl>
    </PageHero>

    <!-- The community is the people: everyone who has spoken, as one wall of faces -->
    <section v-if="about?.faces.length" class="people" aria-labelledby="people-title">
      <h2 id="people-title" class="display people__title">{{ about.counts.speakers }} people have spoken at Web Zürich</h2>
      <p class="lede people__lede">
        From first-timers to conference regulars. Pick a face to see their talks.
      </p>
      <ul class="wall">
        <li v-for="(p, i) in about.faces" :key="p.id" :style="{ '--i': i }">
          <NuxtLink :to="`/speakers/${p.id}`" class="face" :data-name="p.name">
            <img :src="thumb(p.picture, 128)" :alt="p.name" width="64" height="64" loading="lazy" />
          </NuxtLink>
        </li>
        <li :style="{ '--i': about.faces.length }">
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="face face--you" data-name="You? Submit a talk">
            <LucidePlus :size="26" aria-hidden="true" />
            <span class="sr-only">Submit a talk</span>
          </a>
        </li>
      </ul>
    </section>

    <section v-if="about?.milestones.length" class="story" aria-labelledby="story-title">
      <h2 id="story-title" class="display section-title">{{ about.counts.years }} years, a few moments</h2>
      <ol class="timeline">
        <li v-for="m in about.milestones" :key="m.title" class="moment">
          <span class="moment__date" aria-hidden="true">
            <span class="moment__month">{{ fmt(m.date, { month: "short" }) }}</span>
            <span class="moment__year">{{ fmt(m.date, { year: "numeric" }) }}</span>
          </span>
          <div>
            <h3 class="moment__title">{{ m.title }}</h3>
            <p class="moment__text">
              <span class="sr-only">{{ fmt(m.date, { month: "long", year: "numeric" }) }}: </span>{{ m.text }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section class="evening" aria-labelledby="evening-title">
      <h2 id="evening-title" class="display section-title">How an evening works</h2>
      <ol class="steps">
        <li v-for="s in steps" :key="s.title" class="step">
          <span class="step__icon" aria-hidden="true"><component :is="s.icon" :size="22" /></span>
          <span class="step__when">{{ s.when }}</span>
          <h3 class="step__title">{{ s.title }}</h3>
          <p class="step__text">{{ s.text }}</p>
        </li>
      </ol>
      <p class="evening__note">
        Everyone is welcome, and everyone follows our
        <NuxtLink to="/code-of-conduct" class="text-link">Code of Conduct</NuxtLink>.
      </p>
    </section>

    <section class="join" aria-labelledby="join-title">
      <h2 id="join-title" class="display section-title">Be part of it</h2>
      <ul class="ways">
        <li v-for="w in ways" :key="w.title">
          <component
            :is="w.external ? 'a' : NuxtLink"
            v-bind="w.external ? { href: w.to, target: '_blank', rel: 'noopener' } : { to: w.to }"
            class="way"
            :class="{ 'way--primary': w.primary }"
          >
            <span class="way__icon" aria-hidden="true"><component :is="w.icon" :size="22" /></span>
            <span class="way__title">{{ w.title }}</span>
            <span class="way__text">{{ w.text }}</span>
            <span class="way__cta">
              {{ w.cta }}
              <LucideArrowUpRight v-if="w.external" :size="16" aria-hidden="true" />
              <LucideArrowRight v-else :size="16" aria-hidden="true" />
            </span>
          </component>
        </li>
      </ul>

      <div v-if="about?.founders.length" class="founders">
        <p class="founders__line">Web Zürich is run by volunteers. It was founded by</p>
        <ul class="founders__list">
          <li v-for="f in about.founders" :key="f.id">
            <NuxtLink :to="`/speakers/${f.id}`" class="founder">
              <Avatar :url="f.picture" :name="f.name" :size="56" />
              <span class="founder__name">{{ f.name }}</span>
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
definePageMeta({ alias: ["/team"] });

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
</script>

<style scoped>
/* Numbers that open the pages behind them */
.facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 44rem);
  margin-top: 2.5rem;
}
@media (max-width: 640px) {
  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.fact {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 0.25rem;
  padding: 1.25rem 0.5rem 1rem;
  border-radius: 1.5rem;
  background: #fff;
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s;
}
.fact:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px -16px rgb(0 12 31 / 0.3);
}
.fact__value {
  font-size: clamp(2.25rem, 3.6vw, 3.25rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.fact:hover .fact__value {
  color: var(--color-zh-blue);
}
.fact__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}

.section-title {
  font-size: clamp(2.25rem, 4vw, 4rem);
  line-height: 1.05;
  text-align: center;
  text-wrap: balance;
}

/* Wall of faces */
.people {
  max-width: 78rem;
  margin: clamp(5rem, 9vw, 8rem) auto 0;
  padding-inline: 1rem;
  text-align: center;
}
.people__title {
  max-width: 50rem;
  margin-inline: auto;
  font-size: clamp(2.25rem, 4vw, 4rem);
  line-height: 1.05;
  text-wrap: balance;
}
.people__lede {
  max-width: 34rem;
  margin: 1rem auto 0;
}
.wall {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
.wall > li {
  /* One orchestrated moment: the faces arrive in a quick wave */
  animation: face-in 0.6s var(--ease-out-soft) both;
  animation-delay: calc(min(var(--i), 200) * 6ms);
}
@keyframes face-in {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}
.face {
  position: relative;
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  transition: transform 0.3s var(--ease-out-soft), box-shadow 0.3s;
}
.face img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}
.face:hover,
.face:focus-visible {
  z-index: 2;
  transform: scale(1.25);
  box-shadow: 0 0 0 3px #fff, 0 10px 20px -8px rgb(0 12 31 / 0.4);
}
.face::after {
  content: attr(data-name);
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  background: var(--color-zh-navy);
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
.face--you {
  background: var(--color-zh-blue);
  color: #fff;
}
.face--you:hover {
  background: var(--color-zh-blue-hover);
}

/* Timeline */
.story {
  max-width: 44rem;
  margin: clamp(6rem, 10vw, 9rem) auto 0;
  padding-inline: 1rem;
}
.timeline {
  position: relative;
  display: grid;
  gap: 1.75rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
/* The line that joins the moments, behind the date tiles */
.timeline::before {
  content: "";
  position: absolute;
  top: 2rem;
  bottom: 2rem;
  left: calc(2.375rem - 1px);
  width: 2px;
  border-radius: 2px;
  background: var(--color-zh-line);
}
.moment {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 1.5rem;
}
.moment__date {
  display: grid;
  place-items: center;
  align-content: center;
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 1.375rem;
  background: var(--color-zh-blue);
  color: #fff;
  line-height: 1;
  box-shadow: 0 0 0 6px #fff;
}
.moment__month {
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(255 255 255 / 0.85);
}
.moment__year {
  margin-top: 0.3rem;
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}
.moment__title {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
}
.moment__text {
  margin-top: 0.25rem;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--color-zh-muted);
}

/* Evening */
.evening {
  max-width: 78rem;
  margin: clamp(6rem, 10vw, 9rem) auto 0;
  padding-inline: 1rem;
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
  background: var(--color-zh-soft);
}
.step__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  background: #fff;
  color: var(--color-zh-blue);
}
.step__when {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-blue);
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
.evening__note {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--color-zh-muted);
}

/* Ways to join */
.join {
  max-width: 78rem;
  margin: clamp(6rem, 10vw, 9rem) auto 0;
  padding: 0 1rem clamp(5rem, 8vw, 8rem);
}
.ways {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
.ways > li {
  display: flex;
}
.way {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 1.75rem;
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07), 0 1px 2px rgb(0 12 31 / 0.04), 0 8px 24px -16px rgb(0 12 31 / 0.18);
  transition: transform 0.4s var(--ease-out-soft), box-shadow 0.4s, background-color 0.3s;
}
.way:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgb(0 12 31 / 0.08),
    0 1px 2px rgb(0 12 31 / 0.05),
    0 14px 28px -14px rgb(0 12 31 / 0.28);
}
.way:focus-visible {
  border-radius: 1.75rem;
}
.way__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  background: rgb(0 112 180 / 0.1);
  color: var(--color-zh-blue);
}
.way__title {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-zh-navy);
}
.way__text {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-zh-muted);
}
.way__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.way__cta svg {
  transition: transform 0.3s var(--ease-out-soft);
}
.way:hover .way__cta svg {
  transform: translateX(3px);
}
/* The main invitation, in Zürich blue */
.way--primary {
  background: var(--color-zh-blue);
  box-shadow: none;
}
.way--primary:hover {
  background: var(--color-zh-blue-hover);
}
.way--primary .way__icon {
  background: rgb(255 255 255 / 0.15);
  color: #fff;
}
.way--primary .way__title,
.way--primary .way__cta {
  color: #fff;
}
.way--primary .way__text {
  color: rgb(255 255 255 / 0.85);
}

.founders {
  margin-top: clamp(4rem, 7vw, 6rem);
  text-align: center;
}
.founders__line {
  color: var(--color-zh-muted);
}
.founders__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.founder {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.375rem 1.25rem 0.375rem 0.375rem;
  border-radius: 999px;
  box-shadow: 0 0 0 1px rgb(0 12 31 / 0.07);
  transition: background-color 0.2s, box-shadow 0.2s;
}
.founder:hover {
  background: var(--color-zh-soft);
  box-shadow: 0 0 0 1px transparent;
}
.founder__name {
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.founder:hover .founder__name {
  color: var(--color-zh-blue);
}
</style>
