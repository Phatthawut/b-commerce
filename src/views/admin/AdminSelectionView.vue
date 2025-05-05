<template>
  <div class="container mx-auto px-4 py-8 text-black">
    <h1 class="text-3xl font-bold mb-6">Admin Selection Management</h1>

    <!-- Pending Admin Selections -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Pending Admin Selections</h2>
        <p class="text-sm text-gray-600 mt-1">
          Donations where donors have requested administrator selection of
          recipients.
        </p>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
        ></div>
        <p>Loading donations...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="pendingSelections.length === 0" class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No pending selections
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          There are currently no donations requiring administrator selection.
        </p>
      </div>

      <!-- Pending selections list -->
      <div v-else class="p-4">
        <div
          v-for="donation in pendingSelections"
          :key="donation.id"
          class="mb-8 border-b pb-6"
        >
          <div class="mb-4">
            <h3 class="font-semibold">Donation #{{ donation.id }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p>
                  <span class="font-medium">Donor:</span> {{ donation.name }}
                </p>
                <p>
                  <span class="font-medium">Email:</span> {{ donation.email }}
                </p>
                <p>
                  <span class="font-medium">Date:</span>
                  {{ formatDate(donation.createdAt) }}
                </p>
              </div>
              <div>
                <p>
                  <span class="font-medium">Sets:</span> {{ donation.quantity }}
                </p>
                <p>
                  <span class="font-medium">Amount:</span>
                  {{ donation.formattedTotal }}
                </p>
                <p>
                  <span class="font-medium">Status:</span>
                  <span
                    class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
                    >{{ donation.status }}</span
                  >
                </p>
              </div>
            </div>
          </div>

          <!-- Admin selection items -->
          <div
            v-for="(recipient, rIndex) in getPendingSelections(donation)"
            :key="rIndex"
            class="bg-blue-50 p-4 rounded-lg mb-4"
          >
            <div class="mb-4">
              <p class="font-medium">
                Admin Selection Requested for Recipient #{{ rIndex + 1 }}
              </p>
              <p class="text-gray-600 text-sm mt-1">
                <span class="font-medium">Notes from donor:</span>
                {{
                  recipient.adminNotes || "No specific preferences provided."
                }}
              </p>
            </div>

            <!-- Recipient selection form -->
            <div class="selection-form mt-4 bg-white p-4 rounded-lg">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Recipient Category</label
                >
                <select
                  v-model="recipient.newCategory"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="() => onCategoryChange(donation.id, rIndex)"
                >
                  <option value="">Select Category</option>
                  <option value="university">University</option>
                  <option value="library">Library</option>
                  <option value="nonprofit">Non-Profit Organization</option>
                  <option value="church">Church</option>
                  <option value="orphanage">Orphanage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="mb-4" v-if="recipient.newCategory">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Region</label
                >
                <select
                  v-model="recipient.newRegion"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="() => onRegionChange(donation.id, rIndex)"
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

              <div class="mb-4" v-if="recipient.newRegion">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Country</label
                >
                <select
                  v-model="recipient.newCountry"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="() => onCountryChange(donation.id, rIndex)"
                >
                  <option value="">Select Country</option>
                  <option
                    v-for="country in getCountriesForRegion(
                      recipient.newRegion
                    )"
                    :key="country"
                    :value="country"
                  >
                    {{ country }}
                  </option>
                </select>
              </div>

              <div class="mb-4" v-if="recipient.newCountry">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Institution</label
                >
                <select
                  v-model="recipient.newInstitutionId"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="() => onInstitutionChange(donation.id, rIndex)"
                >
                  <option value="">Select Institution</option>
                  <option
                    v-for="institution in getFilteredInstitutions(
                      recipient.newCategory,
                      recipient.newRegion,
                      recipient.newCountry
                    )"
                    :key="institution.id"
                    :value="institution.id"
                  >
                    {{ institution.name }}
                  </option>
                </select>
              </div>

              <div class="mb-4" v-if="recipient.newInstitutionName">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Selected Institution</label
                >
                <div class="p-3 bg-gray-100 rounded-md">
                  <p class="font-semibold">
                    {{ recipient.newInstitutionName }}
                  </p>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ recipient.newAddress }}
                  </p>
                </div>
              </div>

              <div class="flex justify-end mt-4">
                <button
                  @click="assignRecipient(donation.id, rIndex)"
                  class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  :disabled="!isSelectionComplete(recipient)"
                >
                  Assign Recipient
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Recipients Section -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Custom Recipients</h2>
        <p class="text-sm text-gray-600 mt-1">
          Review and manage custom recipients entered by donors.
        </p>
      </div>

      <!-- Loading indicator -->
      <div v-if="loadingCustom" class="p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
        ></div>
        <p>Loading custom recipients...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="customRecipients.length === 0" class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No custom recipients
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          There are currently no donations with custom recipients.
        </p>
      </div>

      <!-- Custom recipients list -->
      <div v-else class="p-4">
        <div
          v-for="item in customRecipients"
          :key="`${item.donationId}-${item.recipient.recipientId}`"
          class="mb-8 border-b pb-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold">Donation #{{ item.donationId }}</h3>
              <p>
                <span class="font-medium">Donor:</span> {{ item.donorName }}
              </p>
              <p>
                <span class="font-medium">Email:</span> {{ item.donorEmail }}
              </p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="font-medium">Custom Recipient Details</p>
              <p>
                <span class="font-medium">Name:</span>
                {{ item.recipient.recipientName }}
              </p>
              <p>
                <span class="font-medium">Category:</span>
                {{ formatCategory(item.recipient.recipientCategory) }}
              </p>
              <p>
                <span class="font-medium">Region:</span>
                {{ item.recipient.recipientRegion }}
              </p>
              <p>
                <span class="font-medium">Country:</span>
                {{ item.recipient.recipientCountry }}
              </p>
              <p>
                <span class="font-medium">Address:</span>
                {{ item.recipient.recipientAddress }}
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
              @click="
                approveCustomRecipient(
                  item.donationId,
                  item.recipient.recipientId
                )
              "
              class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors mr-2"
            >
              Approve
            </button>
            <button
              @click="
                rejectCustomRecipient(
                  item.donationId,
                  item.recipient.recipientId
                )
              "
              class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRecipientStore } from "@/stores/recipientStore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/config";

