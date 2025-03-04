<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

    <div
      v-if="!isAuthenticated"
      class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6"
    >
      Please
      <router-link to="/login" class="font-bold underline">login</router-link>
      to complete your purchase.
    </div>

    <div v-else-if="cartItems.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-600 mb-6">Your cart is empty</p>
      <router-link
        to="/products"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Order Summary -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div
            class="border-b border-gray-200 pb-4 mb-4"
            v-for="item in cartItems"
            :key="item.id"
          >
            <div class="flex items-start">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded mr-4"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm">{{ item.category }}</p>
                <div class="flex justify-between mt-2">
                  <div>
                    <span class="text-gray-600">Qty: {{ item.quantity }}</span>
                  </div>
                  <div>
                    <span v-if="item.salePrice" class="text-red-600 font-bold"
                      >${{ (item.salePrice * item.quantity).toFixed(2) }}</span
                    >
                    <span v-else class="text-gray-900 font-bold"
                      >${{ (item.price * item.quantity).toFixed(2) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between border-b border-gray-200 py-4 mb-4">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between border-b border-gray-200 py-4 mb-4">
            <span class="text-gray-600">Shipping</span>
            <span class="font-semibold">${{ shipping.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between py-4 mb-4">
            <span class="text-lg font-bold">Total</span>
            <span class="text-lg font-bold">${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Checkout Form -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Shipping Information
          </h2>

          <form @submit.prevent="placeOrder">
            <div class="mb-4">
              <label
                for="name"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Full Name</label
              >
              <input
                type="text"
                id="name"
                v-model="shippingInfo.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="mb-4">
              <label
                for="address"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Address</label
              >
              <input
                type="text"
                id="address"
                v-model="shippingInfo.address"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  for="city"
                  class="block text-gray-700 text-sm font-bold mb-2"
                  >City</label
                >
                <input
                  type="text"
                  id="city"
                  v-model="shippingInfo.city"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  for="postalCode"
                  class="block text-gray-700 text-sm font-bold mb-2"
                  >Postal Code</label
                >
                <input
                  type="text"
                  id="postalCode"
                  v-model="shippingInfo.postalCode"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="mb-6">
              <label
                for="phone"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Phone Number</label
              >
              <input
                type="tel"
                id="phone"
                v-model="shippingInfo.phone"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Payment Method
            </h2>

            <div class="mb-6">
              <div class="flex items-center mb-2">
                <input
                  type="radio"
                  id="creditCard"
                  value="creditCard"
                  v-model="paymentMethod"
                  class="mr-2"
                />
                <label for="creditCard" class="text-gray-700"
                  >Credit Card</label
                >
              </div>
              <div class="flex items-center mb-2">
                <input
                  type="radio"
                  id="paypal"
                  value="paypal"
                  v-model="paymentMethod"
                  class="mr-2"
                />
                <label for="paypal" class="text-gray-700">PayPal</label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  value="cashOnDelivery"
                  v-model="paymentMethod"
                  class="mr-2"
                />
                <label for="cashOnDelivery" class="text-gray-700"
                  >Cash on Delivery</label
                >
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
              <span v-else>Place Order</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();

const loading = ref(false);
const error = ref("");
const paymentMethod = ref("creditCard");

const shippingInfo = ref({
  name: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
});

// Fill shipping info with user data if available
onMounted(() => {
  if (userStore.user) {
    shippingInfo.value.name = userStore.user.displayName || "";
  }
});

const isAuthenticated = computed(() => userStore.isAuthenticated);
const cartItems = computed(() => cartStore.items);

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + price * item.quantity;
  }, 0);
});

const shipping = computed(() => {
  // Simple shipping calculation
  return subtotal.value > 100 ? 0 : 10;
});

const total = computed(() => {
  return subtotal.value + shipping.value;
});

const placeOrder = async () => {
  if (!isAuthenticated.value) {
    router.push("/login");
    return;
  }

  if (cartItems.value.length === 0) {
    error.value = "Your cart is empty";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // Create order in Firestore
    const orderData = {
      userId: userStore.user.uid,
      items: cartItems.value.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        subtotal: (item.salePrice || item.price) * item.quantity,
      })),
      shipping: shipping.value,
      subtotal: subtotal.value,
      total: total.value,
      shippingInfo: shippingInfo.value,
      paymentMethod: paymentMethod.value,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    const orderRef = await addDoc(collection(db, "orders"), orderData);

    // Clear cart
    cartStore.clearCart();

    // Redirect to order confirmation
    router.push(`/orders/${orderRef.id}`);
  } catch (err) {
    console.error("Error placing order:", err);
    error.value = "Failed to place order. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
