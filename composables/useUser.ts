import { ref, computed } from 'vue';

export function useUser() {
  const user = ref(null);
  
  const hasUser = computed(() => !!user.value);
  
  function setUser(userData: any) {
    user.value = userData;
  }
  
  function clearUser() {
    user.value = null;
  }
  
  return {
    user,
    hasUser,
    setUser,
    clearUser
  };
} 