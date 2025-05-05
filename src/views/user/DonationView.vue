<template>
  <section class="bg-white">
    <div
      class="container grid grid-cols-1 mx-auto md:p-8 font-thai text-gray-700"
    >
      <h1 class="text-4xl font-bold text-black text-center">Donor Form</h1>
      <div class="divider divider-info w-1/2 mx-auto"></div>

      <!-- Loading indicator when checking for pending donations -->
      <div v-if="checkingPendingDonations" class="text-center mb-4">
        <div
          class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"
        ></div>
        Checking for previous donations...
      </div>

      <div class="grid grid-cols-1 gradient-background-donate py-4 md:p-12">
        <div class="text-background-blue p-2 md:p-6 md:w-[80%] mx-auto">
          <form class="px-2 md:px-8 pt-6 pb-8">
            <div class="flex items-center mb-4">
              <label for="name" class="w-1/4">Donor Name:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="name"
                type="text"
                placeholder="Donor Name"
                v-model="formData.name"
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="address">Donor Address:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="address"
                type="text"
                placeholder="Donor Address (Optional)"
                v-model="formData.address"
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="telephone">Telephone:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="telephone"
                type="text"
                placeholder="Telephone"
                v-model="formData.telephone"
                aria-label="Telephone"
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="email">Email:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="email"
                type="email"
                placeholder="Email (Require)"
                v-model="formData.email"
                required
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="quantity">Amount:</label>
              <input
                class="w-1/4 py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="quantity"
                type="number"
                min="1"
                placeholder="Amount"
                v-model="formData.quantity"
                @input="onQuantityChange"
                aria-label="Quantity"
              />
              <p class="text-sm text-gray-600 mt-1 ml-4">
                You can select {{ formData.quantity || 0 }} different
                recipients.
              </p>
            </div>

            <div class="mb-4">
              <label class="sr-only" for="total"> Total </label>
              <input
                class="w-full py-4 px-3 bg-gray-100 text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="total"
                type="text"
                placeholder="TOTAL (THB)"
                v-model="formData.total"
                readonly
                aria-label="Total"
              />
            </div>

            <!-- Recipient Selection Section -->
            <div
              v-for="(recipient, index) in recipients"
              :key="index"
              class="mb-8 p-4 bg-gray-50 rounded-lg"
            >
              <h3 class="font-semibold text-lg mb-4">
                Recipient Details #{{ index + 1 }}
              </h3>

              <!-- Recipient Type Selection - Always visible -->
              <div class="mb-4">
                <label for="category" class="block mb-2 font-medium"
                  >Recipient Type</label
                >
                <select
                  id="category"
                  v-model="recipient.category"
                  @change="onCategoryChange(index)"
                  required
                  class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Recipient Type</option>
                  <option value="university">Universities</option>
                  <option value="library">Libraries</option>
                  <option value="nonprofit">Non-Profit Organizations</option>
                  <option value="templechurch">Temples & Churches</option>
                  <option value="culturecenter">Cultural Centers</option>
                  <option value="custom">Custom Recipient</option>
                  <option value="admin-select">Let Admin Select</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Custom Recipient Form - Only visible when custom category is selected -->
              <div v-if="recipient.category === 'custom'">
                <div class="mb-4">
                  <label
                    for="custom-recipient-name"
                    class="block mb-2 font-medium"
                    >Custom Recipient Name</label
                  >
                  <input
                    id="custom-recipient-name"
                    v-model="recipient.institutionName"
                    type="text"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipient name"
                  />
                </div>

                <div class="mb-4">
                  <label for="custom-region" class="block mb-2 font-medium"
                    >Region</label
                  >
                  <select
                    id="custom-region"
                    v-model="recipient.region"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Region</option>
                    <option
                      v-for="region in regions"
                      :key="region.id"
                      :value="region.id"
                    >
                      {{ region.name }}
                    </option>
                  </select>
                </div>

                <div class="mb-4">
                  <label for="custom-country" class="block mb-2 font-medium"
                    >Country</label
                  >
                  <input
                    id="custom-country"
                    v-model="recipient.country"
                    type="text"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter country"
                  />
                </div>

                <div class="mb-4">
                  <label for="custom-address" class="block mb-2 font-medium"
                    >Address</label
                  >
                  <textarea
                    id="custom-address"
                    v-model="recipient.address"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md min-h-[80px] resize-y"
                    placeholder="Enter complete address"
                  ></textarea>
                </div>
              </div>

              <!-- Admin Selection Message - Only visible when admin-select is chosen -->
              <div
                v-if="recipient.category === 'admin-select'"
                class="mb-4 p-4 bg-blue-50 rounded-md"
              >
                <p class="text-blue-700">
                  <span class="font-medium">Note:</span> Our team will select an
                  appropriate recipient for your donation. If you have any
                  preferences or requests, please mention them below.
                </p>
                <div class="mt-4">
                  <label for="admin-select-notes" class="block mb-2 font-medium"
                    >Notes for Selection (Optional)</label
                  >
                  <textarea
                    id="admin-select-notes"
                    v-model="recipient.adminNotes"
                    class="w-full p-3 bg-white border border-gray-300 rounded-md min-h-[80px] resize-y"
                    placeholder="Any preferences for your donation? (e.g., 'Please select a school in rural areas')"
                  ></textarea>
                </div>
              </div>

              <!-- Region Selection - Only visible after category is selected and not for admin-select -->
              <div
                class="mb-4"
                v-if="
                  recipient.category &&
                  recipient.category !== 'custom' &&
                  recipient.category !== 'admin-select'
                "
              >
                <label for="region" class="block mb-2 font-medium"
                  >Region</label
                >
                <select
                  id="region"
                  v-model="recipient.region"
                  @change="onRegionChange(index)"
                  required
                  class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Region</option>
                  <option
                    v-for="region in regions"
                    :key="region.id"
                    :value="region.id"
                  >
                    {{ region.name }}
                  </option>
                </select>
                <div
                  v-if="loadingRegions"
                  class="mt-2 text-sm text-gray-600 flex items-center"
                >
                  <div
                    class="mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
                  ></div>
                  Loading...
                </div>
              </div>

              <!-- Country Selection - Only visible after region is selected -->
              <div class="mb-4" v-if="recipient.region">
                <label for="country" class="block mb-2 font-medium"
                  >Country</label
                >
                <select
                  id="country"
                  v-model="recipient.country"
                  @change="onCountryChange(index)"
                  required
                  class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  <option
                    v-for="country in getCountriesForRegion(recipient.region)"
                    :key="country"
                    :value="country"
                  >
                    {{ country }}
                  </option>
                </select>
                <div
                  v-if="loadingCountries"
                  class="mt-2 text-sm text-gray-600 flex items-center"
                >
                  <div
                    class="mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
                  ></div>
                  Loading...
                </div>
              </div>

              <!-- Institution Selection - Only visible after country is selected -->
              <div class="mb-4" v-if="recipient.country">
                <label for="institution" class="block mb-2 font-medium"
                  >Institution</label
                >

                <!-- Improved search input for institutions with autocomplete -->
                <div class="mb-2 relative">
                  <input
                    type="text"
                    v-model="recipient.institutionSearch"
                    class="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search and select institution..."
                    autocomplete="off"
                    @focus="$event.target.select()"
                    @input="
                      handleInstitutionSearchInput(index, $event.target.value)
                    "
                  />
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <button
                    v-if="recipient.institutionSearch"
                    @click="clearInstitutionSearch(index)"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    style="min-height: 44px; min-width: 44px"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
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

                  <!-- Autocomplete results dropdown -->
                  <div
                    v-if="
                      recipient.institutionSearch &&
                      displayInstitutions(
                        recipient.category,
                        recipient.region,
                        recipient.country,
                        recipient.institutionSearch,
                        index
                      ).length > 0
                    "
                    class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    <ul class="py-1">
                      <li
                        v-for="institution in displayInstitutions(
                          recipient.category,
                          recipient.region,
                          recipient.country,
                          recipient.institutionSearch,
                          index
                        ).slice(0, 10)"
                        :key="institution.id"
                        @click="selectInstitution(index, institution)"
                        class="px-3 py-2 cursor-pointer hover:bg-blue-50"
                      >
                        {{ institution.name }}
                      </li>
                      <li
                        v-if="
                          displayInstitutions(
                            recipient.category,
                            recipient.region,
                            recipient.country,
                            recipient.institutionSearch,
                            index
                          ).length > 10
                        "
                        class="px-3 py-2 text-center text-sm text-gray-500"
                      >
                        Type more to narrow down results
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  v-if="recipient.institutionSearch"
                  class="text-sm text-gray-600 mt-1 ml-1"
                >
                  {{
                    getSearchResultsMessage(
                      recipient.category,
                      recipient.region,
                      recipient.country,
                      recipient.institutionSearch
                    )
                  }}
                </div>

                <!-- Selected institution display -->
                <div
                  v-if="recipient.institutionId"
                  class="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium">
                        {{ recipient.institutionName }}
                      </h4>
                    </div>
                    <button
                      @click="clearSelectedInstitution(index)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
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

                <div
                  v-if="loadingRecipients"
                  class="mt-2 text-sm text-gray-600 flex items-center"
                >
                  <div
                    class="mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
                  ></div>
                  Loading...
                </div>
              </div>

              <!-- Institution Address - Only visible after institution is selected -->
              <div class="mb-4" v-if="recipient.institutionId">
                <label for="institution-address" class="block mb-2 font-medium"
                  >Institution Address</label
                >
                <textarea
                  id="institution-address"
                  v-model="recipient.address"
                  readonly
                  class="w-full p-3 bg-gray-100 border border-gray-300 rounded-md min-h-[80px] resize-y"
                ></textarea>
              </div>
            </div>

            <div class="flex item-center justify-end">
              <button
                class="bg-button-blue hover:bg-button-blue-hover text-white font-bold py-2 px-8 rounded focus:outline-2 outline-button-blue focus:shadow-outline w-[30%]"
                type="button"
                @click="handleSubmit"
                :disabled="!isFormValid"
              >
                Donate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { serverTimestamp } from "firebase/firestore";
