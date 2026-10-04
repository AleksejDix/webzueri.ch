<template>
  <div class="w-full">
    <div v-if="pending" class="animate-pulse">
      <div class="h-4 bg-gray-200 rounded mb-4"></div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-0 h-auto md:h-48"
      >
        <div
          v-for="i in 7"
          :key="i"
          class="bg-gray-100 min-h-[120px] md:min-h-0"
        ></div>
      </div>
    </div>
    <div v-else>
      <div class="relative h-5 mb-2">
        <div
          class="absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-pink-500 rounded-full"
        ></div>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-0 h-auto md:h-48"
      >
        <div
          v-for="month in monthsData"
          :key="month.name"
          class="relative flex flex-col justify-between p-3 md:p-5 overflow-hidden min-h-[120px] md:min-h-0"
          :class="{
            'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600':
              month.class === 'month-current',
            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600':
              month.class === 'month-upcoming',
            'bg-gradient-to-r from-white to-gray-50 text-gray-500':
              month.class === 'month-past',
          }"
        >
          <div
            class="text-sm sm:text-lg md:text-2xl font-bold tracking-wider mb-auto"
          >
            {{ month.name }}
          </div>
          <div class="flex items-center justify-center flex-1">
            <div
              v-if="month.hasEvent"
              class="text-2xl sm:text-3xl md:text-5xl font-bold opacity-80"
            >
              {{ month.eventCount }}
            </div>
            <div
              v-else-if="month.class === 'month-upcoming'"
              class="text-sm sm:text-base md:text-lg font-bold tracking-widest whitespace-nowrap"
            >
              UPCOMING
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import eventsCalendarQuery from "~/services/apollo/queries/eventsCalendar.gql";

// Fetch events data
const { data, pending, error } = await useAsyncQuery(eventsCalendarQuery);

const currentMonth = new Date().getMonth(); // 0-based (September = 8)
const currentYear = new Date().getFullYear();

// Extract events from data
const events = computed(() => data.value?.events || []);

// Create a map of months with events
const eventsMap = computed(() => {
  const map = new Map();

  events.value.forEach((event) => {
    if (event.date) {
      const eventDate = new Date(event.date);
      const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}`;

      if (!map.has(monthKey)) {
        map.set(monthKey, []);
      }
      map.get(monthKey).push(event);
    }
  });

  return map;
});

// Get month class based on current date
const getMonthClass = (monthIndex: number) => {
  if (monthIndex === currentMonth) return "month-current";
  if (monthIndex < currentMonth) return "month-past";
  return "month-upcoming";
};

// Check if month has events
const hasEvents = (monthIndex: number) => {
  const monthKey = `${currentYear}-${monthIndex}`;
  return (
    eventsMap.value.has(monthKey) && eventsMap.value.get(monthKey).length > 0
  );
};

// Get event count for a month
const getEventCount = (monthIndex: number) => {
  const monthKey = `${currentYear}-${monthIndex}`;
  return eventsMap.value.has(monthKey)
    ? eventsMap.value.get(monthKey).length
    : 0;
};

const monthsData = computed(() => [
  {
    name: "JUNE",
    class: getMonthClass(5),
    monthIndex: 5,
    hasEvent: hasEvents(5),
    eventCount: getEventCount(5),
  },
  {
    name: "JULY",
    class: getMonthClass(6),
    monthIndex: 6,
    hasEvent: hasEvents(6),
    eventCount: getEventCount(6),
  },
  {
    name: "AUG",
    class: getMonthClass(7),
    monthIndex: 7,
    hasEvent: hasEvents(7),
    eventCount: getEventCount(7),
  },
  {
    name: "SEP",
    class: getMonthClass(8),
    monthIndex: 8,
    hasEvent: hasEvents(8),
    eventCount: getEventCount(8),
  },
  {
    name: "OCT",
    class: getMonthClass(9),
    monthIndex: 9,
    hasEvent: hasEvents(9),
    eventCount: getEventCount(9),
  },
  {
    name: "NOV",
    class: getMonthClass(10),
    monthIndex: 10,
    hasEvent: hasEvents(10),
    eventCount: getEventCount(10),
  },
  {
    name: "DEC",
    class: getMonthClass(11),
    monthIndex: 11,
    hasEvent: hasEvents(11),
    eventCount: getEventCount(11),
  },
]);
</script>
