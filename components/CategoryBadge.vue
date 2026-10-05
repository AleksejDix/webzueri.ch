<template>
  <span
    v-if="category"
    class="whitespace-nowrap rounded-full px-3 py-1 text-[0.75rem] font-medium"
    :class="getCategoryClass(category)"
  >
    {{ category }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  category?: string;
}

defineProps<Props>();

const getCategoryClass = (cat: string) => {
  if (cat === "Design") {
    return "bg-[#f3e8ff] text-[#7c3aed]";
  } else if (cat === "Frontend") {
    return "bg-[#d1fae5] text-[#059669]";
  } else if (cat === "Backend") {
    return "bg-[#dbeafe] text-[#2563eb]";
  } else if (cat === "All") {
    return "bg-[#f3f4f6] text-[#111827]";
  } else {
    return "bg-[#f9fafb] text-[#6b7280]";
  }
};
</script>
