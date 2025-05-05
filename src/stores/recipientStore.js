import { ref } from "vue";
import { defineStore } from "pinia";
import { jsonDataService } from "@/services/jsonDataService";

export const useRecipientStore = defineStore("recipient", () => {
  const recipients = ref([]);
  const regions = ref([]);
  const loading = ref(false);
  const error = ref("");
  const totalRecipients = ref(0);

  // Fetch recipients with optional filters and pagination
  const fetchRecipients = async (
    category = "",
    region = "",
    search = "",
    pageSize = 20,
    page = 1
  ) => {
    loading.value = true;
    error.value = "";

    try {
      const result = jsonDataService.getRecipients(
        { category, region, search },
        { page, pageSize }
      );

      recipients.value = result.items;
      totalRecipients.value = result.totalCount;

      return {
        items: result.items,
        hasMore: result.hasMore,
        totalCount: result.totalCount,
      };
    } catch (err) {
      console.error("Error fetching recipients:", err);
      error.value = err.message;
      return {
        items: [],
        hasMore: false,
        totalCount: 0,
      };
    } finally {
      loading.value = false;
    }
  };

  // Fetch regions
  const fetchRegions = async () => {
    loading.value = true;
    error.value = "";

    try {
      regions.value = jsonDataService.getRegions();
      return regions.value;
    } catch (err) {
      console.error("Error fetching regions:", err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Create new recipient
  const createRecipient = async (recipientData) => {
    loading.value = true;
    error.value = "";

    try {
      const newRecipient = jsonDataService.createRecipient(recipientData);
      return newRecipient;
    } catch (err) {
      console.error("Error creating recipient:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update recipient
  const updateRecipient = async (recipientData) => {
    loading.value = true;
    error.value = "";

    try {
      const updatedRecipient = jsonDataService.updateRecipient(recipientData);
      return updatedRecipient;
    } catch (err) {
      console.error("Error updating recipient:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete recipient
  const deleteRecipient = async (id) => {
    loading.value = true;
    error.value = "";

    try {
      const deletedRecipient = jsonDataService.deleteRecipient(id);
      return deletedRecipient;
    } catch (err) {
      console.error("Error deleting recipient:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Import sample data
  const importSampleData = async () => {
    loading.value = true;
    error.value = "";

    try {
      const result = jsonDataService.resetData();
      return result;
    } catch (err) {
      console.error("Error importing sample data:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    recipients,
    regions,
    loading,
    error,
    totalRecipients,
    fetchRecipients,
    fetchRegions,
    createRecipient,
    updateRecipient,
    deleteRecipient,
    importSampleData,
  };
});
