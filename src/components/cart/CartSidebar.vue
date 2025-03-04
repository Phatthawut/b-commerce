<template>
  <div>
    <!-- Cart Overlay -->
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="cartStore.toggleCart"
    ></div>

    <!-- Cart Sidebar -->
    <div
      class="fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out"
      :class="{
        'translate-x-0': cartStore.isOpen,
        'translate-x-full': !cartStore.isOpen,
      }"
    >
      <!-- Cart Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-semibold">Your Cart</h2>
        <button
          @click="cartStore.toggleCart"
          class="text-gray-500 hover:text-gray-700"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Empty Cart -->
      <div
        v-if="cartStore.isEmpty"
        class="flex flex-col items-center justify-center h-64"
      >
        <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Your cart is empty</p>
        <button
          @click="cartStore.toggleCart"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto p-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex items-center py-4 border-b"
          >
            <!-- Product Image -->
            <img
              :src="item.imageUrl || '/images/placeholder.jpg'"
              :alt="item.name"
              class="w-16 h-16 object-cover rounded"
            />

            <!-- Product Details -->
            <div class="ml-4 flex-1">
              <h3 class="text-sm font-medium text-gray-800">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">
                ${{ formatPrice(item.price) }} each
              </p>

              <!-- Quantity Controls -->
              <div class="flex items-center mt-2">
                <button
                  @click="decreaseQuantity(item.id)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <i class="fas fa-minus-circle"></i>
                </button>
                <span class="mx-2 text-gray-700">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item.id)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <i class="fas fa-plus-circle"></i>
                </button>
              </div>
            </div>

            <!-- Item Total & Remove -->
            <div class="ml-4 text-right">
              <p class="text-sm font-medium text-gray-800">
                ${{ formatPrice(item.price * item.quantity) }}
              </p>
              <button
                @click="removeItem(item.id)"
                class="text-red-500 hover:text-red-700 text-sm mt-1"
              >
                <i class="fas fa-trash-alt mr-1"></i> Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Footer -->
        <div class="p-4 border-t mt-auto">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-medium"
              >${{ formatPrice(cartStore.totalPrice) }}</span
            >
          </div>
          <div class="flex justify-between mb-4">
            <span class="text-gray-600">Tax (estimated)</span>
            <span class="font-medium"
              >${{ formatPrice(cartStore.totalPrice * 0.1) }}</span
            >
          </div>
          <div class="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>${{ formatPrice(cartStore.totalPrice * 1.1) }}</span>
          </div>

          <router-link
            to="/checkout"
            @click="cartStore.toggleCart"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded text-center"
          >
            Proceed to Checkout
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const increaseQuantity = (productId) => {
  const item = cartStore.items.find((item) => item.id === productId);
  if (item) {
    cartStore.updateItemQuantity(productId, item.quantity + 1);
  }
};

const decreaseQuantity = (productId) => {
  const item = cartStore.items.find((item) => item.id === productId);
  if (item && item.quantity > 1) {
    cartStore.updateItemQuantity(productId, item.quantity - 1);
  } else {
    removeItem(productId);
  }
};

const removeItem = (productId) => {
  cartStore.removeItem(productId);
};
</script>
