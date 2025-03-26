<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import CartSidebar from "@/components/cart/CartSidebar.vue";
import { useAuthStore } from "@/stores/authStore";

const userStore = useUserStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

const loading = ref(true);

onMounted(async () => {
  // Initialize authentication
  await authStore.initAuth();
  loading.value = false;

  // Check if user is authenticated
  await userStore.checkAuth();

  // Load cart from localStorage
  cartStore.loadCart();
});
</script>

<template>
  <router-view />
  <CartSidebar />
</template>
