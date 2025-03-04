<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import CartSidebar from "@/components/cart/CartSidebar.vue";

const userStore = useUserStore();
const cartStore = useCartStore();

onMounted(async () => {
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
