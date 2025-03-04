<template>
  <div class="page-container">
    <h1 class="section-title">Order Management</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="orderStore.orders.length === 0" class="text-center py-12">
      <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-3"></i>
      <h3 class="text-xl font-semibold text-gray-600">No orders found</h3>
      <p class="text-gray-500 mt-2">
        Orders will appear here when customers make purchases.
      </p>
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Order ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orderStore.orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                #{{ order.id.substring(0, 8) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ order.shippingInfo?.name || "N/A" }}
              </div>
              <div class="text-sm text-gray-500">
                {{ order.email || "No email" }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ formatDate(order.createdAt) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                ${{ formatPrice(order.total) }}
              </div>
              <div class="text-sm text-gray-500">
                {{ order.items?.length || 0 }} items
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-purple-100 text-purple-800': order.status === 'shipped',
                  'bg-green-100 text-green-800': order.status === 'delivered',
                  'bg-red-100 text-red-800': order.status === 'cancelled',
                }"
              >
                {{ capitalizeFirstLetter(order.status) }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <router-link
                :to="`/admin/orders/${order.id}`"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                View
              </router-link>
              <button
                v-if="order.status === 'pending'"
                @click="updateOrderStatus(order.id, 'processing')"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Process
              </button>
              <button
                v-if="order.status === 'processing'"
                @click="updateOrderStatus(order.id, 'shipped')"
                class="text-purple-600 hover:text-purple-900 mr-4"
              >
                Ship
              </button>
              <button
                v-if="order.status === 'shipped'"
                @click="updateOrderStatus(order.id, 'delivered')"
                class="text-green-600 hover:text-green-900 mr-4"
              >
                Deliver
              </button>
              <button
                v-if="['pending', 'processing'].includes(order.status)"
                @click="updateOrderStatus(order.id, 'cancelled')"
                class="text-red-600 hover:text-red-900"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOrderStore } from "@/stores/orderStore";

const orderStore = useOrderStore();
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    await orderStore.fetchAllOrders();
  } catch (err) {
    error.value = err.message || "Failed to load orders";
  } finally {
    loading.value = false;
  }
});

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const updateOrderStatus = async (orderId, status) => {
  try {
    await orderStore.updateStatus(orderId, status);
  } catch (err) {
    error.value = err.message || "Failed to update order status";
  }
};
</script>
