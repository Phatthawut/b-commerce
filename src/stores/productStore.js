import { defineStore } from "pinia";
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/firebase/products";

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    featuredProducts: [],
    currentProduct: null,
    loading: false,
    error: null,
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find((product) => product.id === id);
    },

    getProductsByCategory: (state) => (category) => {
      return state.products.filter((product) => product.category === category);
    },
  },

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const products = await getProducts();
        this.products = products;
        return products;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id) {
      this.loading = true;
      this.error = null;

      try {
        const product = await getProductById(id);
        this.currentProduct = product;
        return product;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProductsByCategory(category) {
      this.loading = true;
      this.error = null;

      try {
        const products = await getProductsByCategory(category);
        return products;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchFeaturedProducts(limit) {
      this.loading = true;
      this.error = null;

      try {
        const products = await getFeaturedProducts(limit);
        this.featuredProducts = products;
        return products;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin actions
    async createProduct(productData, imageFile) {
      this.loading = true;
      this.error = null;

      try {
        const product = await addProduct(productData, imageFile);
        this.products.push(product);
        return product;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id, productData, imageFile) {
      this.loading = true;
      this.error = null;

      try {
        const updatedProduct = await updateProduct(id, productData, imageFile);

        // Update product in state
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        // Update current product if it's the same
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = updatedProduct;
        }

        return updatedProduct;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeProduct(id) {
      this.loading = true;
      this.error = null;

      try {
        await deleteProduct(id);

        // Remove product from state
        this.products = this.products.filter((p) => p.id !== id);

        // Clear current product if it's the same
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = null;
        }

        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
