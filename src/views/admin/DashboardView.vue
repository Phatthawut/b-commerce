<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      Book Donation Dashboard
    </h1>

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
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Donations</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.totalDonations }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span
            :class="
              stats.donationsTrend > 0 ? 'text-green-600' : 'text-red-600'
            "
            class="text-sm font-medium"
          >
            {{ stats.donationsTrend > 0 ? "+" : "" }}{{ stats.donationsTrend }}%
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
            <p class="text-sm text-gray-600">Total Amount</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.totalAmount.toLocaleString() }} THB
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span
            :class="stats.amountTrend > 0 ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ stats.amountTrend > 0 ? "+" : "" }}{{ stats.amountTrend }}%
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Donors</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.totalDonors }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-green-600 text-sm font-medium"
            >+{{ stats.newDonors }}</span
          >
          <span class="text-sm text-gray-600 ml-2">new this month</span>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Completed Donations</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats.completedDonations }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600">
            {{ stats.pendingDonations }} pending approval
          </span>
        </div>
      </div>
    </div>

    <!-- Shipment Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Shipments</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ shipmentStats.totalShipments }}
            </p>
          </div>
        </div>
      </div>

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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">In Progress</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ shipmentStats.inProgressShipments }}
            </p>
          </div>
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Delivered</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ shipmentStats.deliveredShipments }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          to="/admin/donations"
          class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-center"
        >
          Manage Donations
        </router-link>
        <router-link
          to="/admin/shipments"
          class="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 text-center"
        >
          Manage Shipments
        </router-link>
        <button
          @click="refreshStats"
          class="bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 text-center"
        >
          Refresh Dashboard
        </button>
      </div>
    </div>

    <!-- Recent Donations -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Recent Donations</h2>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div
        v-else-if="recentDonations.length === 0"
        class="p-6 text-center text-gray-600"
      >
        No recent donations found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Donation ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Donor
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Recipient
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
                Amount
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
            <tr v-for="donation in recentDonations" :key="donation.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                #{{ donation.id.substring(0, 8) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ donation.donorName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ donation.recipientName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(donation.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ donation.amount.toLocaleString() }} THB
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      donation.paymentStatus === 'pending',
                    'bg-blue-100 text-blue-800':
                      donation.paymentStatus === 'processing',
                    'bg-green-100 text-green-800':
                      donation.paymentStatus === 'completed',
                    'bg-red-100 text-red-800':
                      donation.paymentStatus === 'failed',
                  }"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ capitalizeFirstLetter(donation.paymentStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewDonationDetails(donation)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-200">
        <router-link
          to="/admin/donations"
          class="text-blue-600 hover:text-blue-900 text-sm font-medium"
        >
          View All Donations
        </router-link>
      </div>
    </div>

    <!-- Recent Shipments -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Recent Shipments</h2>
      </div>

      <div v-if="loadingShipments" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        ></div>
      </div>

      <div
        v-else-if="recentShipments.length === 0"
        class="p-6 text-center text-gray-600"
      >
        No recent shipments found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Shipment ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Donation ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Recipient
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
            <tr v-for="shipment in recentShipments" :key="shipment.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                #{{ shipment.id.substring(0, 8) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ shipment.donationId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ shipment.recipientName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(shipment.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      shipment.status === 'pending',
                    'bg-blue-100 text-blue-800':
                      shipment.status === 'processing',
                    'bg-purple-100 text-purple-800':
                      shipment.status === 'shipped',
                    'bg-green-100 text-green-800':
                      shipment.status === 'delivered',
                    'bg-red-100 text-red-800': shipment.status === 'cancelled',
                  }"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ capitalizeFirstLetter(shipment.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewShipmentDetails(shipment)"
                  class="text-purple-600 hover:text-purple-900"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-200">
        <router-link
          to="/admin/shipments"
          class="text-purple-600 hover:text-purple-900 text-sm font-medium"
        >
          View All Shipments
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useDonationStore } from "@/stores/donationStore";
import { useDonorStore } from "@/stores/donorStore";
import { useShipmentStore } from "@/stores/shipmentStore";

