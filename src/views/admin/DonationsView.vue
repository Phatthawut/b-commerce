<template>
  <div class="donations-admin text-black">
    <div class="page-header">
      <h1>Manage Donations</h1>
      <div class="filters">
        <div class="filter-group">
          <label for="status-filter">Status:</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="date-filter">Date Range:</label>
          <select id="date-filter" v-model="dateFilter" class="filter-select">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="search">Search:</label>
          <input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, email, or ID"
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- Debug section -->
    <div class="debug-section">
      <div class="debug-info">
        <p><strong>Store Status:</strong> {{ storeStatus }}</p>
        <p>
          <strong>Donations Count:</strong> {{ donationStore.donations.length }}
        </p>
        <p><strong>Filtered Count:</strong> {{ filteredDonations.length }}</p>
      </div>
      <div class="debug-actions">
        <button @click="createTestData" class="debug-button">
          Create Test Data
        </button>
        <button @click="fetchDonations" class="debug-button">
          Refresh Data
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading donations...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchDonations" class="retry-button">Retry</button>
    </div>

    <div v-else-if="filteredDonations.length === 0" class="no-results">
      <p>No donations found matching your criteria.</p>
    </div>

    <div v-else class="donations-table-container">
      <table class="donations-table">
        <thead>
          <tr>
            <th @click="sortBy('createdAt')" class="sortable">
              Date
              <span v-if="sortField === 'createdAt'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('name')" class="sortable">
              Donor
              <span v-if="sortField === 'name'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('recipientName')" class="sortable">
              Recipient
              <span v-if="sortField === 'recipientName'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('amount')" class="sortable">
              Amount
              <span v-if="sortField === 'amount'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('paymentMethod')" class="sortable">
              Payment Method
              <span v-if="sortField === 'paymentMethod'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('paymentStatus')" class="sortable">
              Status
              <span v-if="sortField === 'paymentStatus'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="donation in filteredDonations"
            :key="donation.id"
            :class="{ 'pending-row': donation.paymentStatus === 'pending' }"
          >
            <td>{{ formatDate(donation.createdAt) }}</td>
            <td>{{ donation.name }}</td>
            <td>{{ donation.recipientName }}</td>
            <td>${{ donation.amount }}</td>
            <td>{{ formatPaymentMethod(donation.paymentMethod) }}</td>
            <td>
              <span :class="'status-badge ' + donation.paymentStatus">
                {{ formatStatus(donation.paymentStatus) }}
              </span>
            </td>
            <td class="actions-cell">
              <button
                @click="viewDonationDetails(donation)"
                class="action-button view-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                View
              </button>
              <button
                v-if="donation.paymentStatus === 'pending'"
                @click="updateStatus(donation.id, 'completed')"
                class="action-button approve-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Approve
              </button>
              <button
                v-if="donation.paymentStatus === 'pending'"
                @click="updateStatus(donation.id, 'failed')"
                class="action-button reject-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Donation Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Donation Details</h2>
          <button @click="showModal = false" class="close-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedDonation">
          <div class="detail-section">
            <h3>Donation Information</h3>
            <div class="detail-row">
              <span class="detail-label">Donation ID:</span>
              <span class="detail-value">{{ selectedDonation.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{
                formatDate(selectedDonation.createdAt)
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value"
                >{{ selectedDonation.amount.toLocaleString() }} THB</span
              >
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">{{
                formatPaymentMethod(selectedDonation.paymentMethod)
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Status:</span>
              <span
                class="detail-value"
                :class="'status-text ' + selectedDonation.paymentStatus"
              >
                {{ formatStatus(selectedDonation.paymentStatus) }}
              </span>
            </div>
            <div class="detail-row" v-if="selectedDonation.paymentDate">
              <span class="detail-label">Payment Date:</span>
              <span class="detail-value">{{
                formatDate(selectedDonation.paymentDate)
              }}</span>
            </div>
          </div>

          <!-- Payment Slip Section (only shown for bank transfers) -->
          <div
            class="detail-section"
            v-if="selectedDonation.paymentMethod === 'bank-transfer'"
          >
            <h3>Payment Verification</h3>

            <div
              v-if="selectedDonation.paymentSlipURL"
              class="payment-slip-container"
            >
              <h4 class="mb-2 font-medium">Payment Slip</h4>
              <div class="payment-slip-image">
                <img
                  :src="selectedDonation.paymentSlipURL"
                  alt="Payment Slip"
                  class="max-w-full h-auto rounded border border-gray-300"
                  @click="
                    openImageInFullscreen(selectedDonation.paymentSlipURL)
                  "
                />
              </div>
              <p class="text-sm text-gray-500 mt-2">
                Click on the image to view in full size
              </p>

              <div class="verification-status mt-4">
                <div
                  v-if="selectedDonation.paymentStatus === 'pending'"
                  class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg
                        class="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        This payment is pending verification. Please review the
                        payment slip and approve or reject the payment.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="selectedDonation.paymentStatus === 'completed'"
                  class="bg-green-50 border-l-4 border-green-400 p-4 mb-4"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg
                        class="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-green-700">
                        This payment has been verified and approved.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="selectedDonation.paymentStatus === 'failed'"
                  class="bg-red-50 border-l-4 border-red-400 p-4 mb-4"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg
                        class="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700">
                        This payment has been rejected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="no-slip-message bg-gray-50 p-4 rounded">
              <p class="text-gray-700">
                No payment slip has been uploaded for this donation.
              </p>
            </div>
          </div>

          <div class="detail-section">
            <h3>Donor Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{ selectedDonation.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ selectedDonation.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ selectedDonation.telephone }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{ selectedDonation.address }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>Recipient Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{
                selectedDonation.recipientName
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category:</span>
              <span class="detail-value">{{
                formatCategory(selectedDonation.recipientCategory)
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Region:</span>
              <span class="detail-value">{{
                selectedDonation.recipientRegion
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{
                selectedDonation.recipientAddress
              }}</span>
            </div>
          </div>

          <div
            class="modal-actions"
            v-if="
              selectedDonation.paymentStatus === 'pending' &&
              selectedDonation.paymentMethod === 'bank-transfer'
            "
          >
            <div class="verification-notes mb-4">
              <label
                for="verification-notes"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Verification Notes (optional)
              </label>
              <textarea
                id="verification-notes"
                v-model="verificationNotes"
                rows="3"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add notes about this payment verification..."
              ></textarea>
            </div>

            <div class="flex space-x-4">
              <button
                @click="
                  updatePaymentVerification(selectedDonation.id, 'completed')
                "
                class="approve-button flex-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Approve Payment
              </button>
              <button
                @click="
                  updatePaymentVerification(selectedDonation.id, 'failed')
                "
                class="reject-button flex-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Reject Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <div
      v-if="showImageModal"
      class="fullscreen-modal"
      @click="showImageModal = false"
    >
      <div class="fullscreen-modal-content">
        <img
          :src="fullscreenImageUrl"
          alt="Payment Slip"
          class="max-w-full max-h-full"
        />
        <button @click="showImageModal = false" class="close-fullscreen-button">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useDonationStore } from "@/stores/donationStore";
import { useRoute } from "vue-router";

// Initialize the donation store
const donationStore = useDonationStore();

// State variables
const showModal = ref(false);
const selectedDonation = ref(null);
const verificationNotes = ref("");
const showImageModal = ref(false);
const fullscreenImageUrl = ref("");

// Filter and sort state
const statusFilter = ref("all");
const dateFilter = ref("all");
const searchQuery = ref("");
const sortField = ref("createdAt");
const sortDirection = ref("desc");

// Debug computed property
const storeStatus = computed(() => {
  if (donationStore.loading) return "Loading";
  if (donationStore.error) return `Error: ${donationStore.error}`;
  return donationStore.donations.length > 0 ? "Data Loaded" : "No Data";
});

// Create test data
const createTestData = async () => {
  try {
    const result = await donationStore.createTestData();
    if (result) {
      alert("Test data created successfully!");
      fetchDonations();
    } else {
      alert("Failed to create test data. Check console for details.");
    }
  } catch (err) {
    console.error("Error in createTestData:", err);
    alert(`Error creating test data: ${err.message}`);
  }
};

// View donation details
const viewDonationDetails = (donation) => {
  selectedDonation.value = donation;
  showModal.value = true;
};

// Sort donations
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Default to descending for date, ascending for everything else
    sortField.value = field;
    sortDirection.value = field === "createdAt" ? "desc" : "asc";
  }
};

// Update donation status using the store
const updateStatus = async (donationId, newStatus) => {
  const success = await donationStore.updateDonationStatus(
    donationId,
    newStatus
  );

  if (success) {
    // If we're updating from the modal, update the selected donation too
    if (selectedDonation.value && selectedDonation.value.id === donationId) {
      selectedDonation.value.paymentStatus = newStatus;
      selectedDonation.value.status = newStatus;
    }

    // Close modal if open
    if (showModal.value) {
      showModal.value = false;
    }

    alert(
      `Donation status updated to ${donationStore.formatStatus(newStatus)}`
    );
  } else {
    alert("Failed to update donation status. Please try again.");
  }
};

// Open image in fullscreen modal
const openImageInFullscreen = (imageUrl) => {
  fullscreenImageUrl.value = imageUrl;
  showImageModal.value = true;
};

// Update payment verification status with notes
const updatePaymentVerification = async (donationId, newStatus) => {
  const paymentData = {
    paymentStatus: newStatus,
    status: newStatus,
    verificationNotes: verificationNotes.value,
    verificationDate: new Date(),
  };

  const success = await donationStore.updateDonationPayment(
    donationId,
    paymentData
  );

  if (success) {
    // If we're updating from the modal, update the selected donation too
    if (selectedDonation.value && selectedDonation.value.id === donationId) {
      selectedDonation.value.paymentStatus = newStatus;
      selectedDonation.value.status = newStatus;
      selectedDonation.value.verificationNotes = verificationNotes.value;
      selectedDonation.value.verificationDate = new Date();
    }

    // Reset verification notes
    verificationNotes.value = "";

    // Close modal if open
    if (showModal.value) {
      showModal.value = false;
    }

    alert(
      `Payment ${
        newStatus === "completed" ? "approved" : "rejected"
      } successfully!`
    );
  } else {
    alert("Failed to update payment status. Please try again.");
  }
};

// Filter donations based on current filters
const filteredDonations = computed(() => {
  let result = [...donationStore.donations];

  // Apply donor filter if provided in URL query
  const route = useRoute();
  if (route.query.donor) {
    const donorPhone = route.query.donor;
    result = result.filter(
      (d) => d.telephone === donorPhone || d.donorId === donorPhone
    );
  }

  // Apply status filter
  if (statusFilter.value !== "all") {
    result = result.filter((d) => d.paymentStatus === statusFilter.value);
  }

  // Apply date filter
  if (dateFilter.value !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    result = result.filter((d) => {
      const donationDate = d.createdAt?.seconds
        ? new Date(d.createdAt.seconds * 1000)
        : new Date(d.createdAt);

      switch (dateFilter.value) {
        case "today":
          return donationDate >= today;
        case "week":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return donationDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return donationDate >= monthAgo;
        case "year":
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return donationDate >= yearAgo;
        default:
          return true;
      }
    });
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (d) =>
        (d.name && d.name.toLowerCase().includes(query)) ||
        (d.email && d.email.toLowerCase().includes(query)) ||
        (d.id && d.id.toLowerCase().includes(query)) ||
        (d.recipientName && d.recipientName.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    // Handle timestamps
    if (sortField.value === "createdAt" || sortField.value === "paymentDate") {
      aValue = aValue?.seconds
        ? aValue.seconds
        : new Date(aValue).getTime() / 1000;
      bValue = bValue?.seconds
        ? bValue.seconds
        : new Date(bValue).getTime() / 1000;
    }

    // Handle null/undefined values
    if (aValue === undefined || aValue === null)
      return sortDirection.value === "asc" ? -1 : 1;
    if (bValue === undefined || bValue === null)
      return sortDirection.value === "asc" ? 1 : -1;

    // Compare values
    if (typeof aValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection.value === "asc" ? comparison : -comparison;
    } else {
      return sortDirection.value === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  return result;
});

// Use the store's formatters
const formatDate = donationStore.formatDate;
const formatPaymentMethod = donationStore.formatPaymentMethod;
const formatStatus = donationStore.formatStatus;
const formatCategory = donationStore.formatCategory;

// Fetch donations on component mount
onMounted(() => {
  donationStore.fetchDonations();
});

// Computed properties for loading and error states
const loading = computed(() => donationStore.loading);
const error = computed(() => donationStore.error);

// Retry fetching donations
const fetchDonations = () => {
  donationStore.fetchDonations();
};
</script>

<style scoped>
.donations-admin {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #4b5563;
}

.filter-select,
.search-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
}

.search-input {
  min-width: 250px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4caf50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #dc3545;
  padding: 2rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.donations-table-container {
  overflow-x: auto;
}

.donations-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.donations-table th,
.donations-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.donations-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-indicator {
  margin-left: 0.25rem;
}

.pending-row {
  background-color: #fff8e1;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.view-button {
  background-color: #e9ecef;
  color: #495057;
}

.approve-button {
  background-color: #d4edda;
  color: #155724;
}

.reject-button {
  background-color: #f8d7da;
  color: #721c24;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.detail-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.detail-label {
  flex: 0 0 120px;
  font-weight: 500;
  color: #6c757d;
}

.detail-value {
  flex: 1;
  color: #2c3e50;
}

.status-text.completed {
  color: #28a745;
  font-weight: 600;
}

.status-text.pending {
  color: #ffc107;
  font-weight: 600;
}

.status-text.failed {
  color: #dc3545;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-select,
  .search-input {
    width: 100%;
  }

  .detail-row {
    flex-direction: column;
  }

  .detail-label {
    margin-bottom: 0.25rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}

.debug-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-info {
  flex: 1;
}

.debug-info p {
  margin: 0.25rem 0;
  font-family: monospace;
}

.debug-actions {
  display: flex;
  gap: 0.5rem;
}

.debug-button {
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.debug-button:hover {
  background-color: #dee2e6;
}

/* Payment slip styles */
.payment-slip-container {
  margin-top: 1rem;
}

.payment-slip-image {
  margin-top: 0.5rem;
  cursor: pointer;
  max-width: 100%;
  max-height: 300px;
  overflow: hidden;
  border-radius: 0.25rem;
}

.payment-slip-image img {
  transition: transform 0.2s;
}

.payment-slip-image img:hover {
  transform: scale(1.02);
}

/* Fullscreen modal */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.fullscreen-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.close-fullscreen-button {
  position: absolute;
  top: -2rem;
  right: -2rem;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

/* Button styles */
.approve-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.approve-button:hover {
  background-color: #059669;
}

.reject-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.reject-button:hover {
  background-color: #dc2626;
}

/* Verification notes */
textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