import { useDonationStore } from "@/stores/donationStore";
import { useAuthStore } from "@/stores/authStore";
import { useRecipientStore } from "@/stores/recipientStore";
import { importRegions } from "@/scripts/importRegions";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { debounce } from "lodash";

const router = useRouter();
const authStore = useAuthStore();
const donationStore = useDonationStore();
const recipientStore = useRecipientStore();

// Constants
const PRICE_PER_SET = 2000; // 2000 THB per set
const RECIPIENTS_PAGE_SIZE = 100; // Number of recipients to load at once

// Form data
const formData = ref({
  name: "",
  address: "",
  telephone: "",
  email: "",
  message: "",
  quantity: "",
  total: "",
});

// Recipients array to store multiple recipient selections
const recipients = ref([
  {
    category: "",
    region: "",
    country: "",
    institutionId: "",
    address: "",
    institutionName: "",
    regionName: "",
    adminNotes: "", // For admin selection preferences
    institutionSearch: "", // For institution search
  },
]);

// Loading state for regions, countries and recipients
const loadingRegions = ref(false);
const loadingCountries = ref(false);
const loadingRecipients = ref(false);

// Regions from the database
const regions = computed(() => recipientStore.regions);

// Cache for countries by region to avoid repeated queries
const countryCache = ref({});

