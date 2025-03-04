<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Orders</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.totalOrders }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span
            :class="stats.ordersTrend > 0 ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ stats.ordersTrend > 0 ? "+" : "" }}{{ stats.ordersTrend }}%
          </span>
          <span class="text-sm text-gray-600 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Revenue</p>
            <p class="text-2xl font-semibold text-gray-900">
              ${{ stats.revenue.toFixed(2) }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span
            :class="stats.revenueTrend > 0 ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ stats.revenueTrend > 0 ? "+" : "" }}{{ stats.revenueTrend }}%
          </span>
          <span class="text-sm text-gray-600 ml-2">from last month</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Products</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.totalProducts }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600"
            >{{ stats.lowStockProducts }} low in stock</span
          >
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Customers</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.totalCustomers }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-green-600 text-sm font-medium"
            >+{{ stats.newCustomers }}</span
          >
          <span class="text-sm text-gray-600 ml-2">new this month</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/admin/products/new"
          class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-center"
        >
          Add New Product
        </router-link>
        <router-link
          to="/admin/orders"
          class="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-center"
        >
          Manage Orders
        </router-link>
        <button
          @click="refreshStats"
          class="bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 text-center"
        >
          Refresh Dashboard
        </button>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Recent Orders</h2>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div
        v-else-if="recentOrders.length === 0"
        class="p-6 text-center text-gray-600"
      >
        No recent orders found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in recentOrders" :key="order.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                #{{ order.id.substring(0, 8) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.customerName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ order.total.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-blue-100 text-blue-800': order.status === 'processing',
                    'bg-purple-100 text-purple-800': order.status === 'shipped',
                    'bg-green-100 text-green-800': order.status === 'delivered',
                    'bg-red-100 text-red-800': order.status === 'cancelled',
                  }"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ capitalizeFirstLetter(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/admin/orders/${order.id}`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-200">
        <router-link
          to="/admin/orders"
          class="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          View All Orders
        </router-link>
      </div>
    </div>

    <!-- Low Stock Products -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Low Stock Products</h2>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div
        v-else-if="lowStockProducts.length === 0"
        class="p-6 text-center text-gray-600"
      >
        No low stock products found.
      </div>

      <div v-else class="overflow-x-auto">
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
                Stock
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in lowStockProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img
                      class="h-10 w-10 rounded-full object-cover"
                      :src="product.imageUrl"
                      alt=""
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span v-if="product.salePrice" class="text-red-600 font-bold"
                  >${{ product.salePrice.toFixed(2) }}</span
                >
                <span
                  v-if="product.salePrice"
                  class="text-gray-500 line-through ml-2"
                  >${{ product.price.toFixed(2) }}</span
                >
                <span v-else>${{ product.price.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                >
                  {{ product.stock }} left
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/admin/products/${product.id}/edit`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-200">
        <router-link
          to="/admin/products"
          class="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          View All Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";

const loading = ref(true);
const recentOrders = ref([]);
const lowStockProducts = ref([]);

// Dashboard statistics
const stats = ref({
  totalOrders: 0,
  ordersTrend: 12,
  revenue: 0,
  revenueTrend: 8,
  totalProducts: 0,
  lowStockProducts: 0,
  totalCustomers: 0,
  newCustomers: 0,
});

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Capitalize first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true;

  try {
    // Fetch recent orders
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    recentOrders.value = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      customerName: doc.data().shippingInfo?.name || "Unknown",
    }));

    // Fetch low stock products
    const productsQuery = query(
      collection(db, "products"),
      where("stock", "<", 10),
      limit(5)
    );

    const productsSnapshot = await getDocs(productsQuery);
    lowStockProducts.value = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update stats
    const allOrdersQuery = query(collection(db, "orders"));
    const allOrdersSnapshot = await getDocs(allOrdersQuery);

    stats.value.totalOrders = allOrdersSnapshot.size;
    stats.value.revenue = allOrdersSnapshot.docs.reduce((total, doc) => {
      return total + (doc.data().total || 0);
    }, 0);

    const allProductsQuery = query(collection(db, "products"));
    const allProductsSnapshot = await getDocs(allProductsQuery);

    stats.value.totalProducts = allProductsSnapshot.size;
    stats.value.lowStockProducts = productsSnapshot.size;

    const allUsersQuery = query(collection(db, "users"));
    const allUsersSnapshot = await getDocs(allUsersQuery);

    stats.value.totalCustomers = allUsersSnapshot.size;
    stats.value.newCustomers = Math.floor(allUsersSnapshot.size * 0.1); // Placeholder for demo
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

// Refresh stats
const refreshStats = () => {
  fetchDashboardData();
};

// Fetch data on component mount
onMounted(() => {
  fetchDashboardData();
});
</script>
