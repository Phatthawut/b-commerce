import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
  endAt,
  limitToLast,
  count,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const useRecipientStore = defineStore("recipient", () => {
  // State
  const recipients = ref([]);
  const regions = ref([]);
  const loading = ref(false);
  const error = ref("");
  const lastVisible = ref(null);

  // Getters
  const getRecipientsByCategory = computed(() => {
    return (category) =>
      recipients.value.filter((r) => r.category === category);
  });

  const getRecipientsByRegion = computed(() => {
    return (regionId) =>
      recipients.value.filter((r) => r.regionId === regionId);
  });

  const getFilteredRecipients = computed(() => {
    return (category, regionId) =>
      recipients.value.filter(
        (r) => r.category === category && r.regionId === regionId
      );
  });

  const getFilteredRecipientsByCountry = computed(() => {
    return (category, regionId, country) =>
      recipients.value.filter(
        (r) =>
          r.category === category &&
          r.regionId === regionId &&
          r.country === country
      );
  });

  // Countries cache
  const countriesByRegion = ref({});

  // Actions
  const fetchRegions = async () => {
    loading.value = true;
    error.value = "";

    try {
      const regionsRef = collection(db, "regions");
      const q = query(regionsRef, orderBy("name"));
      const querySnapshot = await getDocs(q);

      const regionsData = [];
      querySnapshot.forEach((doc) => {
        regionsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      regions.value = regionsData;
    } catch (err) {
      console.error("Error fetching regions:", err);
      error.value = "Failed to load regions. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  const fetchCountriesByRegion = async (regionId) => {
    loading.value = true;
    error.value = "";

    try {
      // Check if we have this in cache already
      if (countriesByRegion.value[regionId]) {
        return countriesByRegion.value[regionId];
      }

      const recipientsRef = collection(db, "recipients");
      const q = query(
        recipientsRef,
        where("regionId", "==", regionId),
        limit(1000)
      );

      const querySnapshot = await getDocs(q);
      const countries = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.country) {
          countries.add(data.country);
        }
      });

      const countriesArray = Array.from(countries).sort();

      // Store in cache
      countriesByRegion.value[regionId] = countriesArray;

      return countriesArray;
    } catch (err) {
      console.error(`Error fetching countries for region ${regionId}:`, err);
      error.value = "Failed to load countries. Please try again.";
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchRecipientsByCountry = async (
    category,
    regionId,
    country,
    pageSize = 20,
    reset = false
  ) => {
    loading.value = true;
    error.value = "";

    try {
      // Reset pagination if requested
      if (reset) {
        lastVisible.value = null;
      }

      // Build query for filtering by category, region, and country
      const recipientsRef = collection(db, "recipients");
      let q = query(
        recipientsRef,
        where("category", "==", category),
        where("regionId", "==", regionId),
        where("country", "==", country),
        orderBy("name"),
        limit(pageSize)
      );

      // Add pagination if we have a last item
      if (lastVisible.value) {
        q = query(q, startAfter(lastVisible.value));
      }

      const querySnapshot = await getDocs(q);

      // Store the last visible document for pagination
      if (!querySnapshot.empty) {
        lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1];
      } else {
        lastVisible.value = null;
      }

      const recipientsData = [];
      querySnapshot.forEach((doc) => {
        recipientsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // If we're resetting or this is the first page, replace the array
      // Otherwise append to the existing array
      if (reset) {
        recipients.value = recipientsData;
      } else {
        recipients.value = [...recipients.value, ...recipientsData];
      }

      return {
        items: recipientsData,
        hasMore: querySnapshot.size === pageSize,
      };
    } catch (err) {
      console.error("Error fetching recipients by country:", err);
      error.value = "Failed to load recipients. Please try again.";
      return { items: [], hasMore: false };
    } finally {
      loading.value = false;
    }
  };

  const fetchRecipients = async (
    category = "university", // Default to university category
    regionId = "north-america",
    searchTerm = null,
    pageSize = 20,
    page = 1
  ) => {
    loading.value = true;
    error.value = "";

    try {
      console.log(
        `Fetching recipients with category=${category}, regionId=${regionId}, page=${page}, pageSize=${pageSize}`
      );

      const recipientsRef = collection(db, "recipients");
      let conditions = [];

      // Add filtering conditions
      if (category && category !== "") {
        conditions.push(where("category", "==", category));
      }

      if (regionId && regionId !== "") {
        conditions.push(where("regionId", "==", regionId));
      }

      // Always order by name for consistent pagination
      conditions.push(orderBy("name"));

      // First get a count of all matching documents for pagination
      const countQuery = query(recipientsRef, ...conditions);
      const snapshot = await getCountFromServer(countQuery);
      const totalCount = snapshot.data().count;

      console.log(
        `Total documents matching category=${category}, regionId=${regionId}: ${totalCount}`
      );

      // For simplicity, we'll fetch all matching docs if there aren't too many
      // This makes client-side search and pagination more reliable
      const maxDocsToFetch = 500; // Reasonable limit for most use cases

      let recipientsData = [];

      if (totalCount <= maxDocsToFetch) {
        // Fetch all matching documents if count is reasonable
        const fullQuery = query(recipientsRef, ...conditions);
        const fullSnapshot = await getDocs(fullQuery);

        fullSnapshot.forEach((doc) => {
          recipientsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        console.log(`Fetched all ${recipientsData.length} matching documents`);
      } else {
        // For large collections, use server-side pagination
        const skipCount = (page - 1) * pageSize;
        console.log(
          `Using server pagination with skip=${skipCount}, limit=${pageSize}`
        );

        // Firestore doesn't have a skip/offset, so we need to use cursor pagination
        // First fetch the first page
        const firstPageQuery = query(
          recipientsRef,
          ...conditions,
          limit(skipCount + pageSize)
        );
        const firstPageSnapshot = await getDocs(firstPageQuery);

        if (firstPageSnapshot.size <= skipCount) {
          console.log(`Not enough documents to reach page ${page}`);
          recipientsData = [];
        } else {
          // Extract just the documents for the requested page
          const docsForPage = firstPageSnapshot.docs.slice(skipCount);
          recipientsData = docsForPage.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log(
            `Retrieved ${recipientsData.length} documents for page ${page}`
          );
        }
      }

      // Apply search filter if provided
      let filteredResults = recipientsData;
      if (searchTerm && searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase().trim();
        filteredResults = recipientsData.filter(
          (recipient) =>
            (recipient.name && recipient.name.toLowerCase().includes(search)) ||
            (recipient.country &&
              recipient.country.toLowerCase().includes(search)) ||
            (recipient.address &&
              recipient.address.toLowerCase().includes(search))
        );

        console.log(
          `Search for "${search}" found ${filteredResults.length} matches out of ${recipientsData.length} documents`
        );
      }

      // Calculate the final page based on filtered results
      const totalFilteredCount = filteredResults.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalFilteredCount);

      // Get the items for the current page
      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      console.log(
        `Returning page ${page} (${startIndex}-${endIndex}) of ${totalFilteredCount} filtered results`
      );

      if (paginatedResults.length > 0) {
        console.log(
          `First item: ${paginatedResults[0].name}, Last item: ${
            paginatedResults[paginatedResults.length - 1].name
          }`
        );
      } else {
        console.log(`No items found for page ${page}`);
      }

      return {
        items: paginatedResults,
        hasMore: endIndex < totalFilteredCount,
        totalCount: totalFilteredCount,
      };
    } catch (err) {
      console.error("Error fetching recipients:", err);
      error.value = "Failed to load recipients. Please try again.";
      return {
        items: [],
        hasMore: false,
        totalCount: 0,
      };
    } finally {
      loading.value = false;
    }
  };

  const getRecipientById = async (id) => {
    loading.value = true;
    error.value = "";

    try {
      const docRef = doc(db, "recipients", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        error.value = "Recipient not found";
        return null;
      }
    } catch (err) {
      console.error("Error fetching recipient:", err);
      error.value = "Failed to load recipient. Please try again.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Function to import recipients from CSV
  const importRecipientsFromCSV = async (csvData) => {
    loading.value = true;
    error.value = "";

    try {
      // Process CSV data and add to Firestore in batches
      // This is a simplified example - actual implementation would depend on CSV format
      const recipientsToAdd = csvData.map((row) => ({
        name: row.name,
        category: row.category,
        regionId: row.regionId,
        address: row.address,
        country: row.country || "", // Add country field, default to empty string if not provided
      }));

      let successCount = 0;

      // Add recipients in batches (could use batched writes for better performance)
      for (const recipient of recipientsToAdd) {
        await addDoc(collection(db, "recipients"), recipient);
        successCount++;
      }

      return {
        success: true,
        count: successCount,
      };
    } catch (err) {
      console.error("Error importing recipients:", err);
      error.value = "Failed to import recipients. Please try again.";
      return {
        success: false,
        error: err.message,
      };
    } finally {
      loading.value = false;
    }
  };

  // Add updateRecipient function to update a recipient
  const updateRecipient = async (recipientData) => {
    loading.value = true;
    error.value = "";

    try {
      const { id, ...data } = recipientData;
      const recipientRef = doc(db, "recipients", id);
      await updateDoc(recipientRef, data);
      return { success: true };
    } catch (err) {
      console.error("Error updating recipient:", err);
      error.value = "Failed to update recipient. Please try again.";
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Add deleteRecipient function to delete a recipient
  const deleteRecipient = async (id) => {
    loading.value = true;
    error.value = "";

    try {
      const recipientRef = doc(db, "recipients", id);
      await deleteDoc(recipientRef);
      return { success: true };
    } catch (err) {
      console.error("Error deleting recipient:", err);
      error.value = "Failed to delete recipient. Please try again.";
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    recipients,
    regions,
    loading,
    error,
    lastVisible,
    getRecipientsByCategory,
    getRecipientsByRegion,
    getFilteredRecipients,
    getFilteredRecipientsByCountry,
    fetchRegions,
    fetchCountriesByRegion,
    fetchRecipientsByCountry,
    fetchRecipients,
    getRecipientById,
    importRecipientsFromCSV,
    updateRecipient,
    deleteRecipient,
    countriesByRegion,
  };
});
