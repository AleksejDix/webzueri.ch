<template>
  <NuxtLink
    :to="`/speakers/${speaker.id}`"
    class="flex items-center group no-underline"
  >
    <!-- Speaker photo -->
    <div class="flex-shrink-0 mr-4">
      <div
        v-if="speaker.speakerPicture?.url"
        class="w-12 h-12 rounded-full overflow-hidden"
      >
        <img
          :src="speaker.speakerPicture.url"
          :alt="speaker.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        v-else
        class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
      >
        {{ getInitials(speaker.name) }}
      </div>
    </div>

    <!-- Speaker info -->
    <div class="flex-grow">
      <h3 class="text-gray-900 font-medium group-hover:text-gray-700">
        {{ speaker.name }}
      </h3>
      <p v-if="showTalkCount && speaker.talks" class="text-sm text-gray-500">
        {{
          speaker.talks.length === 1
            ? "1 talk"
            : `${speaker.talks.length} talks`
        }}
      </p>
    </div>

    <!-- Optional rank -->
    <div v-if="rank !== undefined" class="mr-3 text-gray-400 font-mono text-lg">
      {{ rank }}
    </div>

    <!-- Optional talk count badge -->
    <div v-if="showTalkBadge && speaker.talks" class="ml-auto">
      <span class="text-gray-500 font-mono text-lg tabular-nums">
        {{ speaker.talks.length }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  speaker: {
    type: Object,
    required: true,
  },
  rank: {
    type: Number,
    default: undefined,
  },
  showTalkCount: {
    type: Boolean,
    default: false,
  },
  showTalkBadge: {
    type: Boolean,
    default: false,
  },
});

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
