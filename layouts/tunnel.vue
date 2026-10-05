<template>
  <div>
    <div class="md:p-4 md:py-6 min-h-screen">
      <slot />
    </div>
    <SvgSymbols />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUser } from '~/composables/useUser';
import SvgSymbols from '~/components/SvgSymbols.vue';

const router = useRouter();
const route = useRoute();
const { hasUser } = useUser();

// Watch for user authentication
watch(hasUser, (value) => {
  if (!value) return;
  redirectTo(route.query.redirect as string);
});

// Check on mount
onMounted(() => {
  if (hasUser.value) {
    redirectTo(route.query.redirect as string);
  }
});

// Redirect helper
const redirectTo = (routeName: string) => {
  if (!routeName) router.push("/dashboard/settings/");
  else router.push({ name: routeName });
};
</script>

