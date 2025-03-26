<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4">Import Recipients from CSV</h2>

    <div class="mb-4">
      <p class="text-sm text-gray-600 mb-2">
        Upload a CSV file with recipient data. The CSV should have the following
        columns:
        <code>name,category,regionId,address</code>
      </p>
      <p class="text-sm text-gray-600 mb-4">
        Categories should be one of: <code>university</code>,
        <code>library</code>, <code>nonprofit</code>
      </p>

      <div class="flex items-center justify-center w-full">
        <label
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p class="text-xs text-gray-500">CSV file only</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            accept=".csv"
            @change="handleFileUpload"
          />
        </label>
      </div>
    </div>

    <!-- Preview section -->
    <div v-if="csvData.length > 0" class="mb-4">
      <h3 class="text-lg font-semibold mb-2">
        Preview ({{ csvData.length }} records)
      </h3>
      <div class="overflow-x-auto">
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
                Region ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Address
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(row, index) in previewData" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ row.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ row.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ row.regionId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ row.address }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Validation errors -->
    <div
      v-if="validationErrors.length > 0"
      class="mb-4 p-3 bg-red-50 text-red-700 rounded"
    >
      <h3 class="font-semibold mb-2">Validation Errors:</h3>
      <ul class="list-disc pl-5">
        <li v-for="(error, index) in validationErrors" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>

    <!-- Import button -->
    <div class="flex justify-end">
      <button
        @click="importRecipients"
        :disabled="
          importing || csvData.length === 0 || validationErrors.length > 0
        "
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="importing">
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
        <span v-else>Import {{ csvData.length }} Recipients</span>
      </button>
    </div>

    <!-- Success message -->
    <div
      v-if="importSuccess"
      class="mt-4 p-3 bg-green-50 text-green-700 rounded"
    >
      Successfully imported {{ importedCount }} recipients!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRecipientStore } from "@/stores/recipientStore";
import Papa from "papaparse";

const recipientStore = useRecipientStore();

const csvData = ref([]);
const validationErrors = ref([]);
const importing = ref(false);
const importSuccess = ref(false);
const importedCount = ref(0);

// Only show first 5 rows in preview
const previewData = computed(() => {
  return csvData.value.slice(0, 5);
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Reset states
  csvData.value = [];
  validationErrors.value = [];
  importSuccess.value = false;

  // Parse CSV file
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (results.data && results.data.length > 0) {
        csvData.value = results.data;
        validateCsvData();
      }
    },
    error: (error) => {
      validationErrors.value.push(`Error parsing CSV: ${error.message}`);
    },
  });
};

const validateCsvData = () => {
  validationErrors.value = [];

  // Check required columns
  const requiredColumns = ["name", "category", "regionId", "address"];
  const firstRow = csvData.value[0];

  const missingColumns = requiredColumns.filter(
    (col) => !firstRow.hasOwnProperty(col)
  );
  if (missingColumns.length > 0) {
    validationErrors.value.push(
      `Missing required columns: ${missingColumns.join(", ")}`
    );
  }

  // Validate each row
  csvData.value.forEach((row, index) => {
    // Check for empty name
    if (!row.name || row.name.trim() === "") {
      validationErrors.value.push(`Row ${index + 1}: Name is required`);
    }

    // Check category is valid
    const validCategories = ["university", "library", "nonprofit"];
    if (!validCategories.includes(row.category)) {
      validationErrors.value.push(
        `Row ${index + 1}: Invalid category "${
          row.category
        }". Must be one of: ${validCategories.join(", ")}`
      );
    }

    // Check regionId is not empty
    if (!row.regionId || row.regionId.trim() === "") {
      validationErrors.value.push(`Row ${index + 1}: Region ID is required`);
    }

    // Check address is not empty
    if (!row.address || row.address.trim() === "") {
      validationErrors.value.push(`Row ${index + 1}: Address is required`);
    }
  });
};

const importRecipients = async () => {
  if (validationErrors.value.length > 0 || csvData.value.length === 0) {
    return;
  }

  importing.value = true;

  try {
    const result = await recipientStore.importRecipientsFromCSV(csvData.value);

    if (result.success) {
      importSuccess.value = true;
      importedCount.value = result.count;
      csvData.value = [];
    } else {
      validationErrors.value.push(`Import failed: ${result.error}`);
    }
  } catch (error) {
    validationErrors.value.push(`Import failed: ${error.message}`);
  } finally {
    importing.value = false;
  }
};
</script>
