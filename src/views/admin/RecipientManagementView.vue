<template>
  <div class="container mx-auto px-4 py-8 text-black">
    <h1 class="text-3xl font-bold mb-6">Recipient Management</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left sidebar with filters -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h2 class="text-xl font-semibold mb-4">Filters</h2>

          <!-- Enhanced search bar -->
          <div class="mb-6">
            <div class="relative">
              <input
                type="text"
                v-model="filters.search"
                placeholder="Search recipients by name, country, address..."
                class="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="debounceSearch"
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
                v-if="filters.search"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
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

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Category</label
            >
            <select
              v-model="filters.category"
              class="w-full p-2 border border-gray-300 rounded-md"
              @change="applyFilters"
            >
              <option value="">All Categories</option>
              <option value="university">Universities</option>
              <option value="library">Libraries</option>
              <option value="nonprofit">Non-Profit Organizations</option>
              <option value="templechurch">Temples & Churches</option>
              <option value="culturecenter">Cultural Centers</option>
              <option value="custom">Custom Recipients</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Region</label
            >
            <select
              v-model="filters.region"
              class="w-full p-2 border border-gray-300 rounded-md"
              @change="applyFilters"
            >
              <option value="">All Regions</option>
              <option
                v-for="region in regions"
                :key="region.id"
                :value="region.id"
              >
                {{ region.name }}
              </option>
            </select>
          </div>

          <button
            @click="resetFilters"
            class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>

        <!-- Import section -->
        <RecipientImport />

        <!-- Bulk University Data Import -->
        <BulkDataImporter />

        <!-- Import sample data button -->
        <div class="bg-white rounded-lg shadow p-4 mt-6">
          <h2 class="text-xl font-semibold mb-4">Quick Setup</h2>
          <p class="text-sm text-gray-600 mb-4">
            Import sample recipient data to get started quickly.
          </p>
          <button
            @click="importSampleData"
            class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            :disabled="importingSample"
          >
            <span v-if="importingSample">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Importing...
            </span>
            <span v-else>Import Sample Data</span>
          </button>
          <div
            v-if="sampleImportSuccess"
            class="mt-4 p-3 bg-green-50 text-green-700 rounded"
          >
            Successfully imported sample recipients!
          </div>
        </div>
      </div>

      <!-- Main content area with recipient list -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div
            class="p-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h2 class="text-xl font-semibold">Recipients</h2>
            <div class="text-sm text-gray-500">
              {{ totalRecipients }} total recipients
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="loading" class="p-8 text-center">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
            ></div>
            <p>Loading recipients...</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="recipients.length === 0" class="p-8 text-center">
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
              No recipients found
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{
                hasFilters
                  ? "Try changing your filters or search term."
                  : "Get started by importing recipients."
              }}
            </p>
          </div>

          <!-- Recipients list -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Region
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="recipient in recipients" :key="recipient.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ recipient.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-800':
                          recipient.category === 'university',
                        'bg-green-100 text-green-800':
                          recipient.category === 'library',
                        'bg-purple-100 text-purple-800':
                          recipient.category === 'nonprofit',
                        'bg-indigo-100 text-indigo-800':
                          recipient.category === 'templechurch',
                        'bg-pink-100 text-pink-800':
                          recipient.category === 'culturecenter',
                      }"
                    >
                      {{ formatCategory(recipient.category) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getRegionName(recipient.regionId) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ recipient.country || "N/A" }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {{ recipient.address || "N/A" }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <button
                      @click="openEditModal(recipient)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(recipient)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination controls -->
          <div
            class="py-3 flex items-center justify-between border-t border-gray-200"
          >
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage >= Math.ceil(totalCount / pageSize)"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                :class="{
                  'opacity-50 cursor-not-allowed':
                    currentPage >= Math.ceil(totalCount / pageSize),
                }"
              >
                Next
              </button>
            </div>
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div class="flex items-center">
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{
                    (currentPage - 1) * pageSize + 1
                  }}</span>
                  to
                  <span class="font-medium">{{
                    Math.min(currentPage * pageSize, totalCount)
                  }}</span>
                  of <span class="font-medium">{{ totalCount }}</span> results
                </p>

                <!-- Page size selector -->
                <div class="flex items-center ml-4">
                  <label for="page-size" class="mr-2 text-sm text-gray-600"
                    >Show</label
                  >
                  <select
                    id="page-size"
                    v-model="pageSize"
                    @change="onPageSizeChange"
                    class="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option
                      v-for="size in pageSizeOptions"
                      :key="size"
                      :value="size"
                    >
                      {{ size }}
                    </option>
                  </select>
                  <span class="ml-2 text-sm text-gray-600">per page</span>
                </div>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{
                      'opacity-50 cursor-not-allowed': currentPage === 1,
                    }"
                  >
                    <span class="sr-only">Previous</span>
                    <!-- Heroicon name: solid/chevron-left -->
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>

                  <!-- Page numbers -->
                  <template v-for="page in displayedPageNumbers" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="goToPage(page)"
                      :class="[
                        page === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  </template>

                  <button
                    @click="nextPage"
                    :disabled="currentPage >= Math.ceil(totalCount / pageSize)"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{
                      'opacity-50 cursor-not-allowed':
                        currentPage >= Math.ceil(totalCount / pageSize),
                    }"
                  >
                    <span class="sr-only">Next</span>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <!-- Load more button -->
          <div
            v-if="hasMoreRecipients && false"
            <!--
            Disabled
            since
            we
            now
            use
            pagination
            --
          >
            class="p-4 border-t border-gray-200 text-center" >
            <button
              @click="loadMoreRecipients"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              :disabled="loading"
            >
              <span v-if="loading">Loading...</span>
              <span v-else>Load More</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Edit Recipient
              </h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label
                    for="edit-name"
                    class="block text-sm font-medium text-gray-700"
                    >Name</label
                  >
                  <input
                    type="text"
                    id="edit-name"
                    v-model="editingRecipient.name"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div>
                  <label
                    for="edit-category"
                    class="block text-sm font-medium text-gray-700"
                    >Category</label
                  >
                  <select
                    id="edit-category"
                    v-model="editingRecipient.category"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="university">University</option>
                    <option value="library">Library</option>
                    <option value="nonprofit">Non-Profit Organization</option>
                    <option value="templechurch">Temple & Church</option>
                    <option value="culturecenter">Cultural Center</option>
                    <option value="custom">Custom Recipient</option>
                  </select>
                </div>

                <div>
                  <label
                    for="edit-region"
                    class="block text-sm font-medium text-gray-700"
                    >Region</label
                  >
                  <select
                    id="edit-region"
                    v-model="editingRecipient.regionId"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option
                      v-for="region in regions"
                      :key="region.id"
                      :value="region.id"
                    >
                      {{ region.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    for="edit-country"
                    class="block text-sm font-medium text-gray-700"
                    >Country</label
                  >
                  <input
                    type="text"
                    id="edit-country"
                    v-model="editingRecipient.country"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div>
                  <label
                    for="edit-address"
                    class="block text-sm font-medium text-gray-700"
                    >Address</label
                  >
                  <textarea
                    id="edit-address"
                    v-model="editingRecipient.address"
                    rows="3"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="saveEdit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="saving"
          >
            {{ saving ? "Saving..." : "Save" }}
          </button>
          <button
            type="button"
            @click="closeEditModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <!-- Heroicon name: outline/exclamation -->
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Delete Recipient
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete "{{
                    recipientToDelete?.name
                  }}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="confirmDeleteRecipient"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="deleting"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
          <button
            type="button"
            @click="cancelDelete"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRecipientStore } from "@/stores/recipientStore";
