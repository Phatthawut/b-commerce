<template>
  <div class="page-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="section-title">Product Management</h1>
      <router-link
        to="/admin/products/new"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
      >
        <i class="fas fa-plus mr-2"></i> Add New Product
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

    <!-- Empty State -->
    <div
      v-else-if="productStore.products.length === 0"
      class="text-center py-12"
    >
      <i class="fas fa-box-open text-4xl text-gray-400 mb-3"></i>
      <h3 class="text-xl font-semibold text-gray-600">No products found</h3>
      <p class="text-gray-500 mt-2">
        Get started by adding your first product.
      </p>
      <router-link
        to="/admin/products/new"
        class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Add Product
      </router-link>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price
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
          <tr v-for="product in productStore.products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    :src="product.imageUrl || '/images/placeholder.jpg'"
                    :alt="product.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </div>
                  <div class="text-sm text-gray-500">ID: {{ product.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.category }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="product.onSale" class="flex items-center">
                <span class="text-sm font-medium text-red-600"
                  >${{ formatPrice(product.salePrice) }}</span
                >
                <span class="text-sm text-gray-500 line-through ml-2"
                  >${{ formatPrice(product.price) }}</span
                >
              </div>
              <div v-else class="text-sm text-gray-900">
                ${{ formatPrice(product.price) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': product.featured,
                  'bg-gray-100 text-gray-800': !product.featured,
                }"
              >
                {{ product.featured ? "Featured" : "Standard" }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <router-link
                :to="`/admin/products/${product.id}/edit`"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Edit
              </router-link>
              <button
                @click="confirmDelete(product)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-gray-500 mb-6">
          Are you sure you want to delete "{{ productToDelete?.name }}"? This
          action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            @click="deleteProduct"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
            :disabled="deleteLoading"
          >
            <span v-if="deleteLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i> Deleting...
            </span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";

const productStore = useProductStore();
const loading = ref(true);
const error = ref("");
const showDeleteModal = ref(false);
const productToDelete = ref(null);
const deleteLoading = ref(false);

onMounted(async () => {
  try {
    await productStore.fetchProducts();
  } catch (err) {
    error.value = err.message || "Failed to load products";
  } finally {
    loading.value = false;
  }
});

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  if (!productToDelete.value) return;

  deleteLoading.value = true;
  try {
    await productStore.removeProduct(productToDelete.value.id);
    showDeleteModal.value = false;
    productToDelete.value = null;
  } catch (err) {
    error.value = err.message || "Failed to delete product";
  } finally {
    deleteLoading.value = false;
  }
};
</script>
