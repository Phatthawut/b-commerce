<template>
  <div class="container relative mx-auto p-8 font-thai">
    <h1 class="text-4xl font-bold py-4">Our Books</h1>
    <div class="">
      <div class="mb-8 flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label
            for="category"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Category</label
          >
          <select
            id="category"
            v-model="selectedCategory"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="books">Books</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1"
            >Sort By</label
          >
          <select
            id="sort"
            v-model="sortBy"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Book cards will go here -->
      <ProductGrid
        :products="filteredProducts"
        :loading="loading"
        :error="error"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProductStore } from "@/stores/productStore";
import ProductGrid from "@/components/product/ProductGrid.vue";

const productStore = useProductStore();
const loading = ref(true);
const error = ref("");
const searchQuery = ref("");
const selectedCategory = ref("");
const sortBy = ref("name");

// Fetch products on component mount
onMounted(async () => {
  try {
    await productStore.fetchProducts();
  } catch (err) {
    error.value = err.message || "Failed to load products";
  } finally {
    loading.value = false;
  }
});

// Watch for category changes
watch(selectedCategory, async (newCategory) => {
  if (newCategory) {
    loading.value = true;
    try {
      await productStore.fetchProductsByCategory(newCategory);
    } catch (err) {
      error.value = err.message || "Failed to load products";
    } finally {
      loading.value = false;
    }
  }
});

// Computed property for filtered and sorted products
const filteredProducts = computed(() => {
  let result = [...productStore.products];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description &&
          product.description.toLowerCase().includes(query))
    );
  }

  // Sort products
  switch (sortBy.value) {
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return result;
});
</script>
