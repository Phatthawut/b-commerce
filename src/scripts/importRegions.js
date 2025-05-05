import { dataService } from "@/services/dataService";

/**
 * Ensures regions are loaded in the datastore
 * This function checks if regions exist in localStorage and resets them if needed
 */
export const importRegions = async () => {
  try {
    console.log("Checking if regions need to be imported...");

    // Check if regions exist in localStorage
    const regions = dataService.getRegions();

    if (!regions || regions.length === 0) {
      console.log("No regions found, importing from data file...");

      // Reset data will initialize both recipients and regions
      // But we only care about regions here
      dataService.resetData();

      console.log("Regions imported successfully");
    } else {
      console.log(`Regions already exist (${regions.length} found)`);
    }

    return true;
  } catch (error) {
    console.error("Error importing regions:", error);
    return false;
  }
};
