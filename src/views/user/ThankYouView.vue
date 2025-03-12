<template>
  <div class="thank-you-container text-black">
    <div class="thank-you-card">
      <div class="thank-you-header">
        <h1>Thank You for Your Donation!</h1>
        <div class="donation-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-12 h-12"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading donation details...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <router-link to="/donation" class="primary-button"
          >Return to Donation Form</router-link
        >
      </div>

      <div v-else class="donation-details">
        <div class="confirmation-message">
          <p>
            Your generous contribution will help provide books to those who need
            them most.
          </p>
          <p class="donation-reference">
            Donation Reference: <span>{{ donationId }}</span>
          </p>
        </div>

        <div class="donation-summary">
          <h2>Donation Summary</h2>
          <div class="summary-item">
            <span class="label">Recipient:</span>
            <span class="value">{{ donationData.recipientName }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Amount:</span>
            <span class="value">${{ donationData.amount }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Payment Method:</span>
            <span class="value">{{
              formatPaymentMethod(donationData.paymentMethod)
            }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Status:</span>
            <span class="value" :class="statusClass">{{
              formatStatus(donationData.paymentStatus)
            }}</span>
          </div>
          <div
            class="summary-item"
            v-if="donationData.paymentMethod === 'bank-transfer'"
          >
            <span class="label">Next Steps:</span>
            <span class="value"
              >Our team will verify your bank transfer within 1-2 business
              days.</span
            >
          </div>
        </div>

        <div class="action-buttons">
          <router-link to="/" class="primary-button"
            >Return to Home</router-link
          >
          <router-link to="/donation" class="secondary-button"
            >Make Another Donation</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDonationStore } from "@/stores/donationStore";

const donationStore = useDonationStore();
const donationId = ref("");
const donationData = ref({});
const loading = ref(true);
const error = ref("");

// Use the store's formatters
const formatPaymentMethod = donationStore.formatPaymentMethod;
const formatStatus = donationStore.formatStatus;

// Compute CSS class based on status
const statusClass = computed(() => {
  if (donationData.value.paymentStatus === "completed")
    return "status-completed";
  if (donationData.value.paymentStatus === "pending") return "status-pending";
  if (donationData.value.paymentStatus === "failed") return "status-failed";
  return "";
});

onMounted(async () => {
  // Get donation ID from localStorage
  const storedDonationId = localStorage.getItem("donationId");

  if (!storedDonationId) {
    error.value =
      "Donation information not found. Please try making a donation again.";
    loading.value = false;
    return;
  }

  donationId.value = storedDonationId;

  try {
    // Fetch donation details using the store
    await donationStore.fetchDonationById(donationId.value);

    if (donationStore.currentDonation) {
      // Format the data for display
      const data = donationStore.currentDonation;

      donationData.value = {
        ...data,
        // Convert Firestore timestamps to readable format if needed
        paymentDate: data.paymentDate
          ? donationStore.formatDate(data.paymentDate)
          : "N/A",
        createdAt: data.createdAt
          ? donationStore.formatDate(data.createdAt)
          : "N/A",
      };
    } else {
      error.value =
        donationStore.error ||
        "Donation not found. Please contact support for assistance.";
    }
  } catch (err) {
    console.error("Error fetching donation:", err);
    error.value = "Error loading donation details. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.thank-you-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
  background-color: #f8f9fa;
}

.thank-you-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  padding: 2rem;
}

.thank-you-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.thank-you-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.donation-icon {
  color: #4caf50;
  width: 60px;
  height: 60px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

.confirmation-message {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.donation-reference {
  margin-top: 1rem;
  font-weight: bold;
}

.donation-reference span {
  background-color: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  color: #2c3e50;
}

.donation-summary {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.donation-summary h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: #2c3e50;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.label {
  font-weight: 600;
  color: #6c757d;
}

.value {
  font-weight: 500;
  color: #2c3e50;
}

.status-completed {
  color: #28a745;
}

.status-pending {
  color: #ffc107;
}

.status-failed {
  color: #dc3545;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-button,
.secondary-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
}

.primary-button {
  background-color: #4caf50;
  color: white;
  border: 1px solid #4caf50;
}

.primary-button:hover {
  background-color: #43a047;
}

.secondary-button {
  background-color: white;
  color: #4caf50;
  border: 1px solid #4caf50;
}

.secondary-button:hover {
  background-color: #f1f8e9;
}

@media (max-width: 768px) {
  .thank-you-header {
    flex-direction: column;
    text-align: center;
  }

  .thank-you-header h1 {
    margin-bottom: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>
