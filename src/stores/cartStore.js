import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    isOpen: false,
  }),

  getters: {
    count: (state) => state.items.length,

    isEmpty: (state) => state.items.length === 0,

    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
  },

  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        });
      }

      // Save to localStorage
      this.saveCart();
    },

    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId);

      // Save to localStorage
      this.saveCart();
    },

    updateItemQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId);

      if (item) {
        item.quantity = quantity;

        // Remove item if quantity is 0
        if (quantity <= 0) {
          this.removeItem(productId);
          return;
        }
      }

      // Save to localStorage
      this.saveCart();
    },

    clearCart() {
      this.items = [];

      // Save to localStorage
      this.saveCart();
    },

    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    loadCart() {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },
  },
});
