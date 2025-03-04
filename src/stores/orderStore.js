import { defineStore } from "pinia";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "@/firebase/orders";

export const useOrderStore = defineStore("orders", {
  state: () => ({
    orders: [],
    userOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAllOrders() {
      this.loading = true;
      this.error = null;

      try {
        const orders = await getAllOrders();
        this.orders = orders;
        return orders;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserOrders(userId) {
      this.loading = true;
      this.error = null;

      try {
        const orders = await getUserOrders(userId);
        this.userOrders = orders;
        return orders;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderById(id) {
      this.loading = true;
      this.error = null;

      try {
        const order = await getOrderById(id);
        this.currentOrder = order;
        return order;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async placeOrder(orderData) {
      this.loading = true;
      this.error = null;

      try {
        const order = await createOrder(orderData);
        this.orders.unshift(order);
        this.userOrders.unshift(order);
        this.currentOrder = order;
        return order;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(id, status) {
      this.loading = true;
      this.error = null;

      try {
        const updatedOrder = await updateOrderStatus(id, status);

        // Update order in all orders
        const orderIndex = this.orders.findIndex((o) => o.id === id);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = {
            ...this.orders[orderIndex],
            status,
            updatedAt: updatedOrder.updatedAt,
          };
        }

        // Update order in user orders
        const userOrderIndex = this.userOrders.findIndex((o) => o.id === id);
        if (userOrderIndex !== -1) {
          this.userOrders[userOrderIndex] = {
            ...this.userOrders[userOrderIndex],
            status,
            updatedAt: updatedOrder.updatedAt,
          };
        }

        // Update current order if it's the same
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = {
            ...this.currentOrder,
            status,
            updatedAt: updatedOrder.updatedAt,
          };
        }

        return updatedOrder;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
