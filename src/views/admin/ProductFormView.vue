<template>
  <div class="page-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="section-title">
        {{ isEditing ? "Edit Product" : "Add New Product" }}
      </h1>
      <router-link
        to="/admin/products"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Products
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

    <!-- Product Form -->
    <form
      @submit.prevent="saveProduct"
      class="bg-white shadow-md rounded-lg p-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div>
          <!-- Product Name -->
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Product Name</label
            >
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Category -->
          <div class="mb-4">
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Category</label
            >
            <select
              id="category"
              v-model="form.category"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
            </select>
          </div>

          <!-- Price -->
          <div class="mb-4">
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Price ($)</label
            >
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Sale Price -->
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <label
                for="salePrice"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Sale Price ($)</label
              >
              <div class="flex items-center">
                <input
                  id="onSale"
                  v-model="form.onSale"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="onSale" class="ml-2 text-sm text-gray-700"
                  >On Sale</label
                >
              </div>
            </div>
            <input
              id="salePrice"
              v-model.number="form.salePrice"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :disabled="!form.onSale"
              :required="form.onSale"
            />
          </div>

          <!-- Featured -->
          <div class="mb-4">
            <div class="flex items-center">
              <input
                id="featured"
                v-model="form.featured"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="featured" class="ml-2 text-sm text-gray-700"
                >Featured Product</label
              >
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Description -->
          <div class="mb-4">
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Product Image</label
            >

            <!-- Current Image Preview -->
            <div v-if="form.imageUrl || imagePreview" class="mb-2">
              <img
                :src="imagePreview || form.imageUrl"
                alt="Product preview"
                class="h-40 w-auto object-contain border rounded"
              />
            </div>

            <div class="flex items-center justify-center w-full">
              <label
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div
                  class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                  <i
                    class="fas fa-cloud-upload-alt text-gray-500 text-2xl mb-2"
                  ></i>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p class="text-xs text-gray-500">
                    PNG, JPG or JPEG (MAX. 2MB)
                  </p>
                </div>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-6 flex justify-end">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          :disabled="saving"
        >
          <span v-if="saving">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            {{ isEditing ? "Updating..." : "Creating..." }}
          </span>
          <span v-else>{{
            isEditing ? "Update Product" : "Create Product"
          }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "@/stores/productStore";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

const loading = ref(false);
const saving = ref(false);
const error = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);

const isEditing = computed(() => !!route.params.id);

const form = ref({
  name: "",
  description: "",
  price: 0,
  salePrice: 0,
  onSale: false,
  featured: false,
  category: "",
  imageUrl: "",
});

onMounted(async () => {
  if (isEditing.value) {
    loading.value = true;
    try {
      const product = await productStore.fetchProductById(route.params.id);
      form.value = {
        name: product.name,
        description: product.description || "",
        price: product.price,
        salePrice: product.salePrice || 0,
        onSale: !!product.onSale,
        featured: !!product.featured,
        category: product.category || "",
        imageUrl: product.imageUrl || "",
      };
    } catch (err) {
      error.value = err.message || "Failed to load product";
    } finally {
      loading.value = false;
    }
  }
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    error.value = "Image size should not exceed 2MB";
    return;
  }

  imageFile.value = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const saveProduct = async () => {
  saving.value = true;
  error.value = "";

  try {
    if (isEditing.value) {
      await productStore.updateProduct(
        route.params.id,
        form.value,
        imageFile.value
      );
    } else {
      await productStore.createProduct(form.value, imageFile.value);
    }
    router.push("/admin/products");
  } catch (err) {
    error.value = err.message || "Failed to save product";
    saving.value = false;
  }
};
</script>
