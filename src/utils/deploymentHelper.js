/**
 * Deployment Helper Utilities
 * Tools for managing recipient data for deployment
 */
import Papa from "papaparse";
import { formatCsvForImport } from "./csvHelper";

/**
 * Convert CSV data to JSON format ready for recipients.json file
 * @param {string} csvData - CSV data as string
 * @returns {string} - Formatted JSON string ready for recipients.json
 */
export const convertCsvToJson = (csvData) => {
  try {
    // First format the CSV data using the existing helper
    const formattedCsv = formatCsvForImport(csvData);

    // Parse the CSV data
    const result = Papa.parse(formattedCsv, {
      header: true,
      skipEmptyLines: true,
    });

    if (!result.data || result.data.length === 0) {
      throw new Error("No valid data found in CSV");
    }

    // Convert parsed data to recipient objects with proper IDs
    const recipients = result.data.map((item) => {
      // Generate a slug-like ID from the name
      const id = generateIdFromName(item.name, item.category);

      return {
        id,
        name: item.name,
        category: item.category,
        regionId: item.regionId,
        country: item.country || "",
        address: item.address || "",
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });

    // Return formatted JSON string
    return JSON.stringify(recipients, null, 2);
  } catch (error) {
    console.error("Error converting CSV to JSON:", error);
    throw error;
  }
};

/**
 * Merge new recipient data with existing JSON data
 * @param {string} existingJson - The current recipients.json content
 * @param {string} newCsvData - The new CSV data to merge
 * @returns {string} - Merged JSON string ready for recipients.json
 */
export const mergeRecipientData = (existingJson, newCsvData) => {
  try {
    // Parse existing JSON
    const existingRecipients = JSON.parse(existingJson);

    // Convert new CSV data to JSON objects
    const formattedCsv = formatCsvForImport(newCsvData);
    const result = Papa.parse(formattedCsv, {
      header: true,
      skipEmptyLines: true,
    });

    if (!result.data || result.data.length === 0) {
      return existingJson; // Return unchanged if no new data
    }

    // Get existing IDs for deduplication
    const existingIds = new Set(existingRecipients.map((r) => r.id));
    const existingNames = new Set(
      existingRecipients.map((r) => r.name.toLowerCase().trim())
    );

    // Convert new data to recipient objects
    const newRecipients = result.data
      .filter((item) => !existingNames.has(item.name.toLowerCase().trim())) // Skip duplicates by name
      .map((item) => {
        // Generate a slug-like ID from the name
        let id = generateIdFromName(item.name, item.category);

        // Ensure ID is unique
        let counter = 1;
        let tempId = id;
        while (existingIds.has(tempId)) {
          tempId = `${id}-${counter}`;
          counter++;
        }
        id = tempId;
        existingIds.add(id);

        return {
          id,
          name: item.name,
          category: item.category,
          regionId: item.regionId,
          country: item.country || "",
          address: item.address || "",
          createdAt: item.createdAt || new Date().toISOString(),
        };
      });

    // Merge the lists and sort by name
    const mergedRecipients = [...existingRecipients, ...newRecipients].sort(
      (a, b) => a.name.localeCompare(b.name)
    );

    // Return formatted JSON string
    return JSON.stringify(mergedRecipients, null, 2);
  } catch (error) {
    console.error("Error merging recipient data:", error);
    throw error;
  }
};

/**
 * Generate a slug-like ID from a recipient name and category
 * @param {string} name - Recipient name
 * @param {string} category - Recipient category
 * @returns {string} - Generated ID
 */
const generateIdFromName = (name, category) => {
  // Get category prefix
  const categoryPrefix = getCategoryPrefix(category);

  // Convert name to slug
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .substring(0, 40); // Limit length

  // Return prefixed slug
  return `${categoryPrefix}-${nameSlug}`;
};

/**
 * Get a short prefix for a category
 * @param {string} category - Category name
 * @returns {string} - Category prefix
 */
const getCategoryPrefix = (category) => {
  switch (category.toLowerCase()) {
    case "university":
      return "uni";
    case "library":
      return "lib";
    case "nonprofit":
      return "npo";
    case "templechurch":
      return "rel";
    case "culturecenter":
      return "cult";
    default:
      return category.substring(0, 4).toLowerCase();
  }
};
