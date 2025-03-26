<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Page Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Track Your Donation
        </h1>
        <p class="text-gray-600">
          Enter your phone number to check the status of your donations. If you
          have a specific donation ID, you can enter it for detailed
          information.
        </p>
      </div>

      <!-- Donation Lookup Component -->
      <DonationLookup />

      <!-- Additional Information -->
      <div class="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 class="text-lg font-semibold text-blue-900 mb-3">Need Help?</h2>
        <ul class="space-y-2 text-blue-800">
          <li class="flex items-start">
            <span class="mr-2">•</span>
            <span
              >Your phone number should be in Thai format (e.g.,
              0812345678)</span
            >
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            <span
              >The donation ID can be found in your donation confirmation email
              or receipt</span
            >
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            <span
              >For any issues, please contact our support team at
              support@example.com</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import DonationLookup from "@/components/DonationLookup.vue";
</script>
