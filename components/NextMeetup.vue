<template>
  <a
    :id="optionId"
    :href="href"
    target="_blank"
    rel="noopener"
    role="option"
    :aria-selected="active"
    class="next"
    :class="{ 'is-active': active }"
    @mousedown.prevent
    @click.prevent="$emit('pick')"
  >
    <span class="next__date" aria-hidden="true">
      <span class="next__month">{{ month }}</span>
      <span class="next__day">{{ day }}</span>
    </span>
    <span class="min-w-0">
      <template v-if="event">
        <span class="next__title">{{ weekday }}, {{ longDate }}{{ event.time ? ` at ${event.time}` : "" }}</span>
        <span class="next__meta">
          {{ event.venue || "Venue to be announced" }}<template v-if="event.talkCount">, {{ event.talkCount }} talks</template>.
          Register on Meetup.
        </span>
      </template>
      <template v-else>
        <span class="next__title">No meetup scheduled yet</span>
        <span class="next__meta">
          <template v-if="last">The last one was on {{ longDate }}. </template>Follow the Meetup group to hear about the next date.
        </span>
      </template>
    </span>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MEETUP_URL, type SearchEvent } from "~/composables/useSiteSearch";

const props = defineProps<{
  event: SearchEvent | null;
  last: SearchEvent | null;
  active?: boolean;
  optionId?: string;
}>();
defineEmits<{ pick: [] }>();

const shown = computed(() => props.event ?? props.last);
const at = (opts: Intl.DateTimeFormatOptions) =>
  shown.value ? new Date(shown.value.date).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" }) : "";

const month = computed(() => (props.event ? at({ month: "short" }) : "Next"));
const day = computed(() => (props.event ? at({ day: "numeric" }) : "?"));
const weekday = computed(() => at({ weekday: "long" }));
const longDate = computed(() => at({ day: "numeric", month: "long", year: "numeric" }));
const href = computed(() => props.event?.meetupLink || MEETUP_URL);
</script>

<style scoped>
.next {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 1.125rem;
  background: var(--color-zh-soft);
  color: var(--color-zh-ink);
  transition: background 0.2s, box-shadow 0.2s;
}
.next.is-active,
.next:hover {
  box-shadow: inset 0 0 0 2px var(--color-zh-blue);
}
.next__date {
  flex: none;
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: var(--color-zh-blue);
  color: #fff;
  line-height: 1;
}
.next__month {
  font-size: 0.75rem;
  font-weight: 600;
}
.next__day {
  font-variation-settings: "opsz" 32;
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}
.next__title {
  display: block;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.next__meta {
  display: block;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
}
</style>