const router = useRouter();
const donationStore = useDonationStore();
const donorStore = useDonorStore();
const shipmentStore = useShipmentStore();

const loading = ref(true);
const loadingShipments = ref(true);
const recentDonations = ref([]);
const recentShipments = ref([]);

// Dashboard statistics
const stats = ref({
  totalDonations: 0,
  donationsTrend: 0,
  totalAmount: 0,
  amountTrend: 0,
  totalDonors: 0,
  newDonors: 0,
  completedDonations: 0,
  pendingDonations: 0,
});

// Shipment statistics
const shipmentStats = ref({
  totalShipments: 0,
  inProgressShipments: 0,
  deliveredShipments: 0,
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

// View donation details
const viewDonationDetails = (donation) => {
  // Navigate to donation details or open a modal
  router.push({
    path: "/admin/donations",
    query: { id: donation.id },
  });
};

// View shipment details
const viewShipmentDetails = (shipment) => {
  // Navigate to shipment details or open a modal
  router.push({
    path: "/admin/shipments",
    query: { id: shipment.id },
  });
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true;
  loadingShipments.value = true;

  try {
    // Fetch recent donations
    const donationsQuery = query(
      collection(db, "donations"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const donationsSnapshot = await getDocs(donationsQuery);
    recentDonations.value = donationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        donorName: data.donorName || "Anonymous",
        recipientName: data.recipientName || data.recipient?.name || "Unknown",
        amount: data.amount || 0,
        paymentStatus: data.paymentStatus || "pending",
      };
    });

    // Count donations by status
    const allDonationsQuery = query(collection(db, "donations"));
    const allDonationsSnapshot = await getDocs(allDonationsQuery);

    stats.value.totalDonations = allDonationsSnapshot.size;

    let totalAmount = 0;
    let completedCount = 0;
    let pendingCount = 0;

    allDonationsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalAmount += data.amount || 0;

      if (data.paymentStatus === "completed") {
        completedCount++;
      } else if (data.paymentStatus === "pending") {
        pendingCount++;
      }
    });

    stats.value.totalAmount = totalAmount;
    stats.value.completedDonations = completedCount;
    stats.value.pendingDonations = pendingCount;

    // Count donors
    const donorsQuery = query(collection(db, "donors"));
    const donorsSnapshot = await getDocs(donorsQuery);
    stats.value.totalDonors = donorsSnapshot.size;

    // Count new donors (donors from the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newDonorsQuery = query(
      collection(db, "donors"),
      where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo))
    );

    const newDonorsSnapshot = await getDocs(newDonorsQuery);
    stats.value.newDonors = newDonorsSnapshot.size;

    // Fetch recent shipments
    const shipmentsQuery = query(
      collection(db, "shipments"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const shipmentsSnapshot = await getDocs(shipmentsQuery);
    recentShipments.value = shipmentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    // Count shipments by status
    const allShipmentsQuery = query(collection(db, "shipments"));
    const allShipmentsSnapshot = await getDocs(allShipmentsQuery);

    shipmentStats.value.totalShipments = allShipmentsSnapshot.size;

    let inProgressCount = 0;
    let deliveredCount = 0;

    allShipmentsSnapshot.docs.forEach((doc) => {
      const data = doc.data();

      if (data.status === "delivered") {
        deliveredCount++;
      } else if (
        data.status === "pending" ||
        data.status === "processing" ||
        data.status === "shipped"
      ) {
        inProgressCount++;
      }
    });

    shipmentStats.value.inProgressShipments = inProgressCount;
    shipmentStats.value.deliveredShipments = deliveredCount;

    // Calculate donation distribution (in a real app, this would be based on actual data)
    // For now, we'll use the static data defined above
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    loading.value = false;
    loadingShipments.value = false;
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
