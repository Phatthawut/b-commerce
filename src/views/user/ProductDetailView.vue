<template>
  <div class="page-container">
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

    <!-- Product Details -->
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="bg-white p-4 rounded-lg shadow">
        <img
          :src="product.imageUrl || '/images/placeholder.jpg'"
          :alt="product.name"
          class="w-full h-auto object-contain rounded-lg"
          style="max-height: 400px"
        />
      </div>

      <!-- Product Info -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ product.name }}
        </h1>
        <p class="text-sm text-gray-500 mb-4">
          Category: {{ product.category }}
        </p>

        <!-- Price -->
        <div class="flex items-center mb-6">
          <span
            v-if="product.onSale"
            class="text-2xl font-bold text-red-500 mr-3"
            >${{ formatPrice(product.salePrice) }}</span
          >
          <span
            :class="{
              'text-2xl font-bold text-gray-900': !product.onSale,
              'text-lg line-through text-gray-500': product.onSale,
            }"
          >
            ${{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.onSale"
            class="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded"
          >
            {{ calculateDiscount(product.price, product.salePrice) }}% OFF
          </span>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p class="text-gray-700">{{ product.description }}</p>
        </div>

        <!-- Quantity -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Quantity</h2>
          <div class="flex items-center">
            <button
              @click="decreaseQuantity"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
              :disabled="quantity <= 1"
            >
              <i class="fas fa-minus"></i>
            </button>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              class="w-16 py-2 px-3 text-center border-t border-b border-gray-300"
            />
            <button
              @click="increaseQuantity"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <button
          @click="addToCart"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200"
        >
          <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
        </button>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-12">
      <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-3"></i>
      <h3 class="text-xl font-semibold text-gray-600">Product not found</h3>
      <p class="text-gray-500 mt-2">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <router-link
        to="/products"
        class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Browse Products
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const product = ref(null);
const loading = ref(true);
const error = ref("");
const quantity = ref(1);

onMounted(async () => {
  try {
    const productId = route.params.id;
    product.value = await productStore.fetchProductById(productId);
  } catch (err) {
    error.value = err.message || "Failed to load product";
  } finally {
    loading.value = false;
  }
});

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const calculateDiscount = (originalPrice, salePrice) => {
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  cartStore.addItem(product.value, quantity.value);
};
</script>