const recipientStore = useRecipientStore();

// State
const loading = ref(false);
const loadingCustom = ref(false);
const pendingSelections = ref([]);
const customRecipients = ref([]);
const countryCache = ref({});
const recipientCache = ref({});

// Computed properties
const regions = computed(() => recipientStore.regions);

// Helpers
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  try {
    // For Firestore Timestamp objects
    if (timestamp.toDate) {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    // For standard JS Date objects or ISO strings
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const formatCategory = (category) => {
  switch (category) {
    case "university":
      return "University";
    case "library":
      return "Library";
    case "nonprofit":
      return "Non-Profit Organization";
    case "church":
      return "Church";
    case "orphanage":
      return "Orphanage";
    default:
      return category || "Unknown";
  }
};

const getPendingSelections = (donation) => {
  if (!donation || !donation.recipients) return [];

  return donation.recipients
    .filter((r) => r.status === "pending_admin_selection")
    .map((r) => ({
      ...r,
      newCategory: "",
      newRegion: "",
      newCountry: "",
      newInstitutionId: "",
      newInstitutionName: "",
      newAddress: "",
    }));
};

const getCountriesForRegion = async (regionId) => {
  try {
    // Use recipientService instead of direct Firebase access
    const { recipientService } = await import(
      "../../services/recipientService"
    );
    const countriesArray = await recipientService.getCountriesByRegion(
      regionId.toLowerCase()
    );

    // Cache the countries
    countryCache.value[regionId.toLowerCase()] = countriesArray;

    return countriesArray;
  } catch (error) {
    console.error(`Error fetching countries for region ${regionId}:`, error);
    return [];
  }
};

const getFilteredInstitutions = (category, regionId, country) => {
  if (!category || !regionId || !country) return [];

  // Normalize category and regionId to lowercase for comparison
  const normalizedCategory = category.toLowerCase();
  const normalizedRegionId = regionId.toLowerCase();

  // Get all recipients for this category/region
  const categoryRegionKey = `${normalizedCategory}-${normalizedRegionId}`;

  if (recipientCache.value[categoryRegionKey]) {
    return recipientCache.value[categoryRegionKey].filter(
      (r) => r.country === country
    );
  } else {
    // If not in cache, trigger a fetch and return empty array for now
    fetchRecipientsFromFirestore(category, regionId);
    return [];
  }
};

const isSelectionComplete = (recipient) => {
  return (
    recipient.newCategory &&
    recipient.newRegion &&
    recipient.newCountry &&
    recipient.newInstitutionId &&
    recipient.newInstitutionName
  );
};

// Event handlers
const onCategoryChange = async (donationId, index) => {
  const donation = pendingSelections.value.find((d) => d.id === donationId);
  if (!donation) return;

  const recipient = getPendingSelections(donation)[index];
  if (!recipient) return;

  recipient.newRegion = "";
  recipient.newCountry = "";
  recipient.newInstitutionId = "";
  recipient.newInstitutionName = "";
  recipient.newAddress = "";
};

const onRegionChange = async (donationId, index) => {
  const donation = pendingSelections.value.find((d) => d.id === donationId);
  if (!donation) return;

  const recipient = getPendingSelections(donation)[index];
  if (!recipient) return;

  recipient.newCountry = "";
  recipient.newInstitutionId = "";
  recipient.newInstitutionName = "";
  recipient.newAddress = "";

  // Fetch countries for this region if not cached
  if (
    recipient.newRegion &&
    !countryCache.value[recipient.newRegion.toLowerCase()]
  ) {
    await getCountriesForRegion(recipient.newRegion);
  }

  // Fetch recipients data for this category/region if not cached
  const category = recipient.newCategory.toLowerCase();
  const regionId = recipient.newRegion.toLowerCase();
  const cacheKey = `${category}-${regionId}`;

  if (!recipientCache.value[cacheKey]) {
    await fetchRecipientsFromFirestore(category, regionId);
  }
};

const onCountryChange = async (donationId, index) => {
  const donation = pendingSelections.value.find((d) => d.id === donationId);
  if (!donation) return;

  const recipient = getPendingSelections(donation)[index];
  if (!recipient) return;

  recipient.newInstitutionId = "";
  recipient.newInstitutionName = "";
  recipient.newAddress = "";
};

const onInstitutionChange = async (donationId, index) => {
  const donation = pendingSelections.value.find((d) => d.id === donationId);
  if (!donation) return;

  const recipient = getPendingSelections(donation)[index];
  if (!recipient) return;

  if (recipient.newInstitutionId) {
    // Get institution details from cache or Firestore
    const category = recipient.newCategory.toLowerCase();
    const regionId = recipient.newRegion.toLowerCase();
    const cacheKey = `${category}-${regionId}`;

    if (recipientCache.value[cacheKey]) {
      const institution = recipientCache.value[cacheKey].find(
        (inst) => inst.id === recipient.newInstitutionId
      );

      if (institution) {
        recipient.newInstitutionName = institution.name;
        recipient.newAddress = institution.address;
        return;
      }
    }

    // If not found in cache, fetch from Firestore
    try {
      const institution = await recipientStore.getRecipientById(
        recipient.newInstitutionId
      );
      if (institution) {
        recipient.newInstitutionName = institution.name;
        recipient.newAddress = institution.address;
      }
    } catch (error) {
      console.error("Error fetching institution details:", error);
    }
  }
};

const assignRecipient = async (donationId, recipientIndex) => {
  try {
    const donation = pendingSelections.value.find((d) => d.id === donationId);
    if (!donation) return;

    const pendingRecipients = getPendingSelections(donation);
    const pendingRecipient = pendingRecipients[recipientIndex];

    if (!isSelectionComplete(pendingRecipient)) {
      alert("Please complete the recipient selection");
      return;
    }

    // Get the original index of this recipient in the donation
    const originalRecipients = donation.recipients;
    const originalIndex = originalRecipients.findIndex(
      (r) =>
        r.status === "pending_admin_selection" &&
        r.adminNotes === pendingRecipient.adminNotes
    );

    if (originalIndex === -1) {
      console.error("Could not find original recipient in donation");
      return;
    }

    // Create the updated recipient
    const updatedRecipient = {
      recipientCategory: pendingRecipient.newCategory,
      recipientName: pendingRecipient.newInstitutionName,
      recipientRegion:
        regions.value.find((r) => r.id === pendingRecipient.newRegion)?.name ||
        "",
      recipientCountry: pendingRecipient.newCountry,
      recipientAddress: pendingRecipient.newAddress,
      recipientId: pendingRecipient.newInstitutionId,
      wasAdminSelection: true,
      adminNotes: pendingRecipient.adminNotes,
      status: "admin_selected",
    };

    // Update the donation in Firestore
    const donationRef = doc(db, "donations", donationId);

    // Create a new recipients array with the updated recipient
    const updatedRecipients = [...originalRecipients];
    updatedRecipients[originalIndex] = updatedRecipient;

    await updateDoc(donationRef, {
      recipients: updatedRecipients,
      lastUpdated: new Date(),
    });

    // Refresh the data
    await fetchPendingAdminSelections();

    alert("Recipient assigned successfully!");
  } catch (error) {
    console.error("Error assigning recipient:", error);
    alert(`Error assigning recipient: ${error.message}`);
  }
};

const approveCustomRecipient = async (donationId, recipientId) => {
  try {
    // Find the custom recipient
    const customRecipientItem = customRecipients.value.find(
      (item) =>
        item.donationId === donationId &&
        item.recipient.recipientId === recipientId
    );

    if (!customRecipientItem) {
      console.error("Custom recipient not found");
      return;
    }

    // Update the status to approved
    const donationRef = doc(db, "donations", donationId);
    const donationSnapshot = await getDoc(donationRef);

    if (!donationSnapshot.exists()) {
      console.error("Donation not found");
      return;
    }

    const donationData = donationSnapshot.data();
    const recipients = donationData.recipients;

    // Find the index of the recipient to update
    const recipientIndex = recipients.findIndex(
      (r) => r.recipientId === recipientId
    );

    if (recipientIndex === -1) {
      console.error("Recipient not found in donation");
      return;
    }

    // Update the recipient status
    recipients[recipientIndex].status = "custom_recipient_approved";

    // Update the donation
    await updateDoc(donationRef, {
      recipients,
      lastUpdated: new Date(),
    });

    // Refresh the data
    await fetchCustomRecipients();

    alert("Custom recipient approved!");
  } catch (error) {
    console.error("Error approving custom recipient:", error);
    alert(`Error approving custom recipient: ${error.message}`);
  }
};

const rejectCustomRecipient = async (donationId, recipientId) => {
  try {
    // Find the custom recipient
    const customRecipientItem = customRecipients.value.find(
      (item) =>
        item.donationId === donationId &&
        item.recipient.recipientId === recipientId
    );

    if (!customRecipientItem) {
      console.error("Custom recipient not found");
      return;
    }

    // Update the status to rejected
    const donationRef = doc(db, "donations", donationId);
    const donationSnapshot = await getDoc(donationRef);

    if (!donationSnapshot.exists()) {
      console.error("Donation not found");
      return;
    }

    const donationData = donationSnapshot.data();
    const recipients = donationData.recipients;

    // Find the index of the recipient to update
    const recipientIndex = recipients.findIndex(
      (r) => r.recipientId === recipientId
    );

    if (recipientIndex === -1) {
      console.error("Recipient not found in donation");
      return;
    }

    // Update the recipient status
    recipients[recipientIndex].status = "custom_recipient_rejected";

    // Update the donation
    await updateDoc(donationRef, {
      recipients,
      lastUpdated: new Date(),
    });

    // Refresh the data
    await fetchCustomRecipients();

    alert(
      "Custom recipient rejected. The donor will be prompted to select a different recipient."
    );
  } catch (error) {
    console.error("Error rejecting custom recipient:", error);
    alert(`Error rejecting custom recipient: ${error.message}`);
  }
};

// Data fetching functions
const fetchPendingAdminSelections = async () => {
  loading.value = true;

  try {
    const donationsRef = collection(db, "donations");

    // Query donations where at least one recipient has status 'pending_admin_selection'
    const q = query(donationsRef, where("paymentStatus", "==", "completed"));

    const querySnapshot = await getDocs(q);

    const pendingDonations = [];
    querySnapshot.forEach((doc) => {
      const donation = { id: doc.id, ...doc.data() };

      // Check if the donation has any recipients with pending admin selection
      if (
        donation.recipients &&
        donation.recipients.some((r) => r.status === "pending_admin_selection")
      ) {
        pendingDonations.push(donation);
      }
    });

    pendingSelections.value = pendingDonations;
    console.log(
      `Found ${pendingDonations.length} donations with pending admin selections`
    );
  } catch (error) {
    console.error("Error fetching pending admin selections:", error);
  } finally {
    loading.value = false;
  }
};

const fetchCustomRecipients = async () => {
  loadingCustom.value = true;

  try {
    const donationsRef = collection(db, "donations");

    // Query donations with payment status 'completed'
    const q = query(donationsRef, where("paymentStatus", "==", "completed"));

    const querySnapshot = await getDocs(q);

    const customRecipientsList = [];
    querySnapshot.forEach((doc) => {
      const donation = { id: doc.id, ...doc.data() };

      // Extract custom recipients from the donation
      if (donation.recipients) {
        donation.recipients.forEach((recipient) => {
          if (recipient.status === "custom_recipient") {
            customRecipientsList.push({
              donationId: doc.id,
              donorName: donation.name,
              donorEmail: donation.email,
              recipient,
            });
          }
        });
      }
    });

    customRecipients.value = customRecipientsList;
    console.log(`Found ${customRecipientsList.length} custom recipients`);
  } catch (error) {
    console.error("Error fetching custom recipients:", error);
  } finally {
    loadingCustom.value = false;
  }
};

const fetchRecipientsFromFirestore = async (category, regionId) => {
  try {
    const cacheKey = `${category}-${regionId}`;

    // Use recipientService instead of direct Firebase access
    const { recipientService } = await import(
      "../../services/recipientService"
    );
    const recipientsData = await recipientService.getFilteredRecipients(
      category,
      regionId
    );

    // Store in cache
    recipientCache.value[cacheKey] = recipientsData;

    return recipientsData;
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return [];
  }
};

// On component load
onMounted(async () => {
  try {
    // Fetch regions
    await recipientStore.fetchRegions();

    // Fetch pending admin selections and custom recipients
    await Promise.all([fetchPendingAdminSelections(), fetchCustomRecipients()]);
  } catch (error) {
    console.error("Error initializing admin selection view:", error);
  }
});
</script>

<style scoped>
/* Any additional styles */
</style>
