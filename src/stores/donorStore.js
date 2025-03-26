import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  setDoc,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthStore } from "./authStore";

export const useDonorStore = defineStore("donor", () => {
  // State
  const donors = ref([]);
  const currentDonor = ref(null);
  const loading = ref(false);
  const error = ref("");

  // Getters
  const getDonorById = computed(() => {
    return (id) => donors.value.find((donor) => donor.id === id);
  });

  const getDonorByPhone = computed(() => {
    return (phone) => donors.value.find((donor) => donor.telephone === phone);
  });

  const getTopDonors = computed(() => {
    return [...donors.value]
      .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
      .slice(0, 10);
  });

  // Actions
  const fetchDonors = async () => {
    loading.value = true;
    error.value = "";
    console.log("Fetching donors from Firestore...");

    try {
      console.log("Creating query for donors collection...");
      const donorsQuery = query(
        collection(db, "donors"),
        orderBy("lastDonation", "desc")
      );

      console.log("Executing query...");
      const querySnapshot = await getDocs(donorsQuery);
      console.log(`Query returned ${querySnapshot.size} documents`);

      const donorsList = [];
      querySnapshot.forEach((doc) => {
        console.log(`Processing donor document with ID: ${doc.id}`);
        donorsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`Setting donors with ${donorsList.length} items`);
      donors.value = donorsList;
    } catch (err) {
      console.error("Error fetching donors:", err);
      error.value = "Failed to load donors. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  const fetchDonorById = async (id) => {
    loading.value = true;
    error.value = "";

    try {
      const donorRef = doc(db, "donors", id);
      const donorSnapshot = await getDoc(donorRef);

      if (donorSnapshot.exists()) {
        currentDonor.value = {
          id: donorSnapshot.id,
          ...donorSnapshot.data(),
        };
      } else {
        error.value = "Donor not found";
        currentDonor.value = null;
      }
    } catch (err) {
      console.error("Error fetching donor:", err);
      error.value = "Failed to load donor. Please try again.";
      currentDonor.value = null;
    } finally {
      loading.value = false;
    }
  };

  const fetchDonorByPhone = async (phone) => {
    loading.value = true;
    error.value = "";

    try {
      // Query donors by phone number
      const donorsQuery = query(
        collection(db, "donors"),
        where("telephone", "==", phone)
      );

      const querySnapshot = await getDocs(donorsQuery);

      if (!querySnapshot.empty) {
        // Return all donors with this phone number
        const donorsWithPhone = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // If there's only one donor, set it as current
        if (donorsWithPhone.length === 1) {
          currentDonor.value = donorsWithPhone[0];
        } else {
          currentDonor.value = null; // Multiple donors found, don't set a specific one
        }

        return donorsWithPhone;
      } else {
        error.value = "Donor not found";
        currentDonor.value = null;
        return [];
      }
    } catch (err) {
      console.error("Error fetching donor by phone:", err);
      error.value = "Failed to load donor. Please try again.";
      currentDonor.value = null;
      return [];
    } finally {
      loading.value = false;
    }
  };

  const updateDonor = async (donorId, donorData) => {
    loading.value = true;
    error.value = "";

    try {
      const donorRef = doc(db, "donors", donorId);

      await updateDoc(donorRef, {
        ...donorData,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const index = donors.value.findIndex((d) => d.id === donorId);
      if (index !== -1) {
        donors.value[index] = {
          ...donors.value[index],
          ...donorData,
          updatedAt: new Date(),
        };
      }

      return true;
    } catch (err) {
      console.error("Error updating donor:", err);
      error.value = "Failed to update donor information. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const createOrUpdateDonor = async (donorData) => {
    loading.value = true;
    error.value = "";

    try {
      let donorId;

      // Validate required fields
      if (!donorData.telephone) {
        throw new Error("Phone number is required");
      }
      if (!donorData.name) {
        throw new Error("Name is required");
      }

      // Try to find existing donor by phone AND name
      const donorsQuery = query(
        collection(db, "donors"),
        where("telephone", "==", donorData.telephone),
        limit(10) // Get multiple donors with the same phone to check names
      );

      const querySnapshot = await getDocs(donorsQuery);
      let existingDonor = null;

      // Check if there's a donor with the same name AND phone
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const donor = doc.data();
          // Only consider it a match if both name and phone match
          if (donor.name.toLowerCase() === donorData.name.toLowerCase()) {
            existingDonor = {
              id: doc.id,
              ...donor,
            };
          }
        });
      }

      if (existingDonor) {
        // Use existing donor ID if we found an exact match
        donorId = existingDonor.id;
        console.log(
          `Found existing donor with matching name and phone: ${donorId}`
        );
      } else {
        // Create a new donor document with auto-generated ID
        const newDonorRef = doc(collection(db, "donors"));
        donorId = newDonorRef.id;
        console.log(`Creating new donor with ID: ${donorId}`);
      }

      const donorRef = doc(db, "donors", donorId);

      // Check if donor already exists
      const donorSnapshot = await getDoc(donorRef);

      if (donorSnapshot.exists()) {
        // Update existing donor
        const existingData = donorSnapshot.data();
        const updatedData = {
          ...donorData,
          totalDonations: (existingData.totalDonations || 0) + 1,
          totalAmount:
            (existingData.totalAmount || 0) + (donorData.totalAmount || 0),
          lastDonation: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(donorRef, updatedData, { merge: true });

        // Update the donor in the local state if it exists
        const donorIndex = donors.value.findIndex((d) => d.id === donorId);
        if (donorIndex !== -1) {
          // Update existing donor in the array
          donors.value[donorIndex] = {
            ...donors.value[donorIndex],
            ...updatedData,
            lastDonation: new Date(),
            updatedAt: new Date(),
          };
        } else {
          // Add the donor to the local state if it's not already there
          donors.value.push({
            id: donorId,
            ...updatedData,
            lastDonation: new Date(),
            updatedAt: new Date(),
          });
        }

        return {
          id: donorId,
          ...updatedData,
          isNew: false,
        };
      } else {
        // Create new donor
        const newDonorData = {
          ...donorData,
          totalDonations: 1,
          createdAt: serverTimestamp(),
          lastDonation: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(donorRef, newDonorData);

        // Add the new donor to the local state
        donors.value.push({
          id: donorId,
          ...newDonorData,
          createdAt: new Date(),
          lastDonation: new Date(),
          updatedAt: new Date(),
        });

        return {
          id: donorId,
          ...newDonorData,
          isNew: true,
        };
      }
    } catch (err) {
      console.error("Error creating/updating donor:", err);
      error.value = "Failed to process donor information. Please try again.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Helper functions for formatting
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    // Handle Firestore Timestamp objects
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }

    // Handle Date objects or ISO strings
    return new Date(timestamp).toLocaleString();
  };

  return {
    // State
    donors,
    currentDonor,
    loading,
    error,

    // Getters
    getDonorById,
    getDonorByPhone,
    getTopDonors,

    // Actions
    fetchDonors,
    fetchDonorById,
    fetchDonorByPhone,
    updateDonor,
    createOrUpdateDonor,

    // Formatters
    formatDate,
  };
});
