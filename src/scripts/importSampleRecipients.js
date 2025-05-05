import { dataService } from "@/services/dataService";

// Function to import sample recipients
export const importSampleRecipients = async () => {
  try {
    console.log("Starting sample recipients import...");

    // Reset data to initial values
    dataService.resetData();
    console.log("Sample recipients import completed");

    return true;
  } catch (error) {
    console.error("Error importing sample recipients:", error);
    return false;
  }
};

// Function to clear all recipients (for testing)
export const clearAllRecipients = async () => {
  try {
    console.log("Clearing all recipients...");

    // Clear recipients by setting an empty array
    localStorage.setItem("recipients", JSON.stringify([]));

    console.log("Cleared all recipients");
    return true;
  } catch (error) {
    console.error("Error clearing recipients:", error);
    return false;
  }
};
