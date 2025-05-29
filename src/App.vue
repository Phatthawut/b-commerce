<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useLanguage } from "@/composables/useLanguage";

const authStore = useAuthStore();
const { initializeLanguage } = useLanguage();

const loading = ref(true);

onMounted(async () => {
  // Initialize language settings
  initializeLanguage();

  // Initialize authentication
  await authStore.initAuth();
  loading.value = false;
});
</script>

<template>
  <router-view />
</template>
