<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Check Your Donation Status</h2>

    <!-- Lookup Form -->
    <form @submit.prevent="handleLookup" class="space-y-4">
      <!-- Phone Number Input -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700"
          >Phone Number</label
        >
        <input
          id="phone"
          v-model="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-500': phoneError }"
          required
        />
        <p v-if="phoneError" class="mt-1 text-sm text-red-600">
          {{ phoneError }}
        </p>
      </div>

      <!-- Optional Donation ID Input -->
      <div>
        <label for="donationId" class="block text-sm font-medium text-gray-700">
          Donation ID (Optional)
        </label>
        <input
          id="donationId"
          v-model="donationId"
          type="text"
          placeholder="Enter your donation ID"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-500': donationIdError }"
        />
        <p v-if="donationIdError" class="mt-1 text-sm text-red-600">
          {{ donationIdError }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="loading"
      >
        <span v-if="loading">
          <span
            class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"
          ></span>
          Searching...
        </span>
        <span v-else>Check Status</span>
      </button>
    </form>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>

    <!-- Results Section -->
    <div v-if="results && results.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold mb-3">Your Donations</h3>
      <div class="space-y-4">
        <div
          v-for="donation in results"
          :key="donation.id"
          class="border rounded-md p-4 hover:bg-gray-50"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">Donation ID: {{ donation.id }}</p>
              <p class="text-sm text-gray-600">
                Date: {{ donation.formattedDate }}
              </p>
              <p class="text-sm text-gray-600">
                Amount: {{ donation.formattedAmount }}
              </p>
            </div>
            <div class="text-right">
              <span
                :class="{
                  'bg-green-100 text-green-800':
                    donation.paymentStatus === 'completed',
                  'bg-yellow-100 text-yellow-800':
                    donation.paymentStatus === 'pending',
                  'bg-red-100 text-red-800':
                    donation.paymentStatus === 'failed',
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ donation.formattedPaymentStatus }}
              </span>
              <p class="mt-1 text-sm">Status: {{ donation.formattedStatus }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-3 flex justify-end space-x-2">
            <router-link
              :to="{ name: 'ThankYou', query: { donationId: donation.id } }"
              v-if="donation.paymentStatus === 'completed'"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              View Receipt
            </router-link>
            <router-link
              :to="{ name: 'Payment', query: { donationId: donation.id } }"
              v-if="donation.paymentStatus === 'pending'"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Complete Payment
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div
      v-else-if="results && results.length === 0"
      class="mt-6 p-4 bg-gray-50 text-gray-700 rounded-md text-center"
    >
      No donations found for this phone number.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDonationLookupStore } from "@/stores/donationLookupStore";

const donationLookupStore = useDonationLookupStore();

const phoneNumber = ref("");
const donationId = ref("");
const phoneError = ref("");
const donationIdError = ref("");
const results = ref(null);

const { loading, error } = donationLookupStore;

const handleLookup = async () => {
  // Reset errors
  phoneError.value = "";
  donationIdError.value = "";
  results.value = null;

  // Validate phone number
  if (!donationLookupStore.validatePhoneNumber(phoneNumber.value)) {
    phoneError.value = "Please enter a valid Thai phone number";
    return;
  }

  // Validate donation ID if provided
  if (
    donationId.value &&
    !donationLookupStore.validateDonationId(donationId.value)
  ) {
    donationIdError.value = "Invalid donation ID format";
    return;
  }

  // Perform lookup
  const donations = await donationLookupStore.lookupDonations(
    phoneNumber.value,
    donationId.value || null
  );

  results.value = donations;
};
</script>
