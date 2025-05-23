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
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const useShipmentStore = defineStore("shipment", () => {
  // State
  const shipments = ref([]);
  const currentShipment = ref(null);
  const loading = ref(false);
  const error = ref("");

  // Getters
  const getShipmentById = computed(() => {
    return (id) => shipments.value.find((shipment) => shipment.id === id);
  });

  const getShipmentsByDonationId = computed(() => {
    return (donationId) =>
      shipments.value.filter((shipment) => shipment.donationId === donationId);
  });

  const getPendingShipments = computed(() => {
    return shipments.value.filter(
      (shipment) =>
        shipment.status === "pending" || shipment.status === "processing"
    );
  });

  const getCompletedShipments = computed(() => {
    return shipments.value.filter(
      (shipment) => shipment.status === "delivered"
    );
  });

  // Actions
  const fetchShipments = async () => {
    loading.value = true;
    error.value = "";

    try {
      const shipmentsQuery = query(
        collection(db, "shipments"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(shipmentsQuery);
      const shipmentsList = [];

      querySnapshot.forEach((doc) => {
        const shipmentData = doc.data();
        console.log(`Shipment ${doc.id} data:`, shipmentData);

        // Extract recipient information from recipients array if it exists
        let recipientInfo = { name: "N/A", address: "N/A", phone: "N/A" };

        if (shipmentData.recipients && shipmentData.recipients.length > 0) {
          const recipient = shipmentData.recipients[0];
          recipientInfo = {
            name:
              recipient.recipientName ||
              recipient.institutionName ||
              shipmentData.recipientName ||
              "N/A",
            address:
              recipient.address ||
              recipient.recipientAddress ||
              shipmentData.recipientAddress ||
              "N/A",
            phone:
              recipient.phone ||
              recipient.recipientPhone ||
              shipmentData.recipientPhone ||
              "N/A",
          };
          console.log(
            `Recipient info for ${doc.id} (from recipients array):`,
            recipientInfo
          );
        } else if (shipmentData.recipientName) {
          recipientInfo = {
            name: shipmentData.recipientName || "N/A",
            address: shipmentData.recipientAddress || "N/A",
            phone: shipmentData.recipientPhone || "N/A",
          };
          console.log(
            `Recipient info for ${doc.id} (from direct properties):`,
            recipientInfo
          );
        } else {
          console.log(`No recipient info found for shipment ${doc.id}`);
        }

        // Create a shipment object with the recipient information
        const shipment = {
          id: doc.id,
          ...shipmentData,
          recipientName: recipientInfo.name,
          recipientAddress: recipientInfo.address,
          recipientPhone: recipientInfo.phone,
        };

        shipmentsList.push(shipment);
      });

      shipments.value = shipmentsList;
    } catch (err) {
      console.error("Error fetching shipments:", err);
      error.value = "Failed to load shipments. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  const fetchShipmentsByDonationId = async (donationId) => {
    loading.value = true;
    error.value = "";

    try {
      const shipmentsQuery = query(
        collection(db, "shipments"),
        where("donationId", "==", donationId)
      );

      const querySnapshot = await getDocs(shipmentsQuery);
      const shipmentsList = [];

      querySnapshot.forEach((doc) => {
        shipmentsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort locally by createdAt in descending order
      shipmentsList.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      shipments.value = shipmentsList;
      return shipmentsList;
    } catch (err) {
      console.error("Error fetching shipments for donation:", err);
      error.value =
        "Failed to load shipments for this donation. Please try again.";
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchShipmentById = async (id) => {
    loading.value = true;
    error.value = "";

    try {
      const shipmentRef = doc(db, "shipments", id);
      const shipmentSnapshot = await getDoc(shipmentRef);

      if (shipmentSnapshot.exists()) {
        const shipmentData = shipmentSnapshot.data();
        console.log(`Fetched shipment ${id} data:`, shipmentData);

        // Extract recipient information from recipients array if it exists
        let recipientName = "";
        let recipientAddress = "";
        let recipientPhone = "";

        if (shipmentData.recipients && shipmentData.recipients.length > 0) {
          const recipient = shipmentData.recipients[0]; // Use the first recipient
          recipientName =
            recipient.recipientName || recipient.institutionName || "";
          recipientAddress = recipient.address || "";
          recipientPhone = recipient.phone || "";

          console.log(
            `Extracted recipient info for ${id} from recipients array:`,
            {
              name: recipientName,
              address: recipientAddress,
              phone: recipientPhone,
            }
          );
        } else {
          console.log(
            `No recipients array found for shipment ${id}, using direct properties`
          );
        }

        currentShipment.value = {
          id: shipmentSnapshot.id,
          ...shipmentData,
          // Ensure recipient data is explicitly included, prioritizing extracted data
          recipientName: recipientName || shipmentData.recipientName || "",
          recipientAddress:
            recipientAddress || shipmentData.recipientAddress || "",
          recipientPhone: recipientPhone || shipmentData.recipientPhone || "",
        };
      } else {
        error.value = "Shipment not found";
        currentShipment.value = null;
      }
    } catch (err) {
      console.error("Error fetching shipment:", err);
      error.value = "Failed to load shipment. Please try again.";
      currentShipment.value = null;
    } finally {
      loading.value = false;
    }
  };

  const createShipment = async (shipmentData) => {
    loading.value = true;
    error.value = "";

    try {
      // Validate required recipient information
      if (!shipmentData.recipientName || !shipmentData.recipientAddress) {
        throw new Error("Recipient name and address are required");
      }

      // Create shipment record with all recipient information
      const shipmentRef = await addDoc(collection(db, "shipments"), {
        ...shipmentData,
        recipientName: shipmentData.recipientName,
        recipientAddress: shipmentData.recipientAddress,
        recipientPhone: shipmentData.recipientPhone || "",
        status: shipmentData.status || "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        items: shipmentData.items || [],
      });

      // Add the new shipment to the local state
      const newShipment = {
        id: shipmentRef.id,
        ...shipmentData,
        recipientName: shipmentData.recipientName,
        recipientAddress: shipmentData.recipientAddress,
        recipientPhone: shipmentData.recipientPhone || "",
        status: shipmentData.status || "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: shipmentData.items || [],
      };

      shipments.value.unshift(newShipment);
      console.log("Created new shipment:", newShipment);

      return shipmentRef.id;
    } catch (err) {
      console.error("Error creating shipment:", err);
      error.value =
        err.message || "Failed to create shipment. Please try again.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateShipment = async (shipmentId, updateData) => {
    loading.value = true;
    error.value = "";

    try {
      const shipmentRef = doc(db, "shipments", shipmentId);

      // Update shipment information
      await updateDoc(shipmentRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const index = shipments.value.findIndex((s) => s.id === shipmentId);
      if (index !== -1) {
        shipments.value[index] = {
          ...shipments.value[index],
          ...updateData,
          updatedAt: new Date(),
        };
      }

      return true;
    } catch (err) {
      console.error("Error updating shipment:", err);
      error.value = "Failed to update shipment information. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateShipmentStatus = async (
    shipmentId,
    newStatus,
    additionalData = {}
  ) => {
    loading.value = true;
    error.value = "";

    try {
      const shipmentRef = doc(db, "shipments", shipmentId);

      // Prepare update data based on the new status
      const updateData = {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...additionalData,
      };

      // Add status-specific timestamp
      if (newStatus === "processing") {
        updateData.processingDate = serverTimestamp();
      } else if (newStatus === "shipped") {
        updateData.shippedDate = serverTimestamp();
      } else if (newStatus === "delivered") {
        updateData.deliveredDate = serverTimestamp();
      } else if (newStatus === "cancelled") {
        updateData.cancelledDate = serverTimestamp();
      }

      await updateDoc(shipmentRef, updateData);

      // Update local state
      const index = shipments.value.findIndex((s) => s.id === shipmentId);
      if (index !== -1) {
        shipments.value[index] = {
          ...shipments.value[index],
          ...updateData,
          status: newStatus,
          updatedAt: new Date(),
        };

        // Add status-specific timestamp to local state
        if (newStatus === "processing") {
          shipments.value[index].processingDate = new Date();
        } else if (newStatus === "shipped") {
          shipments.value[index].shippedDate = new Date();
        } else if (newStatus === "delivered") {
          shipments.value[index].deliveredDate = new Date();
        } else if (newStatus === "cancelled") {
          shipments.value[index].cancelledDate = new Date();
        }
      }

      return true;
    } catch (err) {
      console.error("Error updating shipment status:", err);
      error.value = "Failed to update shipment status. Please try again.";
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

  const formatStatus = (status) => {
    if (status === "pending") return "Pending";
    if (status === "processing") return "Processing";
    if (status === "shipped") return "Shipped";
    if (status === "delivered") return "Delivered";
    if (status === "cancelled") return "Cancelled";
    return status || "N/A";
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "processing") return "bg-blue-100 text-blue-800";
    if (status === "shipped") return "bg-purple-100 text-purple-800";
    if (status === "delivered") return "bg-green-100 text-green-800";
    if (status === "cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Create a shipment from a donation
  const createShipmentFromDonation = async (donation) => {
    try {
      loading.value = true;
      error.value = "";

      console.log("Creating shipment from donation:", donation);

      // Check if shipments already exist for this donation
      if (donation.id) {
        const existingShipments = await fetchShipmentsByDonationId(donation.id);
        if (existingShipments && existingShipments.length > 0) {
          console.log(
            `Shipments already exist for donation ${donation.id}:`,
            existingShipments
          );
          console.log(
            `Returning existing shipment IDs instead of creating duplicates`
          );

          // Return the IDs of existing shipments
          const existingIds = existingShipments.map((shipment) => shipment.id);
          loading.value = false;
          return existingIds;
        }
      }

      // Create recipients array from donation data
      let recipients = [];

      // Check if donation has recipients array
      if (donation.recipients && donation.recipients.length > 0) {
        console.log(
          "Using recipients array from donation:",
          donation.recipients
        );
        // Map the recipients array to ensure all fields are properly formatted
        recipients = donation.recipients.map((recipient) => ({
          recipientName:
            recipient.recipientName || recipient.institutionName || "",
          address: recipient.address || recipient.recipientAddress || "",
          phone: recipient.phone || recipient.recipientPhone || "",
          recipientCategory: recipient.recipientCategory || "individual",
          recipientId: recipient.recipientId || "",
          recipientRegion: recipient.recipientRegion || "",
          quantity: 1, // Each recipient gets 1 book set
        }));
      } else {
        // Create a single recipient from donation fields
        console.log("Creating recipient from donation fields");
        recipients = [
          {
            recipientName: donation.recipientName || donation.donorName || "",
            address: donation.recipientAddress || "",
            phone: donation.recipientPhone || donation.donorPhone || "",
            recipientCategory: donation.recipientCategory || "individual",
            recipientId: donation.recipientId || "",
            recipientRegion: donation.recipientRegion || "",
            quantity: donation.quantity || 1, // If only one recipient, they get all books
          },
        ];
      }

      console.log("Final recipients array for shipment:", recipients);

      // Validate that we have at least some recipient information
      if (recipients.length === 0 || !recipients[0].recipientName) {
        console.error("No valid recipient information found in donation");
        throw new Error("Missing recipient information");
      }

      // Create a separate shipment for each recipient
      const shipmentIds = [];

      for (const recipient of recipients) {
        // Create a new shipment object for this recipient
        const shipmentData = {
          donationId: donation.id,
          status: "pending",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          items: [
            {
              name: "Book Donation",
              quantity: 1, // Each recipient gets 1 book set
            },
          ],
          notes: "Automatically created from successful payment",
          // Store single recipient as direct properties
          recipientName: recipient.recipientName || "",
          recipientAddress: recipient.address || "",
          recipientPhone: recipient.phone || "",
          // Also store the single recipient in the recipients array for consistency
          recipients: [recipient],
          // Add donor information
          donorName: donation.donorName || "",
          donorEmail: donation.donorEmail || "",
          donorPhone: donation.donorPhone || "",
          quantity: 1, // Each shipment is for 1 book set
        };

        console.log(
          `Creating shipment for recipient: ${recipient.recipientName}`,
          shipmentData
        );

        // Add the shipment to Firestore
        const shipmentRef = await addDoc(
          collection(db, "shipments"),
          shipmentData
        );
        console.log(
          `Shipment created with ID: ${shipmentRef.id} for recipient: ${recipient.recipientName}`
        );

        shipmentIds.push(shipmentRef.id);
      }

      // Update the donation with the shipment IDs
      if (donation.id) {
        const donationRef = doc(db, "donations", donation.id);
        await updateDoc(donationRef, {
          shipmentIds: shipmentIds, // Store all shipment IDs
          shipmentId: shipmentIds[0], // Keep the first one for backward compatibility
          shipmentStatus: "pending",
          updatedAt: serverTimestamp(),
        });

        console.log(
          `Updated donation ${donation.id} with ${shipmentIds.length} shipment IDs`
        );
      }

      // Refresh the shipments list
      await fetchShipments();

      return shipmentIds;
    } catch (err) {
      console.error("Error creating shipment from donation:", err);
      error.value = "Failed to create shipment from donation";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    shipments,
    currentShipment,
    loading,
    error,

    // Getters
    getShipmentById,
    getShipmentsByDonationId,
    getPendingShipments,
    getCompletedShipments,

    // Actions
    fetchShipments,
    fetchShipmentsByDonationId,
    fetchShipmentById,
    createShipment,
    updateShipment,
    updateShipmentStatus,
    createShipmentFromDonation,

    // Formatters
    formatDate,
    formatStatus,
    getStatusColor,
  };
});
