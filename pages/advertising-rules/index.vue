<template>
  <div>
    <PageHero
      title="Advertising rules"
      lede="Web Zürich is free because hosts and sponsors support it. These rules keep the evenings about learning, not selling."
    />
    <!-- DRAFT: written as a starting point. The organisers should review and adjust before publishing. -->
    <article class="policy">
      <h2 id="talks">Talks</h2>
      <ul>
        <li>Talks share knowledge and experience. They are not product or sales presentations.</li>
        <li>Speakers are welcome to say who they work for and show their company on their first and last slide.</li>
        <li>If a talk is about your own product, focus on what others can learn from it, and say up front that it's yours.</li>
        <li>
          A company can get a speaking slot by paying for one of the evening's costs: the catering, the cleanup or the
          venue rental.<template v-if="prices.length"> See <a href="#prices">prices</a> below.</template>
        </li>
      </ul>

      <h2 id="hosts-and-sponsors">Hosts and sponsors</h2>
      <ul>
        <li>The host and sponsors of an evening get a short welcome at the start, up to five minutes.</li>
        <li>Their logo appears on the event page, on our slides and on our <NuxtLink to="/sponsors">sponsors page</NuxtLink>.</li>
      </ul>

      <h2 id="jobs">Job openings</h2>
      <ul>
        <li><strong>A job can only be posted or announced if it includes the salary.</strong> Posts without a salary are removed.</li>
        <li>Posting a job is free.</li>
        <li>Anyone can announce open positions during the announcements before or after the talks. Keep it to one short mention per company.</li>
        <li>Talking to people about jobs during the break is fine. Hold off if someone isn't interested.</li>
      </ul>

      <template v-if="prices.length">
        <h2 id="prices">Prices</h2>
        <p>What it costs to cover each part of an evening. Paying for any one of them gets your company a speaking slot.</p>
        <table class="prices">
          <tbody>
            <tr v-for="item in prices" :key="item.name">
              <th scope="row">{{ item.name }}</th>
              <td>{{ item.price }}</td>
            </tr>
          </tbody>
        </table>
        <p>Hosting the evening in your own office counts as covering the venue.</p>
      </template>

      <h2 id="online">Online channels</h2>
      <ul>
        <li>Share events and job posts only where the group allows them.</li>
        <li>Don't send members unsolicited direct messages to sell or recruit.</li>
      </ul>

      <h2 id="when-rules-are-broken">When the rules aren't followed</h2>
      <p>
        Organisers may cut a pitch short, remove posts or ask someone to stop. Repeated or serious cases are handled
        under our <NuxtLink to="/code-of-conduct">Code of Conduct</NuxtLink>.
      </p>
      <p>
        Questions about sponsoring or advertising? Write to
        <a href="mailto:info@webzurich.ch">info@webzurich.ch</a>.
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
import PageHero from "~/components/PageHero.vue";

import { SPONSOR_PRICES } from "~/utils/sponsoring";

// The Prices section and the link to it only show while this list has entries.
const prices = SPONSOR_PRICES;

useHead({ title: "Advertising rules" });
useSeoMeta({
  description: "How hosts, sponsors, speakers and members may advertise at Web Zürich meetups and in our channels.",
});
defineOgImage("Page", {
  title: "Advertising rules",
  description: "How hosts, sponsors, speakers and members may advertise at Web Zürich meetups and in our channels.",
});
</script>

<style scoped>
.prices {
  width: 100%;
  margin-top: 1.5rem;
  border-collapse: collapse;
}
.prices th,
.prices td {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-zh-line);
  text-align: left;
}
.prices th {
  font-weight: 500;
}
.prices td {
  font-weight: 600;
  text-align: right;
  color: var(--color-zh-navy);
  font-variant-numeric: tabular-nums;
}
</style>
