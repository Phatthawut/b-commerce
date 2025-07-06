<template>
  <div class="donors-admin text-black">
    <div class="page-header">
      <h1>Manage Donors</h1>
      <div class="filters">
        <div class="filter-group">
          <label for="search">Search:</label>
          <input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, email, or phone"
            class="search-input"
          />
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
          <label for="sort-by">Sort By:</label>
          <select
            id="sort-by"
            v-model="sortField"
            class="filter-select"
            @change="
              sortDirection = sortField === 'lastDonation' ? 'desc' : 'asc'
            "
          >
            <option value="name">Name</option>
            <option value="lastDonation">Last Donation</option>
            <option value="totalDonations">Total Donations</option>
            <option value="totalAmount">Total Amount</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading donors...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchDonors" class="retry-button">Retry</button>
    </div>

    <div v-else-if="filteredDonors.length === 0" class="no-results">
      <p>No donors found matching your criteria.</p>
    </div>

    <div v-else class="donors-table-container">
      <table class="donors-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Name
              <span v-if="sortField === 'name'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('email')" class="sortable">
              Email
              <span v-if="sortField === 'email'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('telephone')" class="sortable">
              Phone
              <span v-if="sortField === 'telephone'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('totalDonations')" class="sortable">
              Donations
              <span
                v-if="sortField === 'totalDonations'"
                class="sort-indicator"
              >
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('totalAmount')" class="sortable">
              Total Amount
              <span v-if="sortField === 'totalAmount'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('lastDonation')" class="sortable">
              Last Donation
              <span v-if="sortField === 'lastDonation'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donor in filteredDonors" :key="donor.id">
            <td>{{ donor.name }}</td>
            <td>{{ donor.email || "N/A" }}</td>
            <td>{{ donor.telephone }}</td>
            <td>{{ donor.totalDonations || 0 }}</td>
            <td>{{ formatCurrency(donor.totalAmount) }}</td>
            <td>{{ formatDate(donor.lastDonation) }}</td>
            <td class="actions-cell">
              <button
                @click="viewDonorDetails(donor)"
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
                @click="viewDonorDonations(donor)"
                class="action-button donations-button"
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
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                Donations
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Donor Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Donor Details</h2>
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
        <div class="modal-body" v-if="selectedDonor">
          <div class="detail-section">
            <h3>Donor Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{ selectedDonor.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{
                selectedDonor.email || "N/A"
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">{{ selectedDonor.telephone }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{
                selectedDonor.address || "N/A"
              }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>Donation History</h3>
            <div class="detail-row">
              <span class="detail-label">First Donation:</span>
              <span class="detail-value">{{
                formatDate(selectedDonor.createdAt)
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Donation:</span>
              <span class="detail-value">{{
                formatDate(selectedDonor.lastDonation)
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Donations:</span>
              <span class="detail-value">{{
                selectedDonor.totalDonations || 0
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value">{{
                formatCurrency(selectedDonor.totalAmount)
              }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button
              @click="viewDonorDonations(selectedDonor)"
              class="donations-button"
            >
              View Donations
            </button>
            <button @click="editDonor(selectedDonor)" class="edit-button">
              Edit Donor
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDonorStore } from "@/stores/donorStore";
import { useDonationStore } from "@/stores/donationStore";

const router = useRouter();
const donorStore = useDonorStore();
const donationStore = useDonationStore();

// State variables
const showModal = ref(false);
const selectedDonor = ref(null);

// Filter and sort state
const searchQuery = ref("");
const dateFilter = ref("all");
const sortField = ref("lastDonation");
const sortDirection = ref("desc");

// View donor details
const viewDonorDetails = (donor) => {
  selectedDonor.value = donor;
  showModal.value = true;
};

// View donor donations
const viewDonorDonations = (donor) => {
  // Close modal if open
  if (showModal.value) {
    showModal.value = false;
  }

  // Navigate to donations view with filter for this donor
  router.push({
    path: "/admin/donations",
    query: { donor: donor.id },
  });
};

// Edit donor
const editDonor = (donor) => {
  // This would typically open an edit form or modal
  // For now, we'll just log it
  console.log("Edit donor:", {
    donorId: donor.id,
    hasName: !!donor.name,
    hasEmail: !!donor.email,
    hasPhone: !!donor.telephone,
    timestamp: new Date().toISOString(),
  });
  alert("Donor editing functionality will be implemented in a future update.");
};

// Sort donors
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Default to descending for date and amounts, ascending for everything else
    sortField.value = field;
    sortDirection.value =
      field === "lastDonation" ||
      field === "totalAmount" ||
      field === "totalDonations"
        ? "desc"
        : "asc";
  }
};

// Filter donors based on current filters
const filteredDonors = computed(() => {
  let result = [...donorStore.donors];

  // Apply date filter
  if (dateFilter.value !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    result = result.filter((d) => {
      const donationDate = d.lastDonation?.seconds
        ? new Date(d.lastDonation.seconds * 1000)
        : new Date(d.lastDonation);

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
        (d.telephone && d.telephone.includes(query)) ||
        (d.address && d.address.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    // Handle timestamps
    if (sortField.value === "lastDonation" || sortField.value === "createdAt") {
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

// Format currency
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0 THB";
  return `${amount.toLocaleString()} THB`;
};

// Use the store's formatters
const formatDate = donorStore.formatDate;

// Fetch donors on component mount
onMounted(() => {
  donorStore.fetchDonors();
});

// Computed properties for loading and error states
const loading = computed(() => donorStore.loading);
const error = computed(() => donorStore.error);

// Retry fetching donors
const fetchDonors = () => {
  donorStore.fetchDonors();
};
</script>

<style scoped>
.donors-admin {
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

.donors-table-container {
  overflow-x: auto;
}

.donors-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.donors-table th,
.donors-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.donors-table th {
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

.donations-button {
  background-color: #d1ecf1;
  color: #0c5460;
}

.edit-button {
  background-color: #d4edda;
  color: #155724;
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
</style>