import RecipientImport from "@/components/admin/RecipientImport.vue";
import BulkDataImporter from "@/components/admin/BulkDataImporter.vue";
import { jsonDataService } from "@/services/jsonDataService";

const recipientStore = useRecipientStore();

// State
const recipients = ref([]);
const loading = ref(false);
const hasMoreRecipients = ref(false);
const totalRecipients = ref(0);
const filters = ref({
  category: "",
  region: "",
  search: "",
});
const importingSample = ref(false);
const sampleImportSuccess = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const pageSizeOptions = ref([10, 20, 50, 100]);
const totalCount = ref(0);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editingRecipient = ref(null);
const saving = ref(false);
const deleting = ref(false);
const recipientToDelete = ref(null);

// Computed properties
const regions = computed(() => recipientStore.regions);

const hasFilters = computed(() => {
  return filters.value.category || filters.value.region || filters.value.search;
});

// Calculate page numbers to display
const displayedPageNumbers = computed(() => {
  const totalPages = Math.ceil(totalCount.value / pageSize.value) || 1;
  const current = currentPage.value;

  if (totalPages <= 7) {
    // If there are 7 or fewer pages, show all
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first and last page
  const pages = [1, totalPages];

  // Add current page and one on each side
  if (current > 2) pages.push(current - 1);
  if (current !== 1 && current !== totalPages) pages.push(current);
  if (current < totalPages - 1) pages.push(current + 1);

  // Sort and deduplicate
  const sorted = [...new Set(pages)].sort((a, b) => a - b);

  // Add ellipses where needed
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
});

// Methods
const formatCategory = (category) => {
  switch (category) {
    case "university":
      return "University";
    case "library":
      return "Library";
    case "nonprofit":
      return "Non-Profit";
    case "templechurch":
      return "Temple & Church";
    case "culturecenter":
      return "Cultural Center";
    case "custom":
      return "Custom Recipient";
    case "admin-select":
      return "Admin Selection";
    default:
      return category;
  }
};

const getRegionName = (regionId) => {
  const region = regions.value.find((r) => r.id === regionId);
  return region ? region.name : regionId;
};

const fetchRecipients = async (reset = true) => {
  loading.value = true;

  try {
    console.log(
      `Fetching page ${currentPage.value} with size ${pageSize.value}`
    );

    const result = await recipientStore.fetchRecipients(
      filters.value.category,
      filters.value.region,
      filters.value.search,
      pageSize.value,
      currentPage.value
    );

    // Update UI with the results
    recipients.value = result.items;

    // Log recipient names for debugging
    if (result.items.length > 0) {
      console.log(
        `Page ${currentPage.value} has ${result.items.length} recipients`
      );
      console.log(`First recipient: ${result.items[0].name}`);
      console.log(
        `Last recipient: ${result.items[result.items.length - 1].name}`
      );
    } else {
      console.log(`Page ${currentPage.value} has no recipients`);
    }

    // Update pagination state
    hasMoreRecipients.value = result.hasMore;
    totalRecipients.value = result.totalCount; // Update total in header
    totalCount.value = result.totalCount; // Update for pagination calculation

    console.log(
      `Total recipients: ${totalCount.value}, Has more: ${hasMoreRecipients.value}`
    );

    // If we ended up on a page beyond the available pages, go to the last page
    const maxPage = Math.ceil(totalCount.value / pageSize.value) || 1;
    if (currentPage.value > maxPage && maxPage > 0) {
      console.log(
        `Current page ${currentPage.value} is beyond max ${maxPage}, resetting to ${maxPage}`
      );
      currentPage.value = maxPage;

      // Refetch only if we had to adjust the page
      if (reset && currentPage.value !== maxPage) {
        return fetchRecipients(true);
      }
    }
  } catch (error) {
    console.error("Error fetching recipients:", error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to page 1 when applying filters
  fetchRecipients(true);
};

// Debounce search to avoid too many requests
let searchTimeout;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
};

const resetFilters = () => {
  filters.value = {
    category: "",
    region: "",
    search: "",
  };
  currentPage.value = 1; // Reset to page 1 when clearing filters
  fetchRecipients(true);
};

// Import sample data function
const importSampleData = async () => {
  importingSample.value = true;
  sampleImportSuccess.value = false;

  try {
    // Use the store to reset data to initial values
    await recipientStore.importSampleData();

    // Refresh the list
    await fetchRecipients(true);

    sampleImportSuccess.value = true;
  } catch (error) {
    console.error("Error importing sample data:", error);
  } finally {
    importingSample.value = false;
  }
};

// Fetch regions and initial recipients on mount
onMounted(async () => {
  loading.value = true;

  try {
    await recipientStore.fetchRegions();

    // Set default region to first region if available
    if (regions.value.length > 0) {
      // Find North America region if it exists
      const northAmerica = regions.value.find((r) =>
        r.name.includes("North America")
      );
      if (northAmerica) {
        filters.value.region = northAmerica.id;
      } else {
        // Otherwise use first region
        filters.value.region = regions.value[0].id;
      }
    }

    await fetchRecipients();
  } catch (error) {
    console.error("Error initializing recipient management:", error);
  } finally {
    loading.value = false;
  }
});

const openEditModal = (recipient) => {
  editingRecipient.value = { ...recipient };
  showEditModal.value = true;
};

const saveEdit = async () => {
  saving.value = true;

  try {
    await recipientStore.updateRecipient(editingRecipient.value);
    fetchRecipients(true);
    showEditModal.value = false;
  } catch (error) {
    console.error("Error updating recipient:", error);
  } finally {
    saving.value = false;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingRecipient.value = null;
};

const confirmDelete = (recipient) => {
  recipientToDelete.value = recipient;
  showDeleteModal.value = true;
};

const confirmDeleteRecipient = async () => {
  deleting.value = true;

  try {
    await recipientStore.deleteRecipient(recipientToDelete.value.id);
    fetchRecipients(true);
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error deleting recipient:", error);
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  recipientToDelete.value = null;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    console.log(`Moving to previous page: ${currentPage.value}`);
    fetchRecipients(true);
  }
};

const nextPage = () => {
  const maxPage = Math.ceil(totalCount.value / pageSize.value) || 1;
  if (currentPage.value < maxPage) {
    currentPage.value++;
    console.log(`Moving to next page: ${currentPage.value} of ${maxPage}`);
    fetchRecipients(true);
  }
};

const goToPage = (page) => {
  const maxPage = Math.ceil(totalCount.value / pageSize.value) || 1;
  if (page !== currentPage.value && page > 0 && page <= maxPage) {
    console.log(
      `Jumping to page: ${page} from ${currentPage.value} (max: ${maxPage})`
    );
    currentPage.value = page;
    fetchRecipients(true);
  }
};

// Clear search function with pagination reset
const clearSearch = () => {
  filters.value.search = "";
  currentPage.value = 1; // Reset to page 1 when clearing search
  fetchRecipients(true);
};

// Page size change handler
const onPageSizeChange = () => {
  console.log(`Page size changed to: ${pageSize.value}`);
  currentPage.value = 1; // Reset to first page when changing page size
  fetchRecipients(true);
};
</script>
