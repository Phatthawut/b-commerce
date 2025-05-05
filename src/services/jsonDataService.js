import { ref } from "vue";
import recipientsData from "@/data/recipients.json";
import regionsData from "@/data/regions.json";

// In-memory data store
const recipients = ref([]);
const regions = ref([]);
let isInitialized = false;

// Initialize data from JSON files
const initializeData = () => {
  if (!isInitialized) {
    recipients.value = [...recipientsData];
    regions.value = [...regionsData];
    isInitialized = true;
    console.log(
      `Initialized data: ${recipients.value.length} recipients, ${regions.value.length} regions`
    );
  }
};

// Get all recipients with optional filtering
const getRecipients = (filters = {}, pagination = {}) => {
  initializeData();

  const { category, region, search } = filters;
  const { page = 1, pageSize = 20 } = pagination;

  // Apply filters
  let filteredData = [...recipients.value];

  if (category) {
    filteredData = filteredData.filter((item) => item.category === category);
  }

  if (region) {
    filteredData = filteredData.filter((item) => item.regionId === region);
  }

  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filteredData = filteredData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        (item.country && item.country.toLowerCase().includes(searchLower)) ||
        (item.address && item.address.toLowerCase().includes(searchLower))
    );
  }

  // Count total before pagination
  const totalCount = filteredData.length;

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    items: paginatedData,
    totalCount,
    hasMore: endIndex < totalCount,
    page,
    pageSize,
  };
};

// Get all regions
const getRegions = () => {
  initializeData();
  return regions.value;
};

// Get recipient by ID
const getRecipientById = (id) => {
  initializeData();
  return recipients.value.find((item) => item.id === id);
};

// Create new recipient
const createRecipient = (recipient) => {
  initializeData();

  // Generate a new ID (in real implementation, this would be more robust)
  const newId = Date.now().toString();
  const newRecipient = {
    ...recipient,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  recipients.value.push(newRecipient);

  // In a real implementation, you would save the JSON file here
  // For now, we're just keeping it in memory
  console.log("Created recipient:", newRecipient);

  return newRecipient;
};

// Update recipient
const updateRecipient = (updatedRecipient) => {
  initializeData();

  const index = recipients.value.findIndex(
    (item) => item.id === updatedRecipient.id
  );

  if (index !== -1) {
    updatedRecipient.updatedAt = new Date().toISOString();
    recipients.value[index] = { ...updatedRecipient };

    // In a real implementation, you would save the JSON file here
    console.log("Updated recipient:", updatedRecipient);

    return updatedRecipient;
  }

  throw new Error(`Recipient with ID ${updatedRecipient.id} not found`);
};

// Delete recipient
const deleteRecipient = (id) => {
  initializeData();

  const index = recipients.value.findIndex((item) => item.id === id);

  if (index !== -1) {
    const deleted = recipients.value.splice(index, 1)[0];

    // In a real implementation, you would save the JSON file here
    console.log("Deleted recipient:", deleted);

    return deleted;
  }

  throw new Error(`Recipient with ID ${id} not found`);
};

// Export sample data for demonstration
const exportSampleData = () => {
  initializeData();
  return JSON.stringify(recipients.value, null, 2);
};

// Reset to initial data
const resetData = () => {
  recipients.value = [...recipientsData];
  console.log("Reset data to initial state");
  return recipients.value;
};

export const jsonDataService = {
  getRecipients,
  getRegions,
  getRecipientById,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  exportSampleData,
  resetData,
};
