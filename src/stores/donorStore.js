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
} from "firebase/firestore";
import { db } from "@/firebase/config";

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
      // In Firestore, we're using the phone number as the document ID
      const donorRef = doc(db, "donors", phone);
      const donorSnapshot = await getDoc(donorRef);

      if (donorSnapshot.exists()) {
        currentDonor.value = {
          id: donorSnapshot.id,
          ...donorSnapshot.data(),
        };
        return currentDonor.value;
      } else {
        error.value = "Donor not found";
        currentDonor.value = null;
        return null;
      }
    } catch (err) {
      console.error("Error fetching donor by phone:", err);
      error.value = "Failed to load donor. Please try again.";
      currentDonor.value = null;
      return null;
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
        lastUpdated: serverTimestamp(),
      });

      // Update local state
      const index = donors.value.findIndex((d) => d.id === donorId);
      if (index !== -1) {
        donors.value[index] = {
          ...donors.value[index],
          ...donorData,
          lastUpdated: new Date(),
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
      if (!donorData.telephone) {
        throw new Error("Donor telephone is required");
      }

      const donorId = donorData.telephone;
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
          lastUpdated: serverTimestamp(),
        };

        await setDoc(donorRef, updatedData, { merge: true });

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
          lastUpdated: serverTimestamp(),
        };

        await setDoc(donorRef, newDonorData);

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
