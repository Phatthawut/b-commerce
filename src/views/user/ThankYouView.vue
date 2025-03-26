<template>
  <section class="bg-white text-black">
    <div class="container mx-auto p-8 font-thai">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-black">Thank You!</h1>
          <div class="divider divider-info w-1/2 mx-auto"></div>
          <p class="text-xl mt-4">
            Your donation has been received and is greatly appreciated.
          </p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="spinner mb-4"></div>
          <p>Loading donation details...</p>
        </div>

        <div
          v-else-if="error"
          class="bg-red-100 p-4 rounded-lg text-red-700 mb-8"
        >
          <h2>Oops! Something went wrong</h2>
          <p>{{ errorMessage }}</p>
          <div class="action-buttons">
            <button @click="goToDonation" class="primary-button">
              Make a New Donation
            </button>
            <button @click="goToHome" class="secondary-button">
              Return to Home
            </button>
          </div>
        </div>

        <div
          v-else-if="donationData"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Donation Status Banner -->
          <div :class="['p-4 text-white text-center font-bold', statusClass]">
            {{
              donationData.paymentStatus === "completed"
                ? "Payment Completed"
                : donationData.paymentStatus === "pending"
                ? "Payment Pending"
                : "Payment Failed"
            }}
          </div>

          <!-- Donation Details -->
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4">Donation Details</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 class="font-semibold text-gray-700">Donation ID</h3>
                <p class="text-gray-900">{{ donationId }}</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">Date</h3>
                <p class="text-gray-900">
                  {{ donationData.createdAt || "N/A" }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">Amount</h3>
                <p class="text-gray-900 font-bold text-[#7ECAD1]">
                  {{
                    donationData.amount
                      ? donationStore.formatCurrency(donationData.amount)
                      : "N/A"
                  }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">Payment Method</h3>
                <p class="text-gray-900">
                  {{
                    donationStore.formatPaymentMethod(
                      donationData.paymentMethod
                    )
                  }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">Status</h3>
                <p class="text-gray-900">
                  {{ donationStore.formatStatus(donationData.paymentStatus) }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">Quantity</h3>
                <p class="text-gray-900">{{ donationData.quantity }} sets</p>
              </div>
            </div>

            <!-- Donor Information -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">Donor Information</h3>
              <div class="bg-gray-50 p-4 rounded">
                <p>
                  <span class="font-semibold">Name:</span>
                  {{ donationData.name }}
                </p>
                <p v-if="donationData.email">
                  <span class="font-semibold">Email:</span>
                  {{ donationData.email }}
                </p>
                <p v-if="donationData.telephone">
                  <span class="font-semibold">Phone:</span>
                  {{ donationData.telephone }}
                </p>
                <p v-if="donationData.address">
                  <span class="font-semibold">Address:</span>
                  {{ donationData.address }}
                </p>
              </div>
            </div>

            <!-- Recipients Information -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">Recipients</h3>

              <!-- Multiple Recipients (new format) -->
              <div
                v-if="
                  donationData.recipients && donationData.recipients.length > 0
                "
              >
                <div
                  v-for="(recipient, index) in donationData.recipients"
                  :key="index"
                  class="bg-gray-50 p-4 rounded mb-2"
                >
                  <h4 class="font-semibold text-lg mb-2">
                    Recipient #{{ index + 1 }}
                  </h4>
                  <p>
                    <span class="font-semibold">Name:</span>
                    {{ recipient.recipientName }}
                  </p>
                  <p>
                    <span class="font-semibold">Category:</span>
                    <span class="capitalize">{{
                      recipient.recipientCategory
                    }}</span>
                  </p>
                  <p>
                    <span class="font-semibold">Region:</span>
                    {{ recipient.recipientRegion }}
                  </p>
                  <p>
                    <span class="font-semibold">Address:</span>
                    {{ recipient.recipientAddress }}
                  </p>
                </div>
              </div>

              <!-- Single Recipient (legacy format) -->
              <div
                v-else-if="donationData.recipientName"
                class="bg-gray-50 p-4 rounded"
              >
                <p>
                  <span class="font-semibold">Name:</span>
                  {{ donationData.recipientName }}
                </p>
                <p>
                  <span class="font-semibold">Category:</span>
                  <span class="capitalize">{{
                    donationData.recipientCategory
                  }}</span>
                </p>
                <p v-if="donationData.recipientRegion">
                  <span class="font-semibold">Region:</span>
                  {{ donationData.recipientRegion }}
                </p>
                <p v-if="donationData.recipientAddress">
                  <span class="font-semibold">Address:</span>
                  {{ donationData.recipientAddress }}
                </p>
              </div>

              <div v-else class="bg-gray-50 p-4 rounded">
                <p>No recipient information available.</p>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">Payment Information</h3>
              <div class="bg-gray-50 p-4 rounded">
                <p>
                  <span class="font-semibold">Method:</span>
                  {{
                    donationStore.formatPaymentMethod(
                      donationData.paymentMethod
                    )
                  }}
                </p>
                <p>
                  <span class="font-semibold">Status:</span>
                  {{ donationStore.formatStatus(donationData.paymentStatus) }}
                </p>
                <p v-if="donationData.paymentDate">
                  <span class="font-semibold">Date:</span>
                  {{ donationData.formattedPaymentDate }}
                </p>

                <!-- Payment Slip Image (if available) -->
                <div v-if="donationData.paymentSlipUrl" class="mt-4">
                  <p class="font-semibold mb-2">Payment Slip:</p>
                  <img
                    :src="donationData.paymentSlipUrl"
                    alt="Payment Slip"
                    class="max-w-full h-auto max-h-64 border rounded"
                    @click="openImageInFullscreen(donationData.paymentSlipUrl)"
                    style="cursor: pointer"
                  />
                  <p class="text-sm text-gray-500 mt-1">
                    Click on the image to view in full size
                  </p>
                </div>

                <!-- Card details if available -->
                <div
                  v-if="
                    donationData.cardDetails && donationData.cardDetails.last4
                  "
                >
                  <p>
                    <span class="font-semibold">Card:</span> **** **** ****
                    {{ donationData.cardDetails.last4 }}
                  </p>
                  <p v-if="donationData.cardDetails.brand">
                    <span class="font-semibold">Card Type:</span>
                    {{ donationData.cardDetails.brand }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <div class="bg-blue-50 p-4 rounded mb-6">
              <h3 class="text-xl font-semibold mb-2">Next Steps</h3>
              <p v-if="donationData.paymentStatus === 'completed'">
                Your donation has been processed successfully. You will receive
                a confirmation email shortly.
              </p>
              <p v-else-if="donationData.paymentStatus === 'pending'">
                Your donation is pending confirmation. We will notify you once
                the payment has been verified.
              </p>
              <p v-else>
                There was an issue with your payment. Please contact our support
                team for assistance.
              </p>
            </div>

            <div class="text-center mt-8">
              <router-link
                to="/"
                class="bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-block"
              >
                Return to Home
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p>No donation information found. Please try again later.</p>
          <router-link
            to="/"
            class="bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-block mt-4"
          >
            Return to Home
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDonationStore } from "@/stores/donationStore";
import { useRouter } from "vue-router";

const donationStore = useDonationStore();
const donationId = ref("");
const donationData = ref({});
const loading = ref(true);
const error = ref(false);
const errorMessage = ref("");
const router = useRouter();

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

// Navigation functions
const goToDonation = () => {
  // Clear the donationId from localStorage before navigating
  localStorage.removeItem("donationId");
  router.push("/donation");
};

const goToHome = () => {
  router.push("/");
};

onMounted(async () => {
  loading.value = true;
  error.value = false;

  try {
    // Get donation ID from localStorage
    const storedDonationId = localStorage.getItem("donationId");

    if (!storedDonationId) {
      error.value = true;
      errorMessage.value =
        "No donation information found. Please make a new donation.";
      loading.value = false;
      return;
    }

    donationId.value = storedDonationId;

    // Fetch donation details using the store
    await donationStore.fetchDonationById(donationId.value);

    if (donationStore.currentDonation) {
      // Format the data for display
      const data = donationStore.currentDonation;

      console.log("Donation data from Firestore:", data);
      console.log("Donation amount:", data.amount);
      console.log("Donation created date:", data.createdAt);

      // Check if the payment is in a valid state to show the thank you page
      const validPaymentStatuses = ["completed", "pending", "processing"];
      const validDonationStatuses = [
        "completed",
        "pending",
        "processing",
        "received",
      ];

      if (
        !validPaymentStatuses.includes(data.paymentStatus) ||
        !validDonationStatuses.includes(data.status)
      ) {
        console.log(
          "Payment not completed or pending. Redirecting to payment page."
        );
        // Payment not completed, redirect to payment page
        localStorage.setItem("pendingDonationId", donationId.value);
        localStorage.removeItem("donationId");
        router.push(`/payment?donationId=${donationId.value}`);
        return;
      }

      donationData.value = {
        ...data,
        // Convert Firestore timestamps to readable format if needed
        paymentDate: data.paymentDate
          ? donationStore.formatDate(data.paymentDate)
          : "N/A",
        createdAt: data.createdAt
          ? donationStore.formatDate(data.createdAt)
          : "N/A",
        // Add formatted date and amount for display
        formattedDate: data.createdAt
          ? donationStore.formatDate(data.createdAt)
          : "N/A",
        formattedTotal: data.amount
          ? donationStore.formatCurrency(data.amount)
          : "N/A",
      };
    } else {
      error.value =
        donationStore.error ||
        "Donation not found. Please contact support for assistance.";
    }
  } catch (err) {
    console.error("Error fetching donation:", err);
    error.value = true;
    errorMessage.value =
      "Error loading donation details. Please try again later.";
  } finally {
    loading.value = false;
  }
});

// Format the donation data for display
const formatDonationData = (data) => {
  // Format dates
  if (data.createdAt && data.createdAt.toDate) {
    data.formattedDate = data.createdAt.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (data.paymentDate && data.paymentDate.toDate) {
    data.formattedPaymentDate = data.paymentDate
      .toDate()
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  }

  return data;
};

// Helper function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  // Handle Firestore Timestamp objects
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "N/A";

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

// Function to open the payment slip image in full screen
const openImageInFullscreen = (imageUrl) => {
  if (!imageUrl) return;

  // Open the image in a new tab/window
  window.open(imageUrl, "_blank");
};
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

.error-container {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.thank-you-content {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.donation-details {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.payment-slip {
  margin-bottom: 2rem;
  text-align: center;
}

.payment-slip img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.recipients-section {
  margin-bottom: 2rem;
}

.recipients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.recipient-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recipient-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
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
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button {
  background-color: #3498db;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #2980b9;
}

.secondary-button {
  background-color: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
}

.secondary-button:hover {
  background-color: #bdc3c7;
}

/* Status styling */
.status-completed,
.status-received {
  color: #27ae60;
  font-weight: bold;
}

.status-pending,
.status-processing {
  color: #f39c12;
  font-weight: bold;
}

.status-failed,
.status-abandoned {
  color: #e74c3c;
  font-weight: bold;
}
</style>