// Cache for recipients to avoid repeated Firestore queries
const recipientCache = ref({});

// Variables to track pagination of recipients
const recipientsLastVisible = ref({});
const recipientsHasMore = ref({});

// State for triggering reactivity
const searchUpdated = ref(0);

// Force a reactive update when search results change
const refreshSearchResults = () => {
  searchUpdated.value++;
  console.log(`Refresh triggered: ${searchUpdated.value}`);
};

// Helper function to get countries for a selected region
const getCountriesForRegion = (regionId) => {
  if (!regionId) return [];

  const regionKey = regionId.toLowerCase();

  // If we have this region's countries cached, use the cache
  if (countryCache.value[regionKey]) {
    return countryCache.value[regionKey];
  }

  // If not cached, we need to fetch from Firestore and extract unique countries
  // For now, return an empty array, countries will be loaded by onRegionChange
  return [];
};

// Function to fetch unique countries for a region
const fetchCountriesForRegion = async (regionId) => {
  try {
    // Use dataService instead of recipientService
    const { dataService } = await import("@/services/dataService");

    // Get all recipients for this region
    const recipientsByRegion = dataService.getRecipientsByRegion(regionId);

    // Extract unique countries
    const uniqueCountries = new Set();
    recipientsByRegion.forEach((recipient) => {
      if (recipient.country) {
        uniqueCountries.add(recipient.country);
      }
    });

    const countries = Array.from(uniqueCountries).sort();

    // Cache the countries
    countryCache.value[regionId.toLowerCase()] = countries;

    return countries;
  } catch (error) {
    console.error(`Error fetching countries for region ${regionId}:`, error);
    return [];
  }
};

// Helper to check if there are more institutions to load
const hasMoreInstitutions = (category, regionId, country) => {
  if (!category || !regionId || !country) return false;

  const cacheKey = `${category.toLowerCase()}-${regionId.toLowerCase()}${
    country ? `-${country}` : ""
  }`;
  return recipientsHasMore.value[cacheKey] || false;
};

// Get filtered institutions for a specific category, region, and country
const getFilteredInstitutions = (category, regionId, country) => {
  if (!category || !regionId || !country) return [];

  const cacheKey = `${category.toLowerCase()}-${regionId.toLowerCase()}${
    country ? `-${country}` : ""
  }`;

  if (recipientCache.value[cacheKey]) {
    return recipientCache.value[cacheKey];
  } else {
    // If not in cache, trigger a fetch and return empty array for now
    loadingRecipients.value = true;
    fetchRecipientsFromFirestore(category, regionId, country).finally(() => {
      loadingRecipients.value = false;
    });
    return [];
  }
};

// Event handlers for recipient selection
const onCategoryChange = async (index) => {
  const recipient = recipients.value[index];
  recipient.region = "";
  recipient.country = "";
  recipient.institutionId = "";
  recipient.address = "";
  recipient.institutionName = "";
  recipient.regionName = "";
  recipient.institutionSearch = ""; // Reset search when category changes
};

// Updated onRegionChange to load countries for this region
const onRegionChange = async (index) => {
  const recipient = recipients.value[index];
  recipient.country = "";
  recipient.institutionId = "";
  recipient.address = "";
  recipient.institutionName = "";
  recipient.institutionSearch = ""; // Reset search when region changes

  // Set region name
  if (recipient.region) {
    const selectedRegion = regions.value.find((r) => r.id === recipient.region);
    if (selectedRegion) {
      recipient.regionName = selectedRegion.name;
    }

    const category = recipient.category.toLowerCase();
    const regionId = recipient.region.toLowerCase();
    const cacheKey = `${category}-${regionId}`;

    // Only fetch if we don't have this combination in cache
    if (!recipientCache.value[cacheKey]) {
      loadingRecipients.value = true;

      try {
        console.log(
          `Fetching recipients for ${category}/${regionId} (not in cache)`
        );

        // Fetch directly from Firestore with proper indexed query
        await fetchRecipientsFromFirestore(category, regionId);
      } catch (error) {
        console.error("Error fetching recipients:", error);
      } finally {
        loadingRecipients.value = false;
      }
    } else {
      console.log(`Using cached recipients for ${category}/${regionId}`);
    }

    // Fetch countries for this region
    if (!countryCache.value[regionId.toLowerCase()]) {
      await fetchCountriesForRegion(regionId);
    }
  }
};

