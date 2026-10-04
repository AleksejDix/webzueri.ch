<template>
  <span
    v-if="category"
    class="category-badge"
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
    return "category-design";
  } else if (cat === "Frontend") {
    return "category-frontend";
  } else if (cat === "Backend") {
    return "category-backend";
  } else if (cat === "All") {
    return "category-all";
  } else {
    return "category-other";
  }
};
</script>

<style scoped>
.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.category-design {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.category-frontend {
  background-color: #d1fae5;
  color: #059669;
}

.category-backend {
  background-color: #dbeafe;
  color: #2563eb;
}

.category-all {
  background-color: #f3f4f6;
  color: #111827;
}

.category-other {
  background-color: #f9fafb;
  color: #6b7280;
}
</style>