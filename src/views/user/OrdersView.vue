<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

    <div
      v-if="!isAuthenticated"
      class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6"
    >
      Please
      <router-link to="/login" class="font-bold underline">login</router-link>
      to view your orders.
    </div>

    <div v-else-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      {{ error }}
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-600 mb-6">
        You haven't placed any orders yet
      </p>
      <router-link
        to="/products"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Start Shopping
      </router-link>
    </div>

    <div v-else>
      <div
        class="bg-white shadow-md rounded-lg overflow-hidden mb-6"
        v-for="order in orders"
        :key="order.id"
      >
        <div
          class="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div class="mb-2 md:mb-0">
            <span class="text-sm text-gray-600"
              >Order #{{ order.id.substring(0, 8) }}</span
            >
            <p class="text-sm text-gray-600">
              {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="mb-2 md:mb-0 md:mr-4">
              <span class="text-sm font-medium text-gray-900"
                >Total: ${{ order.total.toFixed(2) }}</span
              >
            </div>
            <div>
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-purple-100 text-purple-800': order.status === 'shipped',
                  'bg-green-100 text-green-800': order.status === 'delivered',
                  'bg-red-100 text-red-800': order.status === 'cancelled',
                }"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ capitalizeFirstLetter(order.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="px-6 py-4">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Items</h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex items-start"
              >
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ item.name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    ${{ item.price.toFixed(2) }} x {{ item.quantity }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4 flex justify-between">
            <router-link
              :to="`/orders/${order.id}`"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Order Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const orders = ref([]);
const loading = ref(true);
const error = ref("");

const isAuthenticated = computed(() => userStore.isAuthenticated);

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Capitalize first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Fetch user orders
const fetchOrders = async () => {
  if (!userStore.user?.uid) return;

  loading.value = true;
  error.value = "";

  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userStore.user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    orders.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error fetching orders:", err);
    error.value = "Failed to load orders. Please try again later.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchOrders();
  } else {
    // Wait for authentication to complete
    await userStore.checkAuth();
    if (isAuthenticated.value) {
      await fetchOrders();
    }
  }
});
</script>