// New handler for country selection
const onCountryChange = async (index) => {
  const recipient = recipients.value[index];
  recipient.institutionId = "";
  recipient.address = "";
  recipient.institutionName = "";
  recipient.institutionSearch = ""; // Reset search when country changes

  console.log(`Country selected: ${recipient.country}`);

  // Fetch institutions for the selected category, region, and country
  if (recipient.category && recipient.region && recipient.country) {
    loadingRecipients.value = true;

    try {
      await fetchRecipientsFromFirestore(
        recipient.category,
        recipient.region,
        recipient.country,
        false // don't load more, start fresh
      );
    } catch (error) {
      console.error(
        `Error fetching institutions for ${recipient.country}:`,
        error
      );
    } finally {
      loadingRecipients.value = false;
    }
  }
};

// When adding new recipients in onQuantityChange
// Make sure to include all needed fields
const onQuantityChange = () => {
  // Calculate total
  calculateTotal();

  // Update recipients array based on quantity
  const quantity = parseInt(formData.value.quantity) || 0;

  // If quantity is less than current recipients, remove excess recipients
  if (quantity < recipients.value.length) {
    recipients.value = recipients.value.slice(0, quantity);
  }
  // If quantity is more than current recipients, add new recipients
  else if (quantity > recipients.value.length) {
    const newRecipients = [];
    for (let i = recipients.value.length; i < quantity; i++) {
      newRecipients.push({
        category: "",
        region: "",
        country: "",
        institutionId: "",
        address: "",
        institutionName: "",
        regionName: "",
        adminNotes: "",
        institutionSearch: "",
      });
    }
    recipients.value = [...recipients.value, ...newRecipients];
  }
};

const calculateTotal = () => {
  if (formData.value.quantity && !isNaN(formData.value.quantity)) {
    const quantity = parseInt(formData.value.quantity);
    if (quantity > 0) {
      formData.value.total =
        (quantity * PRICE_PER_SET).toLocaleString() + " THB";
    } else {
      formData.value.total = "";
    }
  } else {
    formData.value.total = "";
  }
};

// Updated onInstitutionChange to use caching and handle load more option
const onInstitutionChange = async (index) => {
  const recipient = recipients.value[index];

  // Check if this is a "load more" request
  if (recipient.institutionId === "load_more") {
    // Reset the selection
    recipient.institutionId = "";

    // Load more recipients
    loadingRecipients.value = true;
    try {
      await fetchRecipientsFromFirestore(
        recipient.category,
        recipient.region,
        recipient.country,
        true // loadMore flag
      );
    } catch (error) {
      console.error("Error loading more institutions:", error);
    } finally {
      loadingRecipients.value = false;
    }
    return;
  }

  if (recipient.institutionId) {
    // Get institution details - first check if we have it in cache
    try {
      const cacheKey = `${recipient.category.toLowerCase()}-${recipient.region.toLowerCase()}${
        recipient.country ? `-${recipient.country}` : ""
      }`;

      if (recipientCache.value[cacheKey]) {
        // Try to find the institution in cache first
        const cachedInstitution = recipientCache.value[cacheKey].find(
          (inst) => inst.id === recipient.institutionId
        );

        if (cachedInstitution) {
          recipient.address = cachedInstitution.address;
          recipient.institutionName = cachedInstitution.name;
          recipient.country = cachedInstitution.country || "";
          return; // Skip Firestore query if found in cache
        }
      }

      // If not in cache, fetch from dataService
      const { dataService } = await import("@/services/dataService");
      const institution = dataService.getRecipientById(recipient.institutionId);

      if (institution) {
        recipient.address = institution.address;
        recipient.institutionName = institution.name;
        recipient.country = institution.country || "";
      }
    } catch (error) {
      console.error("Error fetching institution details:", error);
    }
  } else {
    recipient.address = "";
    recipient.institutionName = "";
    recipient.country = "";
  }
};

// Add loading state
const loading = ref(false);
const checkingPendingDonations = ref(false);

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount || 0);
};

// Function to initialize the form with default values
const initializeForm = () => {
  // Initialize basic form fields
  formData.value = {
    quantity: "1",
    firstName: "",
    lastName: "",
    email: "",
    notes: "",
  };

  // Initialize recipients with one empty recipient by default
  recipients.value = [
    {
      category: "",
      region: "",
      regionName: "",
      country: "",
      institutionId: "",
      institutionName: "",
      institutionSearch: "",
      address: "",
      adminNotes: "",
    },
  ];

  // Initialize recipient caches and states
  if (!recipientCache.value) {
    recipientCache.value = {};
  }

  loadingRecipients.value = false;
  loading.value = false;

  // Calculate initial total
  calculateTotal();

  // Initialize Firestore data
  fetchRegions();
};

