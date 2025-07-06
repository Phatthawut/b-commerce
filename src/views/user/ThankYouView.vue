<template>
  <section class="bg-white text-black">
    <div class="container mx-auto p-8 font-thai">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-black">
            {{ $t("pages.thankYou.title") }}
          </h1>
          <div class="divider divider-info w-1/2 mx-auto"></div>
          <p class="text-xl mt-4">
            {{ $t("pages.thankYou.subtitle") }}
          </p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="spinner mb-4"></div>
          <p>{{ $t("pages.thankYou.loading") }}</p>
        </div>

        <div
          v-else-if="error"
          class="bg-red-100 p-4 rounded-lg text-red-700 mb-8"
        >
          <h2>{{ $t("pages.thankYou.error.title") }}</h2>
          <p>{{ errorMessage }}</p>
          <div class="action-buttons">
            <button @click="goToDonation" class="primary-button">
              {{ $t("pages.thankYou.buttons.newDonation") }}
            </button>
            <button @click="goToHome" class="secondary-button">
              {{ $t("pages.thankYou.buttons.returnHome") }}
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
                ? $t("pages.thankYou.status.completed")
                : donationData.paymentStatus === "pending"
                ? $t("pages.thankYou.status.pending")
                : $t("pages.thankYou.status.failed")
            }}
          </div>

          <!-- Donation Details -->
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4">
              {{ $t("pages.thankYou.donationDetails.title") }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 class="font-semibold text-gray-700">
                  {{ $t("pages.thankYou.donationDetails.donationId") }}
                </h3>
                <p class="text-gray-900">{{ donationId }}</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">
                  {{ $t("pages.thankYou.donationDetails.date") }}
                </h3>
                <p class="text-gray-900">
                  {{ formattedDate }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">
                  {{ $t("pages.thankYou.donationDetails.amount") }}
                </h3>
                <p class="text-gray-900 font-bold">
                  {{
                    donationData.amount
                      ? donationStore.formatCurrency(donationData.amount)
                      : "N/A"
                  }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">
                  {{ $t("pages.thankYou.donationDetails.paymentMethod") }}
                </h3>
                <p class="text-gray-900">
                  {{
                    donationStore.formatPaymentMethod(
                      donationData.paymentMethod
                    )
                  }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">
                  {{ $t("pages.thankYou.donationDetails.status") }}
                </h3>
                <p class="text-gray-900">
                  {{ donationStore.formatStatus(donationData.paymentStatus) }}
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-700">
                  {{ $t("pages.thankYou.donationDetails.quantity") }}
                </h3>
                <p class="text-gray-900">
                  {{ donationData.quantity }}
                  {{ $t("pages.thankYou.donationDetails.sets") }}
                </p>
              </div>
            </div>

            <!-- Donor Information -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">
                {{ $t("pages.thankYou.donorInformation.title") }}
              </h3>
              <div class="bg-gray-50 p-4 rounded">
                <p>
                  <span class="font-semibold">{{
                    $t("pages.thankYou.donorInformation.name")
                  }}</span>
                  {{ donationData.name }}
                </p>
                <p v-if="donationData.email">
                  <span class="font-semibold">{{
                    $t("pages.thankYou.donorInformation.email")
                  }}</span>
                  {{ donationData.email }}
                </p>
                <p v-if="donationData.telephone">
                  <span class="font-semibold">{{
                    $t("pages.thankYou.donorInformation.phone")
                  }}</span>
                  {{ donationData.telephone }}
                </p>
                <p v-if="donationData.address">
                  <span class="font-semibold">{{
                    $t("pages.thankYou.donorInformation.address")
                  }}</span>
                  {{ donationData.address }}
                </p>
              </div>
            </div>

            <!-- Recipients Information -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">
                {{ $t("pages.thankYou.recipients.title") }}
              </h3>

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
                    {{
                      $t("pages.thankYou.recipients.recipientNumber", {
                        number: index + 1,
                      })
                    }}
                  </h4>
                  <p>
                    <span class="font-semibold">{{
                      $t("pages.thankYou.recipients.name")
                    }}</span>
                    {{ recipient.recipientName }}
                  </p>
                  <p>
                    <span class="font-semibold">{{
                      $t("pages.thankYou.recipients.category")
                    }}</span>
                    <span class="capitalize">{{
                      recipient.recipientCategory
                    }}</span>
                  </p>
                  <p>
                    <span class="font-semibold">{{
                      $t("pages.thankYou.recipients.region")
                    }}</span>
                    {{ recipient.recipientRegion }}
                  </p>
                  <p>
                    <span class="font-semibold">{{
                      $t("pages.thankYou.recipients.address")
                    }}</span>
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
                  <span class="font-semibold">{{
                    $t("pages.thankYou.recipients.name")
                  }}</span>
                  {{ donationData.recipientName }}
                </p>
                <p>
                  <span class="font-semibold">{{
                    $t("pages.thankYou.recipients.category")
                  }}</span>
                  <span class="capitalize">{{
                    donationData.recipientCategory
                  }}</span>
                </p>
                <p v-if="donationData.recipientRegion">
                  <span class="font-semibold">{{
                    $t("pages.thankYou.recipients.region")
                  }}</span>
                  {{ donationData.recipientRegion }}
                </p>
                <p v-if="donationData.recipientAddress">
                  <span class="font-semibold">{{
                    $t("pages.thankYou.recipients.address")
                  }}</span>
                  {{ donationData.recipientAddress }}
                </p>
              </div>

              <div v-else class="bg-gray-50 p-4 rounded">
                <p>{{ $t("pages.thankYou.recipients.noRecipients") }}</p>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-2">
                {{ $t("pages.thankYou.paymentInformation.title") }}
              </h3>
              <div class="bg-gray-50 p-4 rounded">
                <p>
                  <span class="font-semibold">{{
                    $t("pages.thankYou.paymentInformation.method")
                  }}</span>
                  {{
                    donationStore.formatPaymentMethod(
                      donationData.paymentMethod
                    )
                  }}
                </p>
                <p>
                  <span class="font-semibold">{{
                    $t("pages.thankYou.paymentInformation.status")
                  }}</span>
                  {{ donationStore.formatStatus(donationData.paymentStatus) }}
                </p>
                <p v-if="donationData.paymentDate">
                  <span class="font-semibold">{{
                    $t("pages.thankYou.paymentInformation.date")
                  }}</span>
                  {{ donationData.formattedPaymentDate }}
                </p>

                <!-- Payment Slip Image (if available) -->
                <div v-if="donationData.paymentSlipUrl" class="mt-4">
                  <p class="font-semibold mb-2">
                    {{ $t("pages.thankYou.paymentInformation.paymentSlip") }}
                  </p>
                  <img
                    :src="donationData.paymentSlipUrl"
                    :alt="$t('pages.thankYou.paymentInformation.paymentSlip')"
                    class="max-w-full h-auto max-h-64 border rounded"
                    @click="openImageInFullscreen(donationData.paymentSlipUrl)"
                    style="cursor: pointer"
                  />
                  <p class="text-sm text-gray-500 mt-1">
                    {{ $t("pages.thankYou.paymentInformation.clickToView") }}
                  </p>
                </div>

                <!-- Card details if available -->
                <div
                  v-if="
                    donationData.cardDetails && donationData.cardDetails.last4
                  "
                >
                  <p>
                    <span class="font-semibold">{{
                      $t("pages.thankYou.paymentInformation.card")
                    }}</span>
                    **** **** ****
                    {{ donationData.cardDetails.last4 }}
                  </p>
                  <p v-if="donationData.cardDetails.brand">
                    <span class="font-semibold">{{
                      $t("pages.thankYou.paymentInformation.cardType")
                    }}</span>
                    {{ donationData.cardDetails.brand }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <div class="bg-blue-50 p-4 rounded mb-6">
              <h3 class="text-xl font-semibold mb-2">
                {{ $t("pages.thankYou.nextSteps.title") }}
              </h3>
              <p v-if="donationData.paymentStatus === 'completed'">
                {{ $t("pages.thankYou.nextSteps.completed") }}
              </p>
              <p v-else-if="donationData.paymentStatus === 'pending'">
                {{ $t("pages.thankYou.nextSteps.pending") }}
              </p>
              <p v-else>
                {{ $t("pages.thankYou.nextSteps.failed") }}
              </p>
            </div>

            <div class="text-center mt-8">
              <router-link
                to="/"
                class="bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-block"
              >
                {{ $t("pages.thankYou.buttons.returnHome") }}
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p>{{ $t("pages.thankYou.noInformation") }}</p>
          <router-link
            to="/"
            class="bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-block mt-4"
          >
            {{ $t("pages.thankYou.buttons.returnHome") }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDonationStore } from "@/stores/donationStore";
import { useRouter } from "vue-router";
import { formatDateByLocale } from "@/utils/dateUtils";

const { t, locale } = useI18n();
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

// Reactive formatted date that updates when locale changes
const formattedDate = computed(() => {
  if (donationData.value.createdAt) {
    return formatDateByLocale(donationData.value.createdAt, locale.value);
  }
  return locale.value === "th" ? "ไม่ระบุ" : "N/A";
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
  await loadDonationData();
});

const loadDonationData = async () => {
  const storedDonationId = localStorage.getItem("donationId");

  if (storedDonationId) {
    donationId.value = storedDonationId;
    try {
      loading.value = true;
      await donationStore.fetchDonationById(storedDonationId);

      if (donationStore.currentDonation) {
        const data = donationStore.currentDonation;
        donationData.value = {
          id: storedDonationId,
          amount: data.amount,
          formattedAmount: formatCurrency(data.amount),
          donorName: data.donorName,
          donorEmail: data.donorEmail,
          donorPhone: data.donorPhone,
          quantity: data.quantity || 1,
          recipients: data.recipients || [],
          recipientName: data.recipientName,
          recipientCategory: data.recipientCategory,
          recipientRegion: data.recipientRegion,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          status: data.status,
          createdAt: data.createdAt,
        };

        // Store the raw createdAt for the computed property to use
        // (No need to format here since we have a reactive computed property)
      } else {
        alert(t("pages.thankYou.errors.donationNotFound"));
        router.push("/donation");
      }
    } catch (err) {
      console.error("Error fetching donation:", err);
      alert(t("pages.thankYou.errors.loadingError"));
      router.push("/donation");
    } finally {
      loading.value = false;
    }
  } else {
    alert(t("pages.thankYou.errors.noDonationData"));
    router.push("/donation");
  }
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
