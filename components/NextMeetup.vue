<template>
  <a
    :id="optionId"
    :href="href"
    target="_blank"
    rel="noopener"
    role="option"
    :aria-selected="active"
    class="flex items-center gap-4 rounded-[1.125rem] bg-soft p-3 text-ink transition-[background,box-shadow] duration-200 ease-[ease] hover:shadow-[inset_0_0_0_2px_var(--wz-link)] aria-selected:shadow-[inset_0_0_0_2px_var(--wz-link)]"
    @mousedown.prevent
    @click.prevent="$emit('pick')"
  >
    <span class="grid size-14 flex-none place-items-center rounded-2xl bg-accent leading-none text-white" aria-hidden="true">
      <span class="text-[0.75rem] font-semibold">{{ month }}</span>
      <span class="text-[1.375rem] font-semibold tracking-[-0.04em]">{{ day }}</span>
    </span>
    <span class="min-w-0">
      <template v-if="event">
        <span class="block font-semibold text-heading">{{ weekday }}, {{ longDate }}{{ event.time ? ` at ${event.time}` : "" }}</span>
        <span class="block text-[0.875rem] text-muted">
          {{ event.venue || "Venue to be announced" }}<template v-if="event.talkCount">, {{ event.talkCount }} talks</template>.
          Register on Meetup.
        </span>
      </template>
      <template v-else>
        <span class="block font-semibold text-heading">No meetup scheduled yet</span>
        <span class="block text-[0.875rem] text-muted">
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

