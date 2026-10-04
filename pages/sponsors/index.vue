<template>
  <div>
    <PageHero
      title="Sponsors"
      lede="Web Zürich is free to attend because companies host us, feed us and clean up afterwards. Thank you to every one of them."
    >
      <!-- This year's sponsors, front and centre -->
      <ul v-if="current.length" class="hero-logos" aria-label="Sponsors this year">
        <li v-for="s in current" :key="s.id">
          <a :href="s.website" target="_blank" rel="noopener" class="hero-logo" :title="s.name">
            <SponsorLogo :src="s.logo!.url" :alt="s.name" :area="5200" :max-width="190" />
          </a>
        </li>
      </ul>
      <div class="hero-actions">
        <a href="#support" class="btn btn-ink">Support an evening</a>
        <a :href="`mailto:${SPONSOR_EMAIL}`" class="btn btn-quiet">{{ SPONSOR_EMAIL }}</a>
      </div>
    </PageHero>

    <section v-if="sponsors.length" class="group" aria-labelledby="timeline-title">
      <h2 id="timeline-title" class="heading group__title">Every evening they made possible</h2>
      <p class="group__lede">
        {{ sponsors.length }} companies have supported {{ sponsoredMeetups }} meetups since {{ since }}. One dot is one meetup.
      </p>
      <SponsorTimeline :rows="sponsors" :recent-from="oneYearAgo" class="mt-10" />
    </section>

    <section id="support" class="support" aria-labelledby="support-title">
      <div class="support__head">
        <h2 id="support-title" class="display support__title">Support an evening</h2>
        <p class="lede support__lede">
          Pick one part of a meetup to cover. Each one includes a speaking slot for your company.
        </p>
      </div>
      <ul class="prices">
        <li v-for="p in SPONSOR_PRICES" :key="p.name" class="price">
          <span class="price__name">{{ p.short }}</span>
          <span class="price__amount">{{ p.price }}</span>
          <span class="price__covers">{{ p.covers }}</span>
          <span class="price__perk"><LucideMic :size="14" aria-hidden="true" /> Includes a speaking slot</span>
        </li>
      </ul>
      <p class="support__foot">
        Write to <a :href="`mailto:${SPONSOR_EMAIL}`" class="text-link">{{ SPONSOR_EMAIL }}</a> to book a date.
        What sponsors get, and what they can't do, is in our <NuxtLink to="/advertising-rules" class="text-link">advertising rules</NuxtLink>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import sponsorsQuery from "~/services/apollo/queries/sponsors.gql";
import PageHero from "~/components/PageHero.vue";
import SponsorTimeline from "~/components/SponsorTimeline.vue";
import SponsorLogo from "~/components/SponsorLogo.vue";
import { MIN_SPONSOR_MEETUPS, SPONSOR_EMAIL, SPONSOR_PRICES } from "~/utils/sponsoring";

interface Sponsor {
  id: string;
  name: string;
  website: string;
  logo: { url: string; mimeType: string | null } | null;
  events: { id: string; date: string; title: string | null }[];
}

const { data } = await useAsyncQuery<{ sponsors: Sponsor[] }>(sponsorsQuery);

const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);

// Repeat sponsors only, most meetups first
const sponsors = computed(() =>
  (data.value?.sponsors ?? [])
    .filter((s) => s.logo?.url)
    .map((s) => {
      const dates = s.events.map((e) => e.date).filter(Boolean).sort();
      return { ...s, count: dates.length, first: dates[0] ?? null, last: dates[dates.length - 1] ?? null };
    })
    .filter((s) => s.count >= MIN_SPONSOR_MEETUPS)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
);
const current = computed(() => sponsors.value.filter((s) => s.last && s.last >= oneYearAgo));
const sponsoredMeetups = computed(() => new Set(sponsors.value.flatMap((s) => s.events.map((e) => e.id))).size);
const since = computed(() => sponsors.value.map((s) => s.first).filter(Boolean).sort()[0]?.slice(0, 4) ?? "");

useSeoMeta({
  title: "Sponsors",
  description: "The companies that host, feed and support Web Zürich, and what it costs to sponsor a meetup.",
});
</script>

<style scoped>
.hero-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(1.5rem, 3.5vw, 3.5rem) clamp(2rem, 4.5vw, 4.5rem);
  max-width: 64rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}
.hero-logo {
  display: grid;
  place-items: center;
  min-width: 7.5rem;
  height: 4.5rem;
  transition: transform 0.3s var(--ease-out-soft);
}
.hero-logo:hover {
  transform: translateY(-2px);
}
.hero-logo :deep(img.is-ink) {
  opacity: 0.85;
}
.hero-logo:hover :deep(img) {
  /* Stay an ink mark: some logos are white artwork that would vanish in colour */
  opacity: 1;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
}

.group {
  max-width: 88rem;
  margin: clamp(4rem, 7vw, 6.5rem) auto 0;
  padding-inline: 1.5rem;
}
.group__title {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 500;
  text-align: center;
}
.group__lede {
  max-width: 34rem;
  margin: 0.75rem auto 0;
  text-align: center;
  line-height: 1.5;
  color: var(--color-zh-muted);
}

/* Prices: three tiles in the america.gov rows style */
.support {
  margin-top: clamp(6rem, 10vw, 9rem);
  padding: clamp(4.5rem, 7.5vw, 8rem) 1.5rem;
  background: #f7f7f7;
}
.support__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.support__title {
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.06;
}
.support__lede {
  max-width: 32rem;
  margin-top: 1rem;
}
.prices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  gap: 1rem;
  max-width: 64rem;
  margin: clamp(2.5rem, 4vw, 4rem) auto 0;
}
.price {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.04), 0 7px 3.5px rgb(0 0 0 / 0.03), 0 15px 4.5px rgb(0 0 0 / 0.02);
}
.price__name {
  font-weight: 600;
  color: var(--color-zh-muted);
}
.price__amount {
  margin-top: 0.75rem;
  font-variation-settings: "opsz" 32;
  font-size: clamp(2.5rem, 4vw, 3.25rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.045em;
  color: var(--color-zh-navy);
  font-variant-numeric: tabular-nums;
}
.price__covers {
  margin-top: 1rem;
  line-height: 1.5;
  color: var(--color-zh-ink);
}
.price__perk {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: auto;
  padding-top: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.support__foot {
  max-width: 40rem;
  margin: 2.5rem auto 0;
  text-align: center;
  line-height: 1.6;
  color: var(--color-zh-muted);
}
</style>
