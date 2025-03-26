import { db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Initial regions data
const regionsData = [
  { id: "northamerica", name: "North America" },
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia" },
  { id: "africa", name: "Africa" },
  { id: "oceania", name: "Oceania" },
  { id: "southamerica", name: "South America" },
  { id: "middleeast", name: "Middle East" },
];

// Function to import regions
export const importRegions = async () => {
  try {
    const regionsRef = collection(db, "regions");

    // Check if regions already exist
    for (const region of regionsData) {
      // Check if this region already exists
      const q = query(regionsRef, where("id", "==", region.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Region doesn't exist, add it
        await addDoc(regionsRef, region);
        console.log(`Added region: ${region.name}`);
      } else {
        console.log(`Region already exists: ${region.name}`);
      }
    }

    console.log("Regions import completed");
    return true;
  } catch (error) {
    console.error("Error importing regions:", error);
    return false;
  }
};

// Export the regions data for reference
export const regions = regionsData;
