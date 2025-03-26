import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useDonationStore } from "./donationStore";

export const useDonationLookupStore = defineStore("donationLookup", () => {
  const loading = ref(false);
  const error = ref("");
  const lastSearchResult = ref(null);

  // Function to lookup donations by phone number and optional donation ID
  const lookupDonations = async (phoneNumber, donationId = null) => {
    loading.value = true;
    error.value = "";
    lastSearchResult.value = null;

    try {
      const donationStore = useDonationStore();
      let donationsQuery;

      if (donationId) {
        // If donation ID is provided, look for specific donation
        donationsQuery = query(
          collection(db, "donations"),
          where("donorPhone", "==", phoneNumber),
          where("__name__", "==", donationId)
        );
      } else {
        // If only phone number is provided, get recent donations
        donationsQuery = query(
          collection(db, "donations"),
          where("donorPhone", "==", phoneNumber),
          orderBy("timestamp", "desc"),
          limit(5) // Limit to last 5 donations
        );
      }

      const querySnapshot = await getDocs(donationsQuery);
      const donations = [];

      querySnapshot.forEach((doc) => {
        const donationData = {
          id: doc.id,
          ...doc.data(),
          formattedAmount: donationStore.formatCurrency(doc.data().amount),
          formattedDate: donationStore.formatDate(doc.data().timestamp),
          formattedStatus: donationStore.formatStatus(doc.data().status),
          formattedPaymentStatus: donationStore.formatStatus(
            doc.data().paymentStatus
          ),
        };
        donations.push(donationData);
      });

      lastSearchResult.value = donations;
      return donations;
    } catch (err) {
      console.error("Error looking up donations:", err);
      error.value = "Failed to lookup donations. Please try again.";
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Function to validate phone number format
  const validatePhoneNumber = (phoneNumber) => {
    // Basic Thai phone number validation (adjust regex as needed)
    const phoneRegex = /^0[1-9][0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Function to validate donation ID format
  const validateDonationId = (donationId) => {
    // Basic validation for Firestore document ID format
    const idRegex = /^[a-zA-Z0-9]{20}$/;
    return idRegex.test(donationId);
  };

  return {
    loading,
    error,
    lastSearchResult,
    lookupDonations,
    validatePhoneNumber,
    validateDonationId,
  };
});
