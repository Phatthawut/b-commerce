import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

// Sample recipient data
const sampleRecipients = [
  {
    name: "Book Aid International",
    category: "nonprofit",
    regionId: "europe",
    address: "39-41 Coldharbour Lane, London SE5 9NR, United Kingdom",
    country: "United Kingdom",
  },
  {
    name: "British Library",
    category: "library",
    regionId: "europe",
    address: "96 Euston Rd, London NW1 2DB, United Kingdom",
    country: "United Kingdom",
  },
  {
    name: "University of Oxford",
    category: "university",
    regionId: "europe",
    address:
      "University Offices, Wellington Square, Oxford OX1 2JD, United Kingdom",
    country: "United Kingdom",
  },
  {
    name: "Room to Read",
    category: "nonprofit",
    regionId: "northamerica",
    address:
      "465 California St, Suite 1000, San Francisco, CA 94104, United States",
    country: "United States",
  },
  {
    name: "Pratham Books",
    category: "nonprofit",
    regionId: "asia",
    address:
      "No. 621, 2nd Floor, 5th Main, OMBR Layout, Banaswadi, Bangalore 560043, India",
    country: "India",
  },
  {
    name: "Book Dash",
    category: "nonprofit",
    regionId: "africa",
    address:
      "Unit B1, Roodehek House, 2 Roodehek Street, Gardens, Cape Town, 8001, South Africa",
    country: "South Africa",
  },
];

// Function to import sample recipients
export const importSampleRecipients = async () => {
  try {
    console.log("Starting sample recipients import...");
    const recipientsRef = collection(db, "recipients");

    // First, check if we already have these recipients
    for (const recipient of sampleRecipients) {
      // Check if this recipient already exists
      const q = query(
        recipientsRef,
        where("name", "==", recipient.name),
        where("category", "==", recipient.category),
        where("regionId", "==", recipient.regionId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Recipient doesn't exist, add it
        await addDoc(recipientsRef, recipient);
        console.log(
          `Added recipient: ${recipient.name} (${recipient.category}/${recipient.regionId})`
        );
      } else {
        console.log(`Recipient already exists: ${recipient.name}`);
      }
    }

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
    const recipientsRef = collection(db, "recipients");
    const querySnapshot = await getDocs(recipientsRef);

    let count = 0;
    for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
      count++;
    }

    console.log(`Cleared ${count} recipients`);
    return true;
  } catch (error) {
    console.error("Error clearing recipients:", error);
    return false;
  }
};
