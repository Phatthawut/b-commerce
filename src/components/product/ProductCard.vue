<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <div class="relative">
      <!-- Product Image -->
      <img
        :src="product.imageUrl || '/images/placeholder.jpg'"
        :alt="product.name"
        class="w-full h-48 object-cover"
      />

      <!-- Badge for sale or featured -->
      <div
        v-if="product.onSale"
        class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        Sale
      </div>
      <div
        v-if="product.featured && !product.onSale"
        class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        Featured
      </div>
    </div>

    <div class="p-4">
      <!-- Product Name -->
      <h3 class="text-lg font-semibold text-gray-800 mb-1 truncate">
        {{ product.name }}
      </h3>

      <!-- Product Category -->
      <p class="text-sm text-gray-500 mb-2">{{ product.category }}</p>

      <!-- Product Price -->
      <div class="flex items-center mb-3">
        <span v-if="product.onSale" class="text-lg font-bold text-red-500 mr-2"
          >${{ formatPrice(product.salePrice) }}</span
        >
        <span
          :class="{
            'text-lg font-bold text-gray-800': !product.onSale,
            'text-sm line-through text-gray-500': product.onSale,
          }"
        >
          ${{ formatPrice(product.price) }}
        </span>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click="addToCart"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cartStore";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const cartStore = useCartStore();

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const addToCart = () => {
  cartStore.addItem(props.product, 1);
};
</script>
