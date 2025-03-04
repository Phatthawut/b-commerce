<template>
  <div class="page-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="section-title">Order Details</h1>
      <router-link
        to="/admin/orders"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Orders
      </router-link>
    </div>

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

    <!-- Order Not Found -->
    <div v-else-if="!order" class="text-center py-12">
      <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-3"></i>
      <h3 class="text-xl font-semibold text-gray-600">Order not found</h3>
      <p class="text-gray-500 mt-2">
        The order you're looking for doesn't exist or has been removed.
      </p>
      <router-link
        to="/admin/orders"
        class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        View All Orders
      </router-link>
    </div>

    <!-- Order Details -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Order Summary -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="border-b px-6 py-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">
                Order #{{ order.id.substring(0, 8) }}
              </h2>
              <span
                class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
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
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Placed on {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <!-- Order Items -->
          <div class="px-6 py-4">
            <h3 class="text-md font-semibold text-gray-800 mb-3">Items</h3>
            <div class="space-y-4">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex items-start border-b pb-4 last:border-0 last:pb-0"
              >
                <img
                  :src="item.imageUrl || '/images/placeholder.jpg'"
                  :alt="item.name"
                  class="h-16 w-16 object-cover rounded"
                />
                <div class="ml-4 flex-1">
                  <div class="flex justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ item.name }}
                      </h4>
                      <p class="text-sm text-gray-500">
                        Qty: {{ item.quantity }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900">
                        ${{ formatPrice(item.price * item.quantity) }}
                      </p>
                      <p class="text-xs text-gray-500">
                        ${{ formatPrice(item.price) }} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Totals -->
          <div class="bg-gray-50 px-6 py-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600">Subtotal</span>
              <span class="text-sm font-medium"
                >${{ formatPrice(order.subtotal || calculateSubtotal()) }}</span
              >
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600">Tax</span>
              <span class="text-sm font-medium"
                >${{ formatPrice(order.tax || calculateTax()) }}</span
              >
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-600">Shipping</span>
              <span class="text-sm font-medium"
                >${{ formatPrice(order.shipping || 0) }}</span
              >
            </div>
            <div class="flex justify-between pt-2 border-t">
              <span class="text-base font-semibold text-gray-900">Total</span>
              <span class="text-base font-semibold text-gray-900"
                >${{ formatPrice(order.total || calculateTotal()) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Info & Actions -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Customer Information -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="border-b px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-800">
              Customer Information
            </h2>
          </div>
          <div class="px-6 py-4">
            <h3 class="text-md font-semibold text-gray-800 mb-2">Contact</h3>
            <p class="text-sm text-gray-600 mb-4">
              {{
                order.shippingInfo?.email || order.email || "No email provided"
              }}
            </p>

            <h3 class="text-md font-semibold text-gray-800 mb-2">
              Shipping Address
            </h3>
            <div class="text-sm text-gray-600">
              <p>{{ order.shippingInfo?.name || "No name provided" }}</p>
              <p>{{ order.shippingInfo?.address || "No address provided" }}</p>
              <p>
                {{ order.shippingInfo?.city || "" }},
                {{ order.shippingInfo?.state || "" }}
                {{ order.shippingInfo?.zip || "" }}
              </p>
              <p>{{ order.shippingInfo?.country || "" }}</p>
              <p class="mt-2">
                Phone: {{ order.shippingInfo?.phone || "No phone provided" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="border-b px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-800">Order Actions</h2>
          </div>
          <div class="px-6 py-4 space-y-3">
            <button
              v-if="order.status === 'pending'"
              @click="updateStatus('processing')"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              :disabled="updating"
            >
              <i class="fas fa-box mr-2"></i> Process Order
            </button>
            <button
              v-if="order.status === 'processing'"
              @click="updateStatus('shipped')"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
              :disabled="updating"
            >
              <i class="fas fa-shipping-fast mr-2"></i> Mark as Shipped
            </button>
            <button
              v-if="order.status === 'shipped'"
              @click="updateStatus('delivered')"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
              :disabled="updating"
            >
              <i class="fas fa-check-circle mr-2"></i> Mark as Delivered
            </button>
            <button
              v-if="['pending', 'processing'].includes(order.status)"
              @click="updateStatus('cancelled')"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
              :disabled="updating"
            >
              <i class="fas fa-times-circle mr-2"></i> Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const loading = ref(true);
const error = ref("");
const updating = ref(false);

const order = computed(() => orderStore.currentOrder);

onMounted(async () => {
  try {
    await orderStore.fetchOrderById(route.params.id);
  } catch (err) {
    error.value = err.message || "Failed to load order";
  } finally {
    loading.value = false;
  }
});

const formatPrice = (price) => {
  return Number(price || 0).toFixed(2);
};

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const calculateSubtotal = () => {
  if (!order.value || !order.value.items) return 0;
  return order.value.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

const calculateTax = () => {
  return calculateSubtotal() * 0.1; // Assuming 10% tax
};

const calculateTotal = () => {
  return calculateSubtotal() + calculateTax() + (order.value?.shipping || 0);
};

const updateStatus = async (status) => {
  updating.value = true;
  try {
    await orderStore.updateStatus(order.value.id, status);
  } catch (err) {
    error.value = err.message || "Failed to update order status";
  } finally {
    updating.value = false;
  }
};
</script>
