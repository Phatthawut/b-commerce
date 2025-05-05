<template>
  <div class="bg-white rounded-lg shadow p-4 mt-6">
    <h2 class="text-xl font-semibold mb-4">Import Recipients</h2>
    <p class="text-sm text-gray-600 mb-4">
      Upload a CSV file to import recipients in bulk.
    </p>

    <div
      class="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50"
      @click="triggerFileUpload"
      @dragover.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @drop.prevent="onDrop"
      :class="{ 'bg-blue-50 border-blue-300': dragover }"
    >
      <input
        type="file"
        ref="fileInput"
        @change="onFileSelect"
        accept=".csv"
        class="hidden"
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 mx-auto text-gray-400 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <p class="mb-1 font-medium">
        <span v-if="!importing">
          Drag and drop your CSV file here or click to browse
        </span>
        <span v-else> Importing your data... </span>
      </p>
      <p class="text-xs text-gray-500">
        CSV file format: name, category, regionId, country, address
      </p>
    </div>

    <div
      v-if="selectedFile"
      class="mt-4 p-3 bg-gray-50 rounded flex items-center justify-between"
    >
      <div>
        <p class="font-medium text-gray-700">{{ selectedFile.name }}</p>
        <p class="text-xs text-gray-500">
          {{ formatFileSize(selectedFile.size) }}
        </p>
      </div>
      <button @click="clearFile" class="text-red-600 hover:text-red-800">
        Remove
      </button>
    </div>

    <button
      v-if="selectedFile && !importing"
      @click="importFile"
      class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Import Recipients
    </button>

    <div
      v-if="importResults.success"
      class="mt-4 p-3 bg-green-50 text-green-700 rounded"
    >
      Successfully imported {{ importResults.count }} recipients!
    </div>

    <div
      v-if="importResults.error"
      class="mt-4 p-3 bg-red-50 text-red-700 rounded"
    >
      {{ importResults.error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRecipientStore } from "@/stores/recipientStore";
import Papa from "papaparse";

const recipientStore = useRecipientStore();
const fileInput = ref(null);
const selectedFile = ref(null);
const dragover = ref(false);
const importing = ref(false);
const importResults = ref({
  success: false,
  error: null,
  count: 0,
});

const triggerFileUpload = () => {
  fileInput.value.click();
};

const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    importResults.value = { success: false, error: null, count: 0 };
  }
};

const onDrop = (event) => {
  dragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.name.endsWith(".csv")) {
    selectedFile.value = file;
    importResults.value = { success: false, error: null, count: 0 };
  } else {
    importResults.value = {
      success: false,
      error: "Please upload a CSV file",
      count: 0,
    };
  }
};

const clearFile = () => {
  selectedFile.value = null;
  fileInput.value.value = "";
  importResults.value = { success: false, error: null, count: 0 };
};

const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
};

const importFile = () => {
  if (!selectedFile.value) return;

  importing.value = true;
  importResults.value = { success: false, error: null, count: 0 };

  Papa.parse(selectedFile.value, {
    header: true,
    complete: async (results) => {
      if (results.errors.length > 0) {
        importResults.value = {
          success: false,
          error: `CSV parsing error: ${results.errors[0].message}`,
          count: 0,
        };
        importing.value = false;
        return;
      }

      try {
        const recipients = results.data.filter(
          (r) => r.name && r.category && r.regionId
        );

        if (recipients.length === 0) {
          importResults.value = {
            success: false,
            error: "No valid recipients found in the CSV file",
            count: 0,
          };
          importing.value = false;
          return;
        }

        // Add createdAt timestamp to each recipient
        const recipientsWithTimestamp = recipients.map((r) => ({
          ...r,
          createdAt: new Date().toISOString(),
        }));

        // Use a helper function to import the recipients
        for (const recipient of recipientsWithTimestamp) {
          await recipientStore.createRecipient(recipient);
        }

        importResults.value = {
          success: true,
          error: null,
          count: recipients.length,
        };

        // Clear the file after successful import
        clearFile();

        // Emit an event to notify parent component
        emit("import-completed", { count: recipients.length });
      } catch (error) {
        console.error("Error importing recipients:", error);
        importResults.value = {
          success: false,
          error: `Import error: ${error.message}`,
          count: 0,
        };
      } finally {
        importing.value = false;
      }
    },
    error: (error) => {
      console.error("CSV parsing error:", error);
      importResults.value = {
        success: false,
        error: `CSV parsing error: ${error.message}`,
        count: 0,
      };
      importing.value = false;
    },
  });
};

// Define emit for parent component communication
const emit = defineEmits(["import-completed"]);
</script>