// New function to fetch recipients with pagination
const fetchRecipientsFromFirestore = async (
  category,
  regionId,
  country = null,
  loadMore = false,
  pageSize = RECIPIENTS_PAGE_SIZE
) => {
  try {
    const cacheKey = `${category}-${regionId}${country ? `-${country}` : ""}`;

    // If we're loading more and there's nothing more to load, return early
    if (loadMore && !recipientsHasMore.value[cacheKey]) {
      console.log(`No more recipients to load for ${cacheKey}`);
      return recipientCache.value[cacheKey] || [];
    }

    console.log(
      `Querying recipients for ${category}/${regionId}${
        country ? `/${country}` : ""
      } with limit ${pageSize}`
    );

    // Use dataService instead of recipientService
    const { dataService } = await import("@/services/dataService");
    let recipientsData = [];

    if (country) {
      // Use the optimized filtering with dataService
      const allRecipients = dataService.getFilteredRecipients({
        category: category,
        regionId: regionId,
        country: country,
      });

      // Apply pagination manually since dataService returns all results
      const startIndex =
        loadMore && recipientsLastVisible.value[cacheKey]
          ? pageSize * recipientsLastVisible.value[cacheKey]
          : 0;

      const endIndex = startIndex + pageSize;
      recipientsData = allRecipients.slice(startIndex, endIndex);
      recipientsHasMore.value[cacheKey] = endIndex < allRecipients.length;

      // Update last visible for pagination
      if (recipientsHasMore.value[cacheKey]) {
        recipientsLastVisible.value[cacheKey] =
          Math.floor(startIndex / pageSize) + 1;
      } else {
        recipientsLastVisible.value[cacheKey] = null;
      }
    } else {
      // Fetch all recipients for category and region
      const filteredRecipients = dataService.getFilteredRecipients({
        category: category,
        regionId: regionId,
      });

      // Apply pagination manually for consistency
      const startIndex =
        loadMore && recipientsLastVisible.value[cacheKey]
          ? pageSize * recipientsLastVisible.value[cacheKey]
          : 0;

      const endIndex = startIndex + pageSize;
      recipientsData = filteredRecipients.slice(startIndex, endIndex);
      recipientsHasMore.value[cacheKey] = endIndex < filteredRecipients.length;

      // Update last visible for pagination
      if (recipientsHasMore.value[cacheKey]) {
        recipientsLastVisible.value[cacheKey] =
          Math.floor(startIndex / pageSize) + 1;
      } else {
        recipientsLastVisible.value[cacheKey] = null;
      }
    }

    console.log(`Found ${recipientsData.length} recipients for ${cacheKey}`);

    // Update cache (append if loading more, replace otherwise)
    if (loadMore && recipientCache.value[cacheKey]) {
      recipientCache.value[cacheKey] = [
        ...recipientCache.value[cacheKey],
        ...recipientsData,
      ];
    } else {
      recipientCache.value[cacheKey] = recipientsData;
    }

    console.log(
      `Cached ${recipientsData.length} recipients for ${cacheKey} (total: ${recipientCache.value[cacheKey].length})`
    );
    return recipientCache.value[cacheKey];
  } catch (error) {
    console.error("Error in fetchRecipientsFromFirestore:", error);
    return [];
  }
};

