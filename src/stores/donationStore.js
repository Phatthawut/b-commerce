import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const useDonationStore = defineStore("donation", () => {
  // State
  const donations = ref([]);
  const currentDonation = ref(null);
  const loading = ref(false);
  const error = ref("");

  // Getters
  const getDonationById = computed(() => {
    return (id) => donations.value.find((donation) => donation.id === id);
  });

  const getPendingDonations = computed(() => {
    return donations.value.filter(
      (donation) => donation.paymentStatus === "pending"
    );
  });

  const getCompletedDonations = computed(() => {
    return donations.value.filter(
      (donation) => donation.paymentStatus === "completed"
    );
  });

  const getFailedDonations = computed(() => {
    return donations.value.filter(
      (donation) => donation.paymentStatus === "failed"
    );
  });

  // Actions
  const fetchDonations = async () => {
    loading.value = true;
    error.value = "";
    console.log("Fetching donations from Firestore...");

    try {
      console.log("Creating query for donations collection...");
      const donationsQuery = query(
        collection(db, "donations"),
        orderBy("createdAt", "desc")
      );

      console.log("Executing query...");
      const querySnapshot = await getDocs(donationsQuery);
      console.log(`Query returned ${querySnapshot.size} documents`);

      const donationsList = [];
      querySnapshot.forEach((doc) => {
        console.log(`Processing document with ID: ${doc.id}`);
        donationsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`Setting donations with ${donationsList.length} items`);
      donations.value = donationsList;
    } catch (err) {
      console.error("Error fetching donations:", err);
      error.value = "Failed to load donations. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  const fetchDonationById = async (id) => {
    loading.value = true;
    error.value = "";

    try {
      const donationRef = doc(db, "donations", id);
      const donationSnapshot = await getDoc(donationRef);

      if (donationSnapshot.exists()) {
        currentDonation.value = {
          id: donationSnapshot.id,
          ...donationSnapshot.data(),
        };
      } else {
        error.value = "Donation not found";
        currentDonation.value = null;
      }
    } catch (err) {
      console.error("Error fetching donation:", err);
      error.value = "Failed to load donation. Please try again.";
      currentDonation.value = null;
    } finally {
      loading.value = false;
    }
  };

  const createDonation = async (donationData) => {
    loading.value = true;
    error.value = "";

    try {
      // Create donation record
      const donationRef = await addDoc(collection(db, "donations"), {
        ...donationData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      // Add the new donation to the local state
      const newDonation = {
        id: donationRef.id,
        ...donationData,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      donations.value.unshift(newDonation);

      return donationRef.id;
    } catch (err) {
      console.error("Error creating donation:", err);
      error.value = "Failed to create donation. Please try again.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createDonorAndDonation = async (donorData, donationData) => {
    loading.value = true;
    error.value = "";
    console.log("Creating donor and donation with data:", {
      donorData,
      donationData,
    });

    try {
      // Use telephone as a unique identifier for the donor
      const donorId = donorData.telephone;
      if (!donorId) {
        throw new Error("Donor telephone is required");
      }

      const donorRef = doc(db, "donors", donorId);

      // Save donor data, merging with existing data if the donor already exists
      await setDoc(
        donorRef,
        {
          ...donorData,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`Donor saved with ID: ${donorId}`);

      // Don't override fields that are already set in donationData
      const donationWithDonorRef = {
        donorId: donorId,
        // Default values for required fields if not provided
        status: donationData.status || "initiated",
        paymentStatus: donationData.paymentStatus || "initiated",
        total:
          donationData.total ||
          donationData.formattedTotal ||
          `${donationData.amount.toLocaleString()} THB`,
        rawTotal: donationData.rawTotal || donationData.amount,
        pricePerSet: donationData.pricePerSet || 1500,
        message: donationData.message || "",
        // Spread the original donation data to keep all fields
        ...donationData,
        // Ensure timestamps are set
        createdAt: donationData.createdAt || serverTimestamp(),
        lastUpdated: donationData.lastUpdated || serverTimestamp(),
        timestamp: donationData.timestamp || serverTimestamp(),
      };

      console.log("Prepared donation data:", donationWithDonorRef);

      const donationRef = await addDoc(
        collection(db, "donations"),
        donationWithDonorRef
      );
      console.log(`Donation created with ID: ${donationRef.id}`);

      return {
        donorId,
        donationId: donationRef.id,
      };
    } catch (err) {
      console.error("Error creating donor and donation:", err);
      console.error("Error details:", err.message);
      console.error("Error stack:", err.stack);
      error.value = `Failed to process donation: ${err.message}`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateDonationPayment = async (donationId, paymentData) => {
    loading.value = true;
    error.value = "";

    try {
      const donationRef = doc(db, "donations", donationId);

      // Update payment information
      await updateDoc(donationRef, {
        ...paymentData,
        lastUpdated: serverTimestamp(),
      });

      // Update local state
      const index = donations.value.findIndex((d) => d.id === donationId);
      if (index !== -1) {
        donations.value[index] = {
          ...donations.value[index],
          ...paymentData,
          lastUpdated: new Date(),
        };
      }

      return true;
    } catch (err) {
      console.error("Error updating donation payment:", err);
      error.value = "Failed to update payment information. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateDonationStatus = async (donationId, newStatus) => {
    loading.value = true;
    error.value = "";

    try {
      const donationRef = doc(db, "donations", donationId);

      await updateDoc(donationRef, {
        paymentStatus: newStatus,
        status: newStatus,
        lastUpdated: serverTimestamp(),
      });

      // Update local state
      const index = donations.value.findIndex((d) => d.id === donationId);
      if (index !== -1) {
        donations.value[index].paymentStatus = newStatus;
        donations.value[index].status = newStatus;
        donations.value[index].lastUpdated = new Date();
      }

      return true;
    } catch (err) {
      console.error("Error updating donation status:", err);
      error.value = "Failed to update donation status. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Function to create test data
  const createTestData = async () => {
    loading.value = true;
    error.value = "";
    console.log("Creating test donation data...");

    try {
      // Create a test donor
      const donorData = {
        name: "Test Donor",
        email: "test@example.com",
        telephone: "1234567890",
        address: "123 Test Street, Test City",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      };

      // Save donor
      const donorId = donorData.telephone;
      const donorRef = doc(db, "donors", donorId);
      await setDoc(donorRef, donorData);
      console.log(`Created test donor with ID: ${donorId}`);

      // Create test donations with different statuses
      const statuses = ["pending", "completed", "failed"];
      const categories = ["university", "library", "nonprofit"];
      const regions = ["Bangkok", "Chiang Mai", "Phuket", "Khon Kaen"];

      for (let i = 0; i < 5; i++) {
        const status = statuses[i % statuses.length];
        const category = categories[i % categories.length];
        const region = regions[i % regions.length];

        const donationData = {
          donorId: donorId,
          name: donorData.name,
          email: donorData.email,
          telephone: donorData.telephone,
          address: donorData.address,
          recipientName: `Test Recipient ${i + 1}`,
          recipientCategory: category,
          recipientRegion: region,
          recipientAddress: `${i + 100} Recipient Street, ${region}`,
          quantity: i + 1,
          amount: (i + 1) * 1000,
          paymentMethod: i % 2 === 0 ? "creditCard" : "bankTransfer",
          paymentStatus: status,
          status: status,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        };

        // Add payment details for completed donations
        if (status === "completed") {
          donationData.paymentDate = serverTimestamp();
          if (donationData.paymentMethod === "creditCard") {
            donationData.cardDetails = {
              cardholderName: donorData.name,
              lastFourDigits: "4242",
            };
          } else {
            donationData.transferReference = `REF${Math.floor(
              Math.random() * 1000000
            )}`;
          }
        }

        const donationRef = await addDoc(
          collection(db, "donations"),
          donationData
        );
        console.log(`Created test donation with ID: ${donationRef.id}`);
      }

      console.log("Test data creation complete");
      return true;
    } catch (err) {
      console.error("Error creating test data:", err);
      error.value = "Failed to create test data. Please try again.";
      return false;
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

  const formatPaymentMethod = (method) => {
    if (method === "credit-card") return "Credit Card";
    if (method === "bank-transfer") return "Bank Transfer";
    return method || "N/A";
  };

  const formatStatus = (status) => {
    if (status === "completed") return "Completed";
    if (status === "pending") return "Pending Verification";
    if (status === "failed") return "Failed";
    return status || "N/A";
  };

  const formatCategory = (category) => {
    if (category === "university") return "University";
    if (category === "library") return "Library";
    if (category === "nonprofit") return "Non-Profit Organization";
    return category || "N/A";
  };

  return {
    // State
    donations,
    currentDonation,
    loading,
    error,

    // Getters
    getDonationById,
    getPendingDonations,
    getCompletedDonations,
    getFailedDonations,

    // Actions
    fetchDonations,
    fetchDonationById,
    createDonation,
    createDonorAndDonation,
    updateDonationPayment,
    updateDonationStatus,
    createTestData,

    // Formatters
    formatDate,
    formatPaymentMethod,
    formatStatus,
    formatCategory,
  };
});
