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
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useDonorStore } from "./donorStore";
import { useAuthStore } from "./authStore";

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

  const getDonationsByDonorId = computed(() => {
    return (donorId) =>
      donations.value.filter((donation) => donation.donorId === donorId);
  });

  const getRecentDonations = computed(() => {
    return [...donations.value]
      .sort((a, b) => {
        // Sort by timestamp (most recent first)
        const dateA = a.timestamp?.seconds
          ? a.timestamp.seconds
          : new Date(a.timestamp).getTime() / 1000;
        const dateB = b.timestamp?.seconds
          ? b.timestamp.seconds
          : new Date(b.timestamp).getTime() / 1000;
        return dateB - dateA;
      })
      .slice(0, 5);
  });

  const getTotalDonations = computed(() => {
    return donations.value.reduce((total, donation) => {
      return total + (donation.amount || 0);
    }, 0);
  });

  // Actions
  const fetchDonations = async () => {
    loading.value = true;
    error.value = "";

    try {
      const donationsQuery = query(
        collection(db, "donations"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(donationsQuery);

      const donationsList = [];
      querySnapshot.forEach((doc) => {
        donationsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

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
        const donationData = {
          id: donationSnapshot.id,
          ...donationSnapshot.data(),
        };
        currentDonation.value = donationData;
        return donationData;
      } else {
        error.value = "Donation not found";
        currentDonation.value = null;
        return null;
      }
    } catch (err) {
      console.error("Error fetching donation:", err);
      error.value = "Failed to load donation. Please try again.";
      currentDonation.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchDonationsByDonorId = async (donorId) => {
    loading.value = true;
    error.value = "";

    try {
      const donationsQuery = query(
        collection(db, "donations"),
        where("donorId", "==", donorId),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(donationsQuery);

      const donorDonations = [];
      querySnapshot.forEach((doc) => {
        donorDonations.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return donorDonations;
    } catch (err) {
      console.error("Error fetching donor donations:", err);
      error.value = "Failed to load donor donations. Please try again.";
      return [];
    } finally {
      loading.value = false;
    }
  };

  const createDonation = async (donationData) => {
    loading.value = true;
    error.value = "";

    try {
      const donorStore = useDonorStore();

      // Process donor information
      if (!donationData.donorPhone) {
        throw new Error("Donor phone number is required for donations");
      }

      if (!donationData.donorName) {
        throw new Error("Donor name is required for donations");
      }

      // Create or update donor with minimal required information
      const donor = await donorStore.createOrUpdateDonor({
        name: donationData.donorName,
        email: donationData.donorEmail || "",
        telephone: donationData.donorPhone,
        address: donationData.donorAddress || "",
        totalAmount: donationData.amount,
      });

      if (!donor) {
        throw new Error("Failed to process donor information");
      }

      console.log(`Creating donation for donor: ${donor.id}`, {
        donorId: donor.id,
        donorName: donor.name ? "***" : "Not provided",
        amount: donationData.amount,
        timestamp: new Date().toISOString(),
      });

      // Create donation document with minimal required fields
      const donationRef = await addDoc(collection(db, "donations"), {
        donorId: donor.id,
        donorName: donor.name,
        donorPhone: donor.telephone,
        donorEmail: donor.email || "",
        amount: donationData.amount,
        items: donationData.items || [],
        paymentMethod: donationData.paymentMethod || "bank_transfer",
        paymentStatus: "pending",
        notes: donationData.notes || "",
        timestamp: serverTimestamp(),
        status: "received",
      });

      const newDonation = {
        id: donationRef.id,
        donorId: donor.id,
        donorName: donor.name,
        donorPhone: donor.telephone,
        donorEmail: donor.email || "",
        amount: donationData.amount,
        items: donationData.items || [],
        paymentMethod: donationData.paymentMethod || "bank_transfer",
        paymentStatus: "pending",
        notes: donationData.notes || "",
        timestamp: new Date(),
        status: "received",
      };

      // Add to local state
      donations.value.unshift(newDonation);

      return newDonation;
    } catch (err) {
      console.error("Error creating donation:", err);
      error.value =
        err.message || "Failed to create donation. Please try again.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateDonation = async (donationId, donationData) => {
    loading.value = true;
    error.value = "";

    try {
      const donationRef = doc(db, "donations", donationId);

      await updateDoc(donationRef, {
        ...donationData,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const index = donations.value.findIndex((d) => d.id === donationId);
      if (index !== -1) {
        donations.value[index] = {
          ...donations.value[index],
          ...donationData,
          updatedAt: new Date(),
        };
      }

      return true;
    } catch (err) {
      console.error("Error updating donation:", err);
      error.value = "Failed to update donation. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Function specifically for updating payment information
  const updateDonationPayment = async (donationId, paymentData) => {
    loading.value = true;
    error.value = "";

    try {
      const donationRef = doc(db, "donations", donationId);

      // Add payment date if not provided
      if (!paymentData.paymentDate) {
        paymentData.paymentDate = serverTimestamp();
      }

      // Update the donation with payment information
      await updateDoc(donationRef, {
        ...paymentData,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const index = donations.value.findIndex((d) => d.id === donationId);
      if (index !== -1) {
        donations.value[index] = {
          ...donations.value[index],
          ...paymentData,
          updatedAt: new Date(),
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount || 0);
  };

  const formatPaymentMethod = (method) => {
    if (method === "credit_card") return "Credit Card";
    if (method === "bank_transfer") return "Bank Transfer";
    if (method === "paypal") return "PayPal";
    if (method === "cash") return "Cash";
    return method || "N/A";
  };

  const formatStatus = (status) => {
    if (status === "pending") return "Pending";
    if (status === "processing") return "Processing";
    if (status === "completed") return "Completed";
    if (status === "failed") return "Failed";
    if (status === "cancelled") return "Cancelled";
    if (status === "received") return "Received";
    if (status === "initiated") return "Initiated";
    return status || "N/A";
  };

  const formatCategory = (category) => {
    if (category === "university") return "University";
    if (category === "library") return "Library";
    if (category === "nonprofit") return "Non-Profit Organization";
    if (category === "school") return "School";
    if (category === "community") return "Community Center";
    return category || "N/A";
  };

  // Function to create both donor and donation in one transaction
  const createDonorAndDonation = async (donorData, donationData) => {
    loading.value = true;
    error.value = "";

    try {
      const donorStore = useDonorStore();

      // Create or update donor
      const donor = await donorStore.createOrUpdateDonor({
        name: donorData.name,
        email: donorData.email || "",
        telephone: donorData.telephone,
        address: donorData.address || "",
        totalAmount: donationData.amount,
      });

      if (!donor) {
        throw new Error("Failed to process donor information");
      }

      console.log(`Creating donation for donor: ${donor.id}`, {
        donorId: donor.id,
        donorName: donor.name ? "***" : "Not provided",
        amount: donationData.amount,
        timestamp: new Date().toISOString(),
      });

      // Create donation document
      const donationRef = await addDoc(collection(db, "donations"), {
        donorId: donor.id,
        donorName: donor.name,
        donorPhone: donor.telephone,
        donorEmail: donor.email,
        amount: donationData.amount,
        recipients: donationData.recipients || [],
        quantity: donationData.quantity || 1,
        paymentMethod: donationData.paymentMethod || "bank_transfer",
        paymentStatus: donationData.paymentStatus || "initiated",
        notes: donationData.message || "",
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        status: donationData.status || "initiated",
        reminderSent: false, // Track if a reminder has been sent
      });

      const newDonation = {
        id: donationRef.id,
        donorId: donor.id,
        donorName: donor.name,
        donorPhone: donor.telephone,
        donorEmail: donor.email,
        amount: donationData.amount,
        recipients: donationData.recipients || [],
        quantity: donationData.quantity || 1,
        paymentMethod: donationData.paymentMethod || "bank_transfer",
        paymentStatus: donationData.paymentStatus || "initiated",
        notes: donationData.message || "",
        timestamp: new Date(),
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: donationData.status || "initiated",
        reminderSent: false,
      };

      // Add to local state
      donations.value.unshift(newDonation);

      return {
        donationId: donationRef.id,
        donorId: donor.id,
        success: true,
      };
    } catch (err) {
      console.error("Error creating donation:", err);
      error.value =
        err.message || "Failed to create donation. Please try again.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Function to fetch donations by status
  const fetchDonationsByStatus = async (status) => {
    loading.value = true;
    error.value = "";

    try {
      const donationsQuery = query(
        collection(db, "donations"),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(donationsQuery);
      const donationsList = [];

      querySnapshot.forEach((doc) => {
        donationsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return donationsList;
    } catch (err) {
      console.error(`Error fetching ${status} donations:`, err);
      error.value = `Failed to load ${status} donations. Please try again.`;
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Function to fetch incomplete donations for a specific donor
  const fetchIncompleteDonationsByDonor = async (donorId) => {
    loading.value = true;
    error.value = "";

    try {
      // Try the complex query first (requires composite index)
      try {
        const donationsQuery = query(
          collection(db, "donations"),
          where("donorId", "==", donorId),
          where("status", "==", "initiated"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(donationsQuery);
        const donationsList = [];

        querySnapshot.forEach((doc) => {
          donationsList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        return donationsList;
      } catch (indexError) {
        console.warn(
          "Index not yet available, using fallback query:",
          indexError.message
        );

        // Fallback query without ordering (doesn't require composite index)
        const fallbackQuery = query(
          collection(db, "donations"),
          where("donorId", "==", donorId),
          where("status", "==", "initiated")
        );

        const fallbackSnapshot = await getDocs(fallbackQuery);
        const fallbackList = [];

        fallbackSnapshot.forEach((doc) => {
          fallbackList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Sort manually in memory
        return fallbackList.sort((a, b) => {
          // Sort by createdAt (most recent first)
          const dateA = a.createdAt?.seconds
            ? a.createdAt.seconds
            : new Date(a.createdAt).getTime() / 1000;
          const dateB = b.createdAt?.seconds
            ? b.createdAt.seconds
            : new Date(b.createdAt).getTime() / 1000;
          return dateB - dateA;
        });
      }
    } catch (err) {
      console.error("Error fetching incomplete donations:", err);
      error.value = "Failed to load incomplete donations. Please try again.";
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Function to mark abandoned donations
  const markAbandonedDonations = async (daysThreshold = 7) => {
    loading.value = true;
    error.value = "";

    try {
      // Calculate the cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

      // Convert to Firestore timestamp
      const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

      // Query for initiated donations older than the cutoff
      const abandonedDonationsQuery = query(
        collection(db, "donations"),
        where("status", "==", "initiated"),
        where("createdAt", "<", cutoffTimestamp)
      );

      const querySnapshot = await getDocs(abandonedDonationsQuery);
      const updatedCount = querySnapshot.size;

      // Update each abandoned donation
      const batch = db.batch();
      querySnapshot.forEach((doc) => {
        const donationRef = doc.ref;
        batch.update(donationRef, {
          status: "abandoned",
          lastUpdated: serverTimestamp(),
        });
      });

      await batch.commit();

      // Update local state if needed
      querySnapshot.forEach((doc) => {
        const index = donations.value.findIndex((d) => d.id === doc.id);
        if (index !== -1) {
          donations.value[index].status = "abandoned";
          donations.value[index].lastUpdated = new Date();
        }
      });

      return { success: true, count: updatedCount };
    } catch (err) {
      console.error("Error marking abandoned donations:", err);
      error.value = "Failed to process abandoned donations.";
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Function to resume an incomplete donation
  const resumeDonation = async (donationId) => {
    loading.value = true;
    error.value = "";

    try {
      const donationRef = doc(db, "donations", donationId);

      // Update the donation status
      await updateDoc(donationRef, {
        status: "initiated", // Reset to initiated if it was abandoned
        lastUpdated: serverTimestamp(),
      });

      // Update local state
      const index = donations.value.findIndex((d) => d.id === donationId);
      if (index !== -1) {
        donations.value[index].status = "initiated";
        donations.value[index].lastUpdated = new Date();
      }

      return { success: true, donationId };
    } catch (err) {
      console.error("Error resuming donation:", err);
      error.value = "Failed to resume donation. Please try again.";
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Function to create test data for development
  const createTestData = async () => {
    loading.value = true;
    error.value = "";

    try {
      // Check if we already have donations
      const donationsQuery = query(collection(db, "donations"), limit(1));
      const snapshot = await getDocs(donationsQuery);

      // Only create test data if collection is empty
      if (snapshot.empty) {
        const donorStore = useDonorStore();

        // Create test donors
        const donor1 = await donorStore.createOrUpdateDonor({
          name: "John Doe",
          email: "john.doe@example.com",
          telephone: "0812345678",
          address: "123 Main St, Bangkok",
          totalAmount: 3000,
        });

        const donor2 = await donorStore.createOrUpdateDonor({
          name: "Jane Smith",
          email: "jane.smith@example.com",
          telephone: "0823456789",
          address: "456 Park Ave, Chiang Mai",
          totalAmount: 4500,
        });

        const donor3 = await donorStore.createOrUpdateDonor({
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          telephone: "0834567890",
          address: "789 River Rd, Phuket",
          totalAmount: 1500,
        });

        // Create test donations
        const testDonations = [
          {
            donorId: donor1.id,
            donorName: donor1.name,
            donorPhone: donor1.telephone,
            amount: 3000,
            items: [
              {
                name: "Fiction Books",
                quantity: 10,
                description: "Various fiction titles",
              },
              {
                name: "Children's Books",
                quantity: 5,
                description: "Picture books for kids",
              },
            ],
            paymentMethod: "credit_card",
            paymentStatus: "completed",
            notes: "Monthly donation",
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            status: "received",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            donorId: donor2.id,
            donorName: donor2.name,
            donorPhone: donor2.telephone,
            amount: 4500,
            items: [
              {
                name: "Textbooks",
                quantity: 15,
                description: "University level textbooks",
              },
              {
                name: "Reference Books",
                quantity: 3,
                description: "Encyclopedias",
              },
            ],
            paymentMethod: "bank_transfer",
            paymentStatus: "pending",
            notes: "School donation",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: "processing",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            donorId: donor3.id,
            donorName: donor3.name,
            donorPhone: donor3.telephone,
            amount: 1500,
            items: [
              {
                name: "Comic Books",
                quantity: 20,
                description: "Various comic book titles",
              },
            ],
            paymentMethod: "paypal",
            paymentStatus: "completed",
            notes: "One-time donation",
            timestamp: new Date(),
            status: "received",
            createdAt: new Date(),
            lastUpdated: new Date(),
          },
          {
            donorId: donor1.id,
            donorName: donor1.name,
            donorPhone: donor1.telephone,
            amount: 2000,
            items: [
              {
                name: "Science Books",
                quantity: 8,
                description: "Popular science titles",
              },
            ],
            paymentMethod: "credit_card",
            paymentStatus: "failed",
            notes: "Card declined",
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            status: "cancelled",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
        ];

        // Add test donations to Firestore
        for (const donation of testDonations) {
          await addDoc(collection(db, "donations"), {
            ...donation,
            timestamp: serverTimestamp(),
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
          });
        }

        console.log("Test donation data created successfully");
        return true;
      } else {
        console.log("Donations collection already has data");
        return false;
      }
    } catch (err) {
      console.error("Error creating test donation data:", err);
      error.value = "Failed to create test data. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    donations,
    currentDonation,
    loading,
    error,

    // Getters
    getDonationById,
    getDonationsByDonorId,
    getRecentDonations,
    getTotalDonations,

    // Actions
    fetchDonations,
    fetchDonationById,
    fetchDonationsByDonorId,
    createDonation,
    updateDonation,
    updateDonationPayment,
    createDonorAndDonation,
    createTestData,
    fetchDonationsByStatus,
    fetchIncompleteDonationsByDonor,
    markAbandonedDonations,
    resumeDonation,

    // Formatters
    formatDate,
    formatCurrency,
    formatPaymentMethod,
    formatStatus,
    formatCategory,
  };
});
