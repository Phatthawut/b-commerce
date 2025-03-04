<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Order Details</h1>
      <router-link
        to="/orders"
        class="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Orders
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
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

    <div v-else-if="!order" class="text-center py-12">
      <p class="text-xl text-gray-600 mb-6">Order not found</p>
      <router-link
        to="/orders"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Back to Orders
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Order Summary -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div class="mb-2 md:mb-0">
                <h2 class="text-xl font-semibold text-gray-900">
                  Order #{{ order.id.substring(0, 8) }}
                </h2>
                <p class="text-sm text-gray-600">
                  Placed on {{ formatDate(order.createdAt) }}
                </p>
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
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Items</h3>

            <div
              class="border-b border-gray-200 pb-4 mb-4"
              v-for="(item, index) in order.items"
              :key="index"
            >
              <div class="flex items-start">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ item.name }}</h4>
                  <div class="flex justify-between mt-2">
                    <div>
                      <span class="text-gray-600"
                        >Qty: {{ item.quantity }}</span
                      >
                    </div>
                    <div>
                      <span class="text-gray-900 font-bold"
                        >${{ (item.price * item.quantity).toFixed(2) }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-between border-b border-gray-200 py-4 mb-4"
            >
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold"
                >${{ order.subtotal.toFixed(2) }}</span
              >
            </div>

            <div
              class="flex justify-between border-b border-gray-200 py-4 mb-4"
            >
              <span class="text-gray-600">Shipping</span>
              <span class="font-semibold"
                >${{ order.shipping.toFixed(2) }}</span
              >
            </div>

            <div class="flex justify-between py-4">
              <span class="text-lg font-bold">Total</span>
              <span class="text-lg font-bold"
                >${{ order.total.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping and Payment Info -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Shipping Information
            </h3>
          </div>

          <div class="px-6 py-4">
            <p class="font-medium text-gray-900">
              {{ order.shippingInfo.name }}
            </p>
            <p class="text-gray-600">{{ order.shippingInfo.address }}</p>
            <p class="text-gray-600">
              {{ order.shippingInfo.city }}, {{ order.shippingInfo.postalCode }}
            </p>
            <p class="text-gray-600">{{ order.shippingInfo.phone }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900">Payment Method</h3>
          </div>

          <div class="px-6 py-4">
            <p class="text-gray-600">
              {{ formatPaymentMethod(order.paymentMethod) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useUserStore } from "@/stores/userStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const order = ref(null);
const loading = ref(true);
const error = ref("");

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
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Format payment method
const formatPaymentMethod = (method) => {
  if (!method) return "";

  const methods = {
    creditCard: "Credit Card",
    paypal: "PayPal",
    cashOnDelivery: "Cash on Delivery",
  };

  return methods[method] || method;
};

// Fetch order details
const fetchOrder = async () => {
  if (!route.params.id) {
    router.push("/orders");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const docRef = doc(db, "orders", route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const orderData = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      // Verify that the order belongs to the current user
      if (orderData.userId !== userStore.user?.uid) {
        error.value = "You do not have permission to view this order";
        order.value = null;
      } else {
        order.value = orderData;
      }
    } else {
      error.value = "Order not found";
      order.value = null;
    }
  } catch (err) {
    console.error("Error fetching order:", err);
    error.value = "Failed to load order details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (userStore.isAuthenticated) {
    await fetchOrder();
  } else {
    // Wait for authentication to complete
    await userStore.checkAuth();
    if (userStore.isAuthenticated) {
      await fetchOrder();
    } else {
      router.push("/login");
    }
  }
});
</script>