// Modified onMounted function
onMounted(async () => {
  // Fetch regions
  loadingRegions.value = true;
  checkingPendingDonations.value = true;

  try {
    // Import regions if needed
    await importRegions();

    // Then fetch them
    await recipientStore.fetchRegions();

    if (regions.value.length === 0) {
      console.error("No regions found in the database");
    } else {
      console.log("Regions loaded:", regions.value.length);
    }
  } catch (error) {
    console.error("Error in component initialization:", error);
  } finally {
    loadingRegions.value = false;
    checkingPendingDonations.value = false;
  }

  // Check for completed and pending donations (remains the same)
  // ...existing code...

  // Check if there's a completed donation in localStorage
  const completedDonationId = localStorage.getItem("donationId");

  if (completedDonationId) {
    // Ask user if they want to view their completed donation or start a new one
    const viewCompleted = confirm(
      "You have a completed donation. Would you like to view it? Click 'OK' to view your completed donation or 'Cancel' to start a new one."
    );

    if (viewCompleted) {
      router.push("/thank-you");
      return;
    } else {
      // User wants to start a new donation, clear the completed donation ID
      localStorage.removeItem("donationId");
    }
  }

  // Check for pending donation
  const pendingDonationId = localStorage.getItem("pendingDonationId");
  const pendingDonationData = localStorage.getItem("pendingDonation");

  if (pendingDonationId && pendingDonationData) {
    try {
      // Try to fetch the donation from Firestore to check its status
      await donationStore.fetchDonationById(pendingDonationId);

      if (donationStore.currentDonation) {
        const paymentStatus = donationStore.currentDonation.paymentStatus;

        // If payment is not completed, ask user if they want to resume
        if (paymentStatus !== "completed") {
          const resumeDonation = confirm(
            "You have a pending donation. Would you like to resume it? Click 'OK' to resume or 'Cancel' to start a new one."
          );

          if (resumeDonation) {
            router.push(`/payment?donationId=${pendingDonationId}`);
            return;
          } else {
            // User wants to start a new donation, clear the pending donation
            localStorage.removeItem("pendingDonationId");
            localStorage.removeItem("pendingDonation");
          }
        } else {
          // Payment is completed but we're still on the donation page
          // This shouldn't happen normally, but just in case
          localStorage.setItem("donationId", pendingDonationId);
          localStorage.removeItem("pendingDonationId");
          localStorage.removeItem("pendingDonation");

          const viewCompleted = confirm(
            "Your donation has been completed. Would you like to view it? Click 'OK' to view your completed donation or 'Cancel' to start a new one."
          );

          if (viewCompleted) {
            router.push("/thank-you");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error checking pending donation:", error);
      // Clear invalid pending donation data
      localStorage.removeItem("pendingDonationId");
      localStorage.removeItem("pendingDonation");
    }
  }

  // Initialize the form with default values
  initializeForm();
});

// Form validation
const isFormValid = computed(() => {
  // Basic form validation
  const basicInfoValid =
    formData.value.name &&
    formData.value.telephone &&
    formData.value.email &&
    formData.value.quantity &&
    parseInt(formData.value.quantity) > 0;

  // Check if all recipients have been selected or filled out properly
  const allRecipientsValid = recipients.value.every((recipient) => {
    // First check if a category is selected
    if (!recipient.category) return false;

    // For custom recipients, check custom fields
    if (recipient.category === "custom") {
      return (
        recipient.institutionName &&
        recipient.region &&
        recipient.country &&
        recipient.address
      );
    }

    // For admin selection, we only need the category (and optionally notes)
    if (recipient.category === "admin-select") {
      return true;
    }

    // For standard selections, check all fields
    return (
      recipient.institutionId &&
      recipient.category &&
      recipient.region &&
      recipient.country
    );
  });

  return basicInfoValid && allRecipientsValid;
});

// Reset form function
const resetForm = () => {
  initializeForm();
  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Function to store donation data in localStorage
const storeDonationInLocalStorage = (donationId, donationData) => {
  localStorage.setItem("pendingDonationId", donationId);
  localStorage.setItem("pendingDonation", JSON.stringify(donationData));
  console.log("Stored donation data in localStorage:", donationId);
};

const handleSubmit = async () => {
  // Set loading state
  loading.value = true;
  console.log("Starting donation submission process...");

  try {
    // Calculate raw total for submission
    const rawTotal = parseInt(formData.value.quantity) * PRICE_PER_SET;
    console.log("Calculated raw total:", rawTotal);

    // Create donor data object
    const donorData = {
      name: formData.value.name,
      address: formData.value.address || "",
      telephone: formData.value.telephone,
      email: formData.value.email || "",
      createdAt: serverTimestamp(),
      lastDonation: serverTimestamp(),
      totalDonations: 1, // First donation
      totalAmount: rawTotal,
    };
    console.log("Donor data prepared:", donorData);

    // Prepare recipients data
    const recipientsData = recipients.value.map((recipient) => {
      // Base data common to all recipient types
      const baseData = {
        recipientCategory: recipient.category,
        recipientRegion: recipient.regionName || "",
        recipientCountry: recipient.country || "",
      };

      // Handle different recipient types
      if (recipient.category === "admin-select") {
        return {
          ...baseData,
          recipientName: "Admin Selection Pending",
          recipientAddress: "",
          recipientId: "admin-selection",
          isAdminSelection: true,
          adminNotes: recipient.adminNotes || "",
          status: "pending_admin_selection",
        };
      } else if (recipient.category === "custom") {
        return {
          ...baseData,
          recipientName: recipient.institutionName,
          recipientAddress: recipient.address,
          recipientId: `custom-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,
          isCustomRecipient: true,
          status: "custom_recipient",
        };
      } else {
        // Standard recipient selection
        return {
          recipientCategory: recipient.category,
          recipientName: recipient.institutionName,
          recipientRegion: recipient.regionName,
          recipientAddress: recipient.address,
          recipientId: recipient.institutionId,
          recipientCountry: recipient.country || "",
        };
      }
    });

    // Create donation data object
    const donationData = {
      name: formData.value.name,
      email: formData.value.email || "",
      telephone: formData.value.telephone,
      address: formData.value.address || "",
      recipients: recipientsData,
      quantity: parseInt(formData.value.quantity),
      amount: rawTotal,
      formattedTotal: `${rawTotal.toLocaleString()} THB`,
      total: `${rawTotal.toLocaleString()} THB`,
      rawTotal: rawTotal,
      message: formData.value.message || "",
      pricePerSet: PRICE_PER_SET,
      status: "initiated",
      paymentStatus: "initiated",
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    };
    console.log("Donation data prepared:", donationData);

    // Use the donation store to create donor and donation
    console.log("Calling donationStore.createDonorAndDonation...");
    const result = await donationStore.createDonorAndDonation(
      donorData,
      donationData
    );
    console.log("Result from createDonorAndDonation:", result);

    if (result) {
      // Store donation data in localStorage for persistence
      const localStorageData = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.telephone,
        quantity: formData.value.quantity,
        formattedTotal: formData.value.total,
        recipients: recipientsData,
      };

      // Store donation data in localStorage
      storeDonationInLocalStorage(result.donationId, localStorageData);

      // Reset form
      resetForm();
      console.log("Form reset");

      // Redirect to payment page
      console.log("Redirecting to payment page...");
      router.push("/payment");
    } else {
      throw new Error("Failed to create donation - result was null");
    }
  } catch (error) {
    console.error("Error submitting donation:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    alert("There was an error processing your donation. Please try again.");
  } finally {
    loading.value = false;
  }
};

// Watch for quantity changes to update recipients
watch(
  () => formData.value.quantity,
  (newValue) => {
    onQuantityChange();
  }
);

// Search function to find matching recipients
const searchRecipients = async (category, regionId, country, searchTerm) => {
  if (!category || !regionId || !country || !searchTerm) return [];

  try {
    loadingRecipients.value = true;

    const cacheKey = `search-${category}-${regionId}-${country}-${searchTerm.toLowerCase()}`;

    // Check if we already have this search cached
    if (recipientCache.value[cacheKey]) {
      console.log(`Using cached search results for "${searchTerm}"`);
      return recipientCache.value[cacheKey];
    }

    console.log(
      `Searching for ${category}/${regionId}/${country} matching "${searchTerm}"`
    );

    // Use dataService for optimized retrieval
    const { dataService } = await import("@/services/dataService");

    // Get filtered recipients based on all criteria
    const filteredRecipients = dataService.getFilteredRecipients({
      category: category,
      regionId: regionId,
      country: country,
      searchTerm: searchTerm,
    });

    // Cache the search results
    recipientCache.value[cacheKey] = filteredRecipients;

    return filteredRecipients;
  } catch (error) {
    console.error(`Error searching recipients for "${searchTerm}":`, error);
    return [];
  } finally {
    loadingRecipients.value = false;
  }
};

// Function to search for institutions by name directly from Firestore
const searchInstitutionsByName = async (
  category,
  regionId,
  country,
  searchTerm
) => {
  // This function is now replaced by searchRecipients
  return searchRecipients(category, regionId, country, searchTerm);
};

// Function to filter institutions by search term - now uses direct Firestore search when needed
const getFilteredInstitutionsBySearch = async (
  category,
  regionId,
  country,
  searchTerm = ""
) => {
  // If no search term, use the standard cached results
  if (!searchTerm) {
    return getFilteredInstitutions(category, regionId, country);
  }

  // If search term is too short (less than 2 chars), filter locally for better performance
  if (searchTerm.length < 2) {
    const allInstitutions = getFilteredInstitutions(
      category,
      regionId,
      country
    );
    const searchLower = searchTerm.toLowerCase();
    return allInstitutions.filter((institution) =>
      institution.name.toLowerCase().includes(searchLower)
    );
  }

  // For longer search terms, search directly in Firestore
  return await searchInstitutionsByName(
    category,
    regionId,
    country,
    searchTerm
  );
};

// Function to get search results count for display
const getSearchResultsCount = async (
  category,
  regionId,
  country,
  searchTerm
) => {
  try {
    const results = await getFilteredInstitutionsBySearch(
      category,
      regionId,
      country,
      searchTerm
    );
    return results.length;
  } catch (error) {
    console.error("Error getting search results count:", error);
    return 0;
  }
};

// Function to get search results message
const getSearchResultsMessage = (category, regionId, country, searchTerm) => {
  // This is synchronous for the UI, but displays "Searching..." while the async operation is in progress
  if (loadingRecipients.value) {
    return "Searching...";
  }

  // Use the cache key to check if we have results
  const cacheKey =
    searchTerm.length < 2
      ? `${category}-${regionId}-${country}`
      : `search-${category}-${regionId}-${country}-${searchTerm.toLowerCase()}`;

  if (!recipientCache.value[cacheKey]) {
    return "Searching...";
  }

  const filteredCount = recipientCache.value[cacheKey].length;
  const totalInstitutions = getFilteredInstitutions(
    category,
    regionId,
    country
  ).length;

  if (filteredCount === 0) {
    return `No institutions found matching "${searchTerm}"`;
  } else if (filteredCount === 1) {
    return `1 institution found`;
  } else if (searchTerm.length < 2 && filteredCount === totalInstitutions) {
    return `All ${filteredCount} institutions shown`;
  } else {
    return `Found ${filteredCount} matching institutions`;
  }
};

// Handle institution search input
const handleInstitutionSearchInput = debounce(async (index, searchInput) => {
  const recipient = recipients.value[index];
  recipient.institutionSearch = searchInput;

  // If the user is actively typing, don't clear their selection yet
  // This will be handled by selectInstitution when they make a choice

  // For very short inputs, just use base filtering
  if (!searchInput || searchInput.length < 2) {
    await getFilteredInstitutionsBySearch(
      recipient.category,
      recipient.region,
      recipient.country,
      searchInput
    );
    refreshSearchResults();
    return;
  }

  loadingRecipients.value = true;
  try {
    // Get search results
    const results = await getFilteredInstitutionsBySearch(
      recipient.category,
      recipient.region,
      recipient.country,
      searchInput
    );

    // Cache the results
    const cacheKey = `search-${recipient.category}-${recipient.region}-${
      recipient.country
    }-${searchInput.toLowerCase()}`;
    recipientCache.value[cacheKey] = results;

    console.log(
      `Found ${results.length} institutions matching "${searchInput}"`
    );
    refreshSearchResults();
  } catch (error) {
    console.error("Error searching institutions:", error);
  } finally {
    loadingRecipients.value = false;
  }
}, 300);

// Clear institution search
const clearInstitutionSearch = (index) => {
  const recipient = recipients.value[index];
  recipient.institutionSearch = "";
  // Re-fetch regular institutions to ensure we have the base set loaded
  getFilteredInstitutionsBySearch(
    recipient.category,
    recipient.region,
    recipient.country,
    ""
  ).then(() => {
    refreshSearchResults();
  });
};

// New function to select an institution from the autocomplete dropdown
const selectInstitution = async (index, institution) => {
  const recipient = recipients.value[index];
  recipient.institutionId = institution.id;
  recipient.institutionName = institution.name;
  recipient.address = institution.address || "";

  // Clear the search after selection
  recipient.institutionSearch = "";

  // Refresh the display
  refreshSearchResults();
};

// New function to clear the selected institution
const clearSelectedInstitution = (index) => {
  const recipient = recipients.value[index];
  recipient.institutionId = "";
  recipient.institutionName = "";
  recipient.address = "";
  recipient.institutionSearch = "";
  refreshSearchResults();
};

// Helper function to get filtered institutions for v-for directive (synchronous)
const getFilteredInstitutionsForDisplay = (
  category,
  regionId,
  country,
  searchTerm = ""
) => {
  if (!category || !regionId || !country) return [];

  // Use the cache key to check for search results
  const cacheKey =
    searchTerm.length < 2
      ? `${category}-${regionId}-${country}`
      : `search-${category}-${regionId}-${country}-${searchTerm.toLowerCase()}`;

  // Return from cache if available
  if (recipientCache.value && recipientCache.value[cacheKey]) {
    const results = recipientCache.value[cacheKey];
    if (searchTerm && searchTerm.length > 1) {
      console.log(
        `Display: Found ${results.length} cached results for "${searchTerm}"`
      );
    }
    return results;
  } else {
    if (searchTerm && searchTerm.length > 1) {
      console.log(
        `Display: No cached results for "${searchTerm}" with key ${cacheKey}`
      );
      console.log(
        "Available cache keys:",
        Object.keys(recipientCache.value || {})
      );

      // If search term is present but no results in cache, trigger a search
      searchRecipients(category, regionId, country, searchTerm)
        .then((results) => {
          console.log(`Search complete with ${results.length} results`);
        })
        .catch((error) => {
          console.error("Error in background search:", error);
        });
    }
  }

  // If not in cache, return empty array (will be loaded asynchronously)
  return [];
};

// Computed function to get display institutions for each recipient
const displayInstitutions = (
  category,
  regionId,
  country,
  searchTerm,
  index
) => {
  // This unused value forces the computed property to re-evaluate when search results change
  const _ = searchUpdated.value;

  // Track which recipient is being displayed in debug mode
  if (index === 0 && searchTerm) {
    console.log(
      `Rendering options for recipient #${
        index + 1
      } with search: "${searchTerm}" (update: ${_})`
    );
  }

  return getFilteredInstitutionsForDisplay(
    category,
    regionId,
    country,
    searchTerm
  );
};

// Fetch regions from the store
const fetchRegions = async () => {
  try {
    loadingRegions.value = true;
    await recipientStore.fetchRegions();
  } catch (error) {
    console.error("Error fetching regions:", error);
  } finally {
    loadingRegions.value = false;
  }
};
</script>

<style scoped>
.gradient-background-donate {
  background: linear-gradient(to right, #d9ebec, #cbe5e5);
}
.gradient-background-blue {
  background: linear-gradient(to right, #d3e4ea, #9fcadd);
}
.text-background-blue {
  background: #e8f7f9;
}

/* Button colors defined directly */
.bg-button-blue {
  background-color: #3b82f6;
}
.bg-button-blue:hover {
  background-color: #2563eb;
}
.outline-button-blue {
  outline-color: #3b82f6;
}

/* Custom dropdown styling with triangle */
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: white;
  border: none;
  border-radius: 0;
  color: #475569;
  font-weight: 500;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239fcadd' d='M6 9L0 3h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  padding-right: 2.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Add a subtle hover effect */
select:hover {
  background-color: #fff;
}

/* Style when dropdown is focused */
select:focus {
  outline: 2px solid #9fcadd;
  box-shadow: 0 0 0 3px rgba(159, 202, 221, 0.25);
}

/* Style for dropdown options */
select option {
  background-color: white;
  color: #475569;
  padding: 8px;
  white-space: normal;
  word-wrap: break-word;
  font-size: 0.9rem;
  max-width: 100%;
}

/* Style for the selected option in dropdown */
select option:checked {
  background-color: #9fcadd;
  color: white;
}

/* Add a text indicator for required fields */
.mb-4 .text-center {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

/* Responsive adjustments for mobile */
@media (max-width: 640px) {
  select {
    padding-right: 2rem;
    background-position: right 0.75rem center;
    background-size: 10px;
    font-size: 0.9rem;
  }

  select option {
    font-size: 0.85rem;
    padding: 6px;
  }
}

.institution-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.institution-form h3 {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
}

.form-group select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  background-color: #f3f4f6;
}

.loading-indicator {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.loading-indicator::before {
  content: "";
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Search input styles */
.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}
</style>
