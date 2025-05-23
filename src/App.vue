<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const loading = ref(true);

onMounted(async () => {
  // Initialize authentication
  await authStore.initAuth();
  loading.value = false;
});
</script>

<template>
  <router-view />
</template>
