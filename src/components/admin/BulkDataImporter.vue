<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Bulk Recipient Data Import</h2>

    <div class="mb-4">
      <label class="block mb-2 font-medium">Paste Recipient CSV Data:</label>
      <textarea
        v-model="csvData"
        rows="10"
        class="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
        placeholder="Paste CSV data here, including the header row"
      ></textarea>
    </div>

    <div class="flex space-x-3">
      <button
        @click="processData"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        :disabled="!csvData.trim() || processing"
      >
        <span v-if="processing">Processing...</span>
        <span v-else>Process Data</span>
      </button>

      <button
        v-if="formattedData"
        @click="downloadData"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Download CSV
      </button>

      <button
        v-if="jsonData"
        @click="downloadJsonData"
        class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Download JSON for Deployment
      </button>
    </div>

    <div v-if="message" class="mt-4 p-3 rounded" :class="messageClass">
      {{ message }}
    </div>

    <!-- Merge with existing JSON -->
    <div v-if="formattedData" class="mt-6 border-t pt-4">
      <h3 class="text-lg font-semibold mb-2">Deployment Options</h3>

      <div class="mb-4">
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            id="merge-option"
            v-model="mergeWithExisting"
            class="mr-2"
          />
          <label for="merge-option" class="font-medium"
            >Merge with existing recipients.json</label
          >
        </div>

        <div v-if="mergeWithExisting" class="mt-2">
          <label class="block mb-2 text-sm"
            >Paste existing recipients.json content:</label
          >
          <textarea
            v-model="existingJsonData"
            rows="5"
            class="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="Paste the current contents of recipients.json here"
          ></textarea>

          <button
            @click="mergeAndGenerateJson"
            class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            :disabled="
              !existingJsonData.trim() || !formattedData || mergeProcessing
            "
          >
            <span v-if="mergeProcessing">Processing...</span>
            <span v-else>Generate Merged JSON</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="processedRecipients.length > 0" class="mt-6 border-t pt-4">
      <h3 class="text-lg font-semibold mb-3">
        Preview ({{ processedRecipients.length }} recipients)
      </h3>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Region
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Country
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Address
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(recipient, index) in previewRecipients" :key="index">
              <td class="px-4 py-2 text-sm">{{ recipient.name }}</td>
              <td class="px-4 py-2 text-sm">{{ recipient.category }}</td>
              <td class="px-4 py-2 text-sm">{{ recipient.regionId }}</td>
              <td class="px-4 py-2 text-sm">{{ recipient.country }}</td>
              <td class="px-4 py-2 text-sm">{{ recipient.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          @click="importAllRecipients"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          :disabled="importing"
        >
          <span v-if="importing"> Importing... </span>
          <span v-else> Import All Recipients </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRecipientStore } from "@/stores/recipientStore";
import { formatCsvForImport, downloadCsv } from "@/utils/csvHelper";
import { convertCsvToJson, mergeRecipientData } from "@/utils/deploymentHelper";
import Papa from "papaparse";

const csvData = ref("");
const formattedData = ref("");
const jsonData = ref("");
const mergedJsonData = ref("");
const processing = ref(false);
const importing = ref(false);
const mergeProcessing = ref(false);
const message = ref("");
const messageClass = ref("");
const processedRecipients = ref([]);
const mergeWithExisting = ref(false);
const existingJsonData = ref("");

const recipientStore = useRecipientStore();

// Only show first 5 in preview
const previewRecipients = computed(() => {
  return processedRecipients.value.slice(0, 5);
});

const processData = () => {
  processing.value = true;
  message.value = "";
  processedRecipients.value = [];
  jsonData.value = "";

  try {
    // Format the data - this will fix regionId if needed
    const formatted = formatCsvForImport(csvData.value);
    formattedData.value = formatted;

    // Parse the formatted CSV to get a preview
    Papa.parse(formatted, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          processedRecipients.value = results.data;
          message.value = `Successfully processed ${results.data.length} recipients!`;
          messageClass.value = "bg-green-50 text-green-700";

          // Generate JSON for deployment
          try {
            jsonData.value = convertCsvToJson(formatted);
          } catch (jsonError) {
            console.error("Error generating JSON:", jsonError);
          }
        } else {
          message.value = "No valid recipients found in the data.";
          messageClass.value = "bg-yellow-50 text-yellow-700";
        }
        processing.value = false;
      },
      error: (error) => {
        message.value = `Error parsing CSV: ${error.message}`;
        messageClass.value = "bg-red-50 text-red-700";
        processing.value = false;
      },
    });
  } catch (error) {
    message.value = `Error processing data: ${error.message}`;
    messageClass.value = "bg-red-50 text-red-700";
    processing.value = false;
  }
};

const downloadData = () => {
  if (formattedData.value) {
    downloadCsv(formattedData.value, "formatted_recipients.csv");
  }
};

const downloadJsonData = () => {
  if (!jsonData.value) return;

  const blob = new Blob([jsonData.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "recipients.json");
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const mergeAndGenerateJson = () => {
  if (!existingJsonData.value.trim() || !formattedData.value) return;

  mergeProcessing.value = true;

  try {
    mergedJsonData.value = mergeRecipientData(
      existingJsonData.value,
      formattedData.value
    );
    jsonData.value = mergedJsonData.value;
    message.value = "Successfully merged with existing data!";
    messageClass.value = "bg-green-50 text-green-700";
  } catch (error) {
    message.value = `Error merging data: ${error.message}`;
    messageClass.value = "bg-red-50 text-red-700";
  } finally {
    mergeProcessing.value = false;
  }
};

const importAllRecipients = async () => {
  if (processedRecipients.value.length === 0) return;

  importing.value = true;
  message.value = "";
  let importedCount = 0;

  try {
    // Add createdAt timestamp to each recipient
    const recipientsWithTimestamp = processedRecipients.value.map((r) => ({
      ...r,
      createdAt: new Date().toISOString(),
    }));

    // Import each recipient
    for (const recipient of recipientsWithTimestamp) {
      await recipientStore.createRecipient(recipient);
      importedCount++;
    }

    message.value = `Successfully imported ${importedCount} recipients!`;
    messageClass.value = "bg-green-50 text-green-700";

    // Clear the CSV data and processed results
    csvData.value = "";
    processedRecipients.value = [];
    formattedData.value = "";
    jsonData.value = "";
    mergedJsonData.value = "";
    existingJsonData.value = "";
    mergeWithExisting.value = false;
  } catch (error) {
    message.value = `Error importing recipients: ${error.message}`;
    messageClass.value = "bg-red-50 text-red-700";
  } finally {
    importing.value = false;
  }
};
</script>
