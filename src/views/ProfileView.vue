<template>
  <div class="profile-view">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
        ></div>
      </div>

      <div
        v-else-if="!authStore.isAuthenticated"
        class="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <p class="text-lg text-gray-700 mb-4">
          Please log in to view your profile.
        </p>
        <router-link
          to="/login"
          class="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Login
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Profile Information -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
            </div>

            <div class="p-6">
              <div class="flex flex-col items-center mb-6">
                <div
                  v-if="authStore.user.photoURL"
                  class="w-24 h-24 rounded-full overflow-hidden mb-4"
                >
                  <img
                    :src="authStore.user.photoURL"
                    alt="Profile Photo"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4"
                >
                  <span class="text-2xl font-bold text-green-600">{{
                    getUserInitials
                  }}</span>
                </div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ authStore.user.displayName }}
                </h3>
                <p class="text-sm text-gray-600">{{ authStore.user.email }}</p>
              </div>

              <div v-if="!isEditing">
                <div class="mb-4">
                  <p class="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p class="text-gray-900">
                    {{ authStore.user.phoneNumber || "Not provided" }}
                  </p>
                </div>

                <div class="mb-4">
                  <p class="text-sm text-gray-500 mb-1">Address</p>
                  <p class="text-gray-900">
                    {{ authStore.user.address || "Not provided" }}
                  </p>
                </div>

                <div class="mb-4">
                  <p class="text-sm text-gray-500 mb-1">Member Since</p>
                  <p class="text-gray-900">
                    {{ formatDate(authStore.user.createdAt) }}
                  </p>
                </div>

                <button
                  @click="startEditing"
                  class="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <form v-else @submit.prevent="updateProfile" class="space-y-4">
                <div>
                  <label
                    for="displayName"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Full Name</label
                  >
                  <input
                    type="text"
                    id="displayName"
                    v-model="profileForm.displayName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    for="phoneNumber"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Phone Number</label
                  >
                  <input
                    type="tel"
                    id="phoneNumber"
                    v-model="profileForm.phoneNumber"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Address</label
                  >
                  <textarea
                    id="address"
                    v-model="profileForm.address"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div class="flex space-x-3">
                  <button
                    type="submit"
                    class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    :disabled="updateLoading"
                  >
                    <span v-if="updateLoading">Saving...</span>
                    <span v-else>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    @click="cancelEditing"
                    class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    :disabled="updateLoading"
                  >
                    Cancel
                  </button>
                </div>

                <div
                  v-if="updateError"
                  class="p-3 bg-red-100 text-red-700 rounded-md text-sm"
                >
                  {{ updateError }}
                </div>
              </form>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">
                Account Actions
              </h2>
            </div>

            <div class="p-6">
              <button
                @click="logout"
                class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Donation History -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">
                Donation History
              </h2>
            </div>

            <div v-if="donationsLoading" class="flex justify-center py-12">
              <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
              ></div>
            </div>

            <div
              v-else-if="userDonations.length === 0"
              class="p-6 text-center text-gray-600"
            >
              <p>You haven't made any donations yet.</p>
              <router-link
                to="/donate"
                class="inline-block mt-4 text-green-600 hover:text-green-700"
              >
                Make your first donation
              </router-link>
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
                  <tr v-for="donation in userDonations" :key="donation.id">
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      #{{ donation.id.substring(0, 8) }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ formatDate(donation.timestamp) }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ formatCurrency(donation.amount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="{
                          'bg-yellow-100 text-yellow-800':
                            donation.status === 'pending',
                          'bg-blue-100 text-blue-800':
                            donation.status === 'processing',
                          'bg-green-100 text-green-800':
                            donation.status === 'completed',
                          'bg-red-100 text-red-800':
                            donation.status === 'failed',
                        }"
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {{ capitalizeFirstLetter(donation.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        @click="viewDonationDetails(donation)"
                        class="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Donation Statistics -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">
                Donation Statistics
              </h2>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-green-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">Total Donations</p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ userDonations.length }}
                  </p>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">Total Amount</p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(totalDonationAmount) }}
                  </p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">Last Donation</p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{
                      userDonations.length > 0
                        ? formatDate(userDonations[0].timestamp)
                        : "N/A"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donation Details Modal -->
      <div
        v-if="selectedDonation"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div
            class="p-6 border-b border-gray-200 flex justify-between items-center"
          >
            <h3 class="text-xl font-semibold text-gray-900">
              Donation Details
            </h3>
            <button
              @click="selectedDonation = null"
              class="text-gray-500 hover:text-gray-700"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Donation ID</p>
                <p class="text-gray-900">#{{ selectedDonation.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Date</p>
                <p class="text-gray-900">
                  {{ formatDate(selectedDonation.timestamp) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Amount</p>
                <p class="text-gray-900">
                  {{ formatCurrency(selectedDonation.amount) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Status</p>
                <p class="text-gray-900">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800':
                        selectedDonation.status === 'pending',
                      'bg-blue-100 text-blue-800':
                        selectedDonation.status === 'processing',
                      'bg-green-100 text-green-800':
                        selectedDonation.status === 'completed',
                      'bg-red-100 text-red-800':
                        selectedDonation.status === 'failed',
                    }"
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ capitalizeFirstLetter(selectedDonation.status) }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Payment Method</p>
                <p class="text-gray-900">
                  {{ selectedDonation.paymentMethod || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Notes</p>
                <p class="text-gray-900">
                  {{ selectedDonation.notes || "No notes" }}
                </p>
              </div>
            </div>

            <div
              v-if="selectedDonation.items && selectedDonation.items.length > 0"
            >
              <h4 class="font-medium text-gray-900 mb-3">Donated Items</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div
                  v-for="(item, index) in selectedDonation.items"
                  :key="index"
                  class="mb-2 last:mb-0"
                >
                  <div class="flex justify-between">
                    <span class="text-gray-800">{{ item.name }}</span>
                    <span class="text-gray-600"
                      >Quantity: {{ item.quantity }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="font-medium text-gray-900 mb-3">Shipment Status</h4>
              <div v-if="donationShipments.length === 0" class="text-gray-600">
                No shipments created yet for this donation.
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="shipment in donationShipments"
                  :key="shipment.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium"
                      >Shipment #{{ shipment.id.substring(0, 8) }}</span
                    >
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
                        'bg-red-100 text-red-800':
                          shipment.status === 'cancelled',
                      }"
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ capitalizeFirstLetter(shipment.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium">Recipient:</span>
                    {{ shipment.recipientName }}
                  </p>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium">Created:</span>
                    {{ formatDate(shipment.createdAt) }}
                  </p>
                  <div v-if="shipment.trackingNumber" class="mt-2 text-sm">
                    <p class="text-gray-600">
                      <span class="font-medium">Tracking:</span>
                      {{ shipment.trackingNumber }} ({{ shipment.carrier }})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useDonationStore } from "@/stores/donationStore";
import { useShipmentStore } from "@/stores/shipmentStore";

const router = useRouter();
const authStore = useAuthStore();
const donationStore = useDonationStore();
const shipmentStore = useShipmentStore();

// State
const loading = ref(true);
const donationsLoading = ref(false);
const isEditing = ref(false);
const updateLoading = ref(false);
const updateError = ref("");
const userDonations = ref([]);
const selectedDonation = ref(null);
const donationShipments = ref([]);

// Profile form
const profileForm = ref({
  displayName: "",
  phoneNumber: "",
  address: "",
});

// Get user initials for avatar
const getUserInitials = computed(() => {
  if (!authStore.user?.displayName) return "?";

  return authStore.user.displayName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
});

// Calculate total donation amount
const totalDonationAmount = computed(() => {
  return userDonations.value.reduce((total, donation) => {
    return total + (donation.amount || 0);
  }, 0);
});

// Initialize component
onMounted(async () => {
  try {
    // Initialize auth if not already done
    if (!authStore.user && !authStore.loading) {
      await authStore.initAuth();
    }

    // Wait for auth to initialize
    if (authStore.loading) {
      await new Promise((resolve) => {
        const checkLoading = () => {
          if (!authStore.loading) {
            resolve();
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // If user is authenticated, fetch their donations
    if (authStore.isAuthenticated) {
      await fetchUserDonations();
    }
  } catch (err) {
    console.error("Error initializing profile:", err);
  } finally {
    loading.value = false;
  }
});

// Fetch user donations
const fetchUserDonations = async () => {
  if (!authStore.user) return;

  donationsLoading.value = true;
  try {
    const donations = await donationStore.fetchDonationsByDonorId(
      authStore.user.uid
    );
    userDonations.value = donations;
  } catch (err) {
    console.error("Error fetching user donations:", err);
  } finally {
    donationsLoading.value = false;
  }
};

// Start editing profile
const startEditing = () => {
  profileForm.value = {
    displayName: authStore.user.displayName || "",
    phoneNumber: authStore.user.phoneNumber || "",
    address: authStore.user.address || "",
  };
  isEditing.value = true;
};

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false;
  updateError.value = "";
};

// Update profile
const updateProfile = async () => {
  updateLoading.value = true;
  updateError.value = "";

  try {
    const success = await authStore.updateUserProfile({
      displayName: profileForm.value.displayName,
      phoneNumber: profileForm.value.phoneNumber,
      address: profileForm.value.address,
    });

    if (success) {
      isEditing.value = false;
    } else {
      updateError.value =
        authStore.error || "Failed to update profile. Please try again.";
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    updateError.value =
      err.message || "An unexpected error occurred. Please try again.";
  } finally {
    updateLoading.value = false;
  }
};

// View donation details
const viewDonationDetails = async (donation) => {
  selectedDonation.value = donation;

  // Fetch shipments for this donation
  try {
    const shipments = await shipmentStore.fetchShipmentsByDonationId(
      donation.id
    );
    donationShipments.value = shipments;
  } catch (err) {
    console.error("Error fetching shipments for donation:", err);
    donationShipments.value = [];
  }
};

// Logout
const logout = async () => {
  await authStore.logout();
  router.push("/");
};

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  // Handle Firestore Timestamp objects
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  // Handle Date objects or ISO strings
  return new Date(timestamp).toLocaleString();
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount || 0);
};

// Capitalize first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>
