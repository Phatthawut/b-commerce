<template>
  <section class="bg-white">
    <div class="container mx-auto md:p-8 font-thai">
      <h1 class="text-4xl font-bold py-4 text-black text-center">Payment</h1>
      <div class="divider divider-info w-1/2 mx-auto"></div>

      <!-- Donation Summary -->
      <div
        v-if="donationData"
        class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm my-4 text-black"
      >
        <h2 class="text-xl font-semibold mb-4">Donation Summary</h2>

        <div class="bg-gray-50 p-4 rounded mb-6">
          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">Donor:</span>
            <span class="font-medium">{{ donationData.name }}</span>
          </div>

          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">Quantity:</span>
            <span class="font-medium">{{ donationData.quantity }} sets</span>
          </div>

          <div class="flex justify-between py-2">
            <span class="text-gray-600 font-semibold">Total Amount:</span>
            <span class="font-bold text-[#7ECAD1]">{{
              donationData.formattedTotal
            }}</span>
          </div>
        </div>

        <!-- Recipients List -->
        <div
          v-if="donationData.recipients && donationData.recipients.length > 0"
        >
          <h3 class="text-lg font-semibold mb-2">Recipients</h3>
          <div
            v-for="(recipient, index) in donationData.recipients"
            :key="index"
            class="bg-gray-50 p-3 rounded mb-2"
          >
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-600">Recipient #{{ index + 1 }}:</span>
              <span class="font-medium">{{ recipient.recipientName }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-600">Category:</span>
              <span class="font-medium capitalize">{{
                recipient.recipientCategory
              }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-600">Region:</span>
              <span class="font-medium">{{ recipient.recipientRegion }}</span>
            </div>
          </div>
        </div>
        <!-- Legacy single recipient display (for backward compatibility) -->
        <div
          v-else-if="donationData.recipientName"
          class="bg-gray-50 p-4 rounded mb-2"
        >
          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">Recipient:</span>
            <span class="font-medium">{{ donationData.recipientName }}</span>
          </div>

          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">Category:</span>
            <span class="font-medium capitalize">{{
              donationData.recipientCategory
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm my-4 text-black"
      >
        <h2 class="text-xl mb-6">Payment Channels:</h2>

        <div class="space-y-4">
          <div class="flex items-center">
            <input
              type="radio"
              id="bank-transfer"
              name="payment-method"
              value="bank-transfer"
              v-model="paymentMethod"
              class="mr-3 h-5 w-5 accent-button-blue"
            />
            <label for="bank-transfer" class="text-lg">Bank Transfer</label>
          </div>
          <!-- Credit card replace flex items-center waiting for stripe api from client-->
          <div class="items-center hidden">
            <input
              type="radio"
              id="credit-card"
              name="payment-method"
              value="credit-card"
              v-model="paymentMethod"
              class="mr-3 h-5 w-5 accent-button-blue"
            />
            <label for="credit-card" class="text-lg flex items-center">
              Credit Card
              <img
                src="/images/mastercard-logo.svg"
                alt="Mastercard"
                class="h-8 ml-2"
              />
              <img src="/images/visa-logo.svg" alt="Visa" class="h-8 ml-2" />
            </label>
          </div>
          <!-- PromptPay replace flex items-center waiting for promptpay api from client-->
          <div class="items-center hidden">
            <input
              type="radio"
              id="promptpay"
              name="payment-method"
              value="promptpay"
              v-model="paymentMethod"
              class="mr-3 h-5 w-5 accent-button-blue"
            />
            <label for="promptpay" class="text-lg">PromptPay</label>
          </div>
        </div>

        <!-- Bank transfer details (shown when bank transfer is selected) -->
        <div
          v-if="paymentMethod === 'bank-transfer'"
          class="mt-6 p-4 bg-gray-50 rounded"
        >
          <h3 class="font-semibold mb-2">Bank Transfer Information</h3>
          <p>Bank: Siam Commercial Bank</p>
          <p>Account Name: Woody Prieb Knowledge Square</p>
          <p>Account Number: 123-4-56789-0</p>
          <p class="mt-4 text-sm text-gray-600">
            Please upload your payment slip below:
          </p>

          <!-- File upload with preview -->
          <div class="mt-2">
            <input
              type="file"
              id="payment-slip"
              class="hidden"
              accept="image/*"
              @change="handleFileUpload"
              ref="fileInput"
            />
            <label
              for="payment-slip"
              class="block w-full cursor-pointer text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ paymentSlip ? "Change Payment Slip" : "Select Payment Slip" }}
            </label>

            <!-- File preview -->
            <div v-if="paymentSlipPreview" class="mt-4">
              <div class="relative">
                <img
                  :src="paymentSlipPreview"
                  alt="Payment Slip Preview"
                  class="max-w-full h-auto max-h-64 mx-auto border rounded-md"
                />
                <button
                  @click="removePaymentSlip"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Remove payment slip"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-2 text-center">
                {{ paymentSlip.name }} ({{ formatFileSize(paymentSlip.size) }})
              </p>
            </div>

            <!-- Error message -->
            <p v-if="fileError" class="mt-2 text-sm text-red-600">
              {{ fileError }}
            </p>
          </div>
        </div>

        <!-- Credit card form (shown when credit card is selected) -->
        <div
          v-if="paymentMethod === 'credit-card'"
          class="mt-6 p-4 bg-gray-50 rounded"
        >
          <div v-if="stripeLoading" class="text-center py-4">
            <div class="spinner mb-2"></div>
            <p>Loading payment system...</p>
          </div>

          <div v-else>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="card-holder-name"
              >
                Cardholder Name
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="card-holder-name"
                type="text"
                placeholder="Name on card"
                v-model="cardDetails.name"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Card Information
              </label>
              <div
                id="card-element"
                class="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <!-- Stripe Card Element will be mounted here -->
              </div>
              <div v-if="stripeError" class="text-red-500 text-sm mt-2">
                {{ stripeError }}
              </div>
              <p class="text-sm text-gray-500 mt-2">
                Your card information is securely processed by Stripe. We never
                store your full card details.
              </p>
            </div>
          </div>
        </div>

        <!-- PromptPay form (shown when PromptPay is selected) -->
        <div
          v-if="paymentMethod === 'promptpay'"
          class="mt-6 p-4 bg-gray-50 rounded"
        >
          <div v-if="promptpayLoading" class="text-center py-4">
            <div class="spinner mb-2"></div>
            <p>Generating PromptPay QR code...</p>
          </div>

          <div v-else-if="promptpayError" class="text-red-500 text-sm mt-2">
            {{ promptpayError }}
          </div>

          <div v-else-if="promptpayData" class="text-center">
            <h3 class="font-semibold mb-2">Scan QR Code with Banking App</h3>

            <div class="mt-4 mb-4">
              <img
                :src="promptpayData.qrCode"
                alt="PromptPay QR Code"
                class="max-w-full h-auto max-h-64 mx-auto border rounded-md"
              />
            </div>

            <p class="text-sm text-gray-700 mb-1">
              Amount: {{ formatCurrency(donationAmount) }}
            </p>
            <p class="text-sm text-gray-700 mb-4">
              After scanning, please wait for payment confirmation.
            </p>

            <div
              v-if="promptpayPolling"
              class="flex justify-center items-center mt-3 text-sm"
            >
              <div class="spinner mr-2"></div>
              <p>Checking payment status...</p>
            </div>
          </div>

          <div v-else class="text-center">
            <button
              class="bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              @click="generatePromptPayQR"
            >
              Generate PromptPay QR Code
            </button>
          </div>
        </div>

        <div class="mt-6">
          <button
            class="w-full bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            @click="confirmPayment"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useDonationStore } from "@/stores/donationStore";
import { loadStripe } from "@stripe/stripe-js";

const router = useRouter();
const route = useRoute();
const donationStore = useDonationStore();
const paymentMethod = ref("");
const paymentSlip = ref(null);
const paymentSlipPreview = ref(null);
const fileInput = ref(null);
const fileError = ref("");
const donationData = ref(null);
const donationId = ref("");
const donationAmount = ref(0);
const cardDetails = ref({
  number: "",
  expiry: "",
  cvv: "",
  name: "",
});
const loading = ref(false);
const stripeLoading = ref(false);
const stripeError = ref("");

// PromptPay variables
const promptpayLoading = ref(false);
const promptpayError = ref("");
const promptpayData = ref(null);
const promptpayPolling = ref(false);
const pollingInterval = ref(null);

// Stripe configuration
const STRIPE_PUBLIC_KEY =
  "pk_test_51R1VDH01oGcDuhY0GoareBWdcQMmp4ai7AQbtydydt3MCL1BnvXVEEb3jxSX5QOk1apFMBmldRmtXgu3KAcMGv8f00NpBQeJZM"; // Replace with your actual Stripe public key
const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);

// Initialize Stripe on component mount
const initializeStripe = async () => {
  try {
    stripeLoading.value = true;
    stripe.value = await loadStripe(STRIPE_PUBLIC_KEY);
    elements.value = stripe.value.elements();

    // Create card element
    cardElement.value = elements.value.create("card", {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    });

    // Mount the card element to the DOM
    setTimeout(() => {
      if (document.getElementById("card-element")) {
        cardElement.value.mount("#card-element");
        cardElement.value.on("change", (event) => {
          if (event.error) {
            stripeError.value = event.error.message;
          } else {
            stripeError.value = "";
          }
        });
      }
    }, 100);

    stripeLoading.value = false;
  } catch (error) {
    console.error("Error initializing Stripe:", error);
    stripeError.value =
      "Failed to initialize payment system. Please try again later.";
    stripeLoading.value = false;
  }
};

// Load donation data from localStorage or URL query parameter on component mount
onMounted(async () => {
  // Check if we have a donationId in the URL query parameters
  const queryDonationId = route.query.donationId;

  if (queryDonationId) {
    // We have a donationId in the URL, fetch the donation from Firestore
    loading.value = true;
    try {
      await donationStore.fetchDonationById(queryDonationId);

      if (donationStore.currentDonation) {
        // We found the donation, use it
        donationId.value = queryDonationId;

        // Check if the donation has already been paid for
        const paymentStatus = donationStore.currentDonation.paymentStatus;
        const donationStatus = donationStore.currentDonation.status;

        // If payment is already completed or processing, redirect to thank you page
        if (
          (paymentStatus === "completed" || paymentStatus === "processing") &&
          (donationStatus === "completed" ||
            donationStatus === "processing" ||
            donationStatus === "received")
        ) {
          console.log(
            "Payment already processed. Redirecting to thank you page."
          );
          // Store the donationId in localStorage for the thank you page
          localStorage.setItem("donationId", donationId.value);
          // Redirect to thank you page
          router.push("/thank-you");
          return;
        }

        // Create a simplified version of the donation data for the UI
        donationData.value = {
          name: donationStore.currentDonation.donorName,
          quantity: donationStore.currentDonation.quantity || 1,
          formattedTotal: formatCurrency(donationStore.currentDonation.amount),
          recipients: donationStore.currentDonation.recipients || [],
        };

        // Pre-fill cardholder name if donor name is available
        if (donationStore.currentDonation.donorName) {
          cardDetails.value.name = donationStore.currentDonation.donorName;
        }

        // Initialize Stripe if needed
        if (!stripe.value) {
          initializeStripe();
        }
      } else {
        // Donation not found, show error
        alert("Donation not found. Please try again.");
        router.push("/donation");
      }
    } catch (error) {
      console.error("Error fetching donation:", error);
      alert("Error loading donation data. Please try again.");
      router.push("/donation");
    } finally {
      loading.value = false;
    }
  } else {
    // No donationId in URL, check localStorage
    const storedDonation = localStorage.getItem("pendingDonation");
    const storedDonationId = localStorage.getItem("pendingDonationId");
    const completedDonationId = localStorage.getItem("donationId");

    // If there's a completed donation ID, redirect to thank you page
    if (completedDonationId) {
      console.log("Completed donation found. Redirecting to thank you page.");
      router.push("/thank-you");
      return;
    }

    if (storedDonation && storedDonationId) {
      try {
        // First, set the local data from localStorage
        donationData.value = JSON.parse(storedDonation);
        donationId.value = storedDonationId;

        // Pre-fill cardholder name if donor name is available
        if (donationData.value && donationData.value.name) {
          cardDetails.value.name = donationData.value.name;
        }

        // Also fetch the donation from Firestore to ensure we have complete data
        loading.value = true;
        await donationStore.fetchDonationById(storedDonationId);

        if (!donationStore.currentDonation) {
          console.error(
            "Could not find donation in Firestore:",
            storedDonationId
          );
          alert("Error loading donation data. Please try again.");
          router.push("/donation");
          return;
        }

        console.log(
          "Fetched donation from Firestore:",
          donationStore.currentDonation
        );

        // Initialize Stripe
        if (!stripe.value) {
          initializeStripe();
        }
      } catch (error) {
        console.error("Error loading donation data:", error);
        alert("Error loading donation data. Please try again.");
        router.push("/donation");
      } finally {
        loading.value = false;
      }
    } else {
      // No donation data found, redirect to donation page
      alert("No donation data found. Please complete the donation form first.");
      router.push("/donation");
    }
  }

  // Initialize Stripe when payment method is set to credit card
  watch(paymentMethod, (newValue) => {
    if (newValue === "credit-card") {
      initializeStripe();
    }
  });
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/heic",
    "image/heif",
    "application/pdf",
  ];
  if (!validTypes.includes(file.type)) {
    fileError.value = "Please upload an image file (JPEG, PNG, GIF) or PDF";
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    fileError.value = "File size should not exceed 5MB";
    return;
  }

  // Clear previous error
  fileError.value = "";

  // Store the file
  paymentSlip.value = file;

  // Create preview for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      paymentSlipPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // For PDF files, show a generic icon
    paymentSlipPreview.value = "/images/pdf-icon.png";
  }
};

const removePaymentSlip = () => {
  paymentSlip.value = null;
  paymentSlipPreview.value = null;
  fileError.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

const uploadPaymentSlip = async (file, donationId) => {
  if (!file) return null;

  try {
    const storage = getStorage();
    const fileExtension = file.name.split(".").pop();
    const fileName = `payment_slips/${donationId}_${Date.now()}.${fileExtension}`;
    const fileRef = storageRef(storage, fileName);

    // Upload the file
    await uploadBytes(fileRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading payment slip:", error);
    throw new Error("Failed to upload payment slip");
  }
};

// Process Stripe payment
const processStripePayment = async () => {
  if (!stripe.value || !elements.value) {
    stripeError.value =
      "Payment system not initialized. Please refresh and try again.";
    return false;
  }

  loading.value = true;

  try {
    // Get the donation amount from the store or from local data
    let donationAmount;

    if (donationStore.currentDonation && donationStore.currentDonation.amount) {
      // Use amount from Firestore
      donationAmount = donationStore.currentDonation.amount;
      console.log("Using donation amount from Firestore:", donationAmount);
    } else if (donationData.value && donationData.value.rawTotal) {
      // Try to get amount from local data
      donationAmount = donationData.value.rawTotal;
      console.log(
        "Using donation amount from local data (rawTotal):",
        donationAmount
      );
    } else if (donationData.value && donationData.value.formattedTotal) {
      // Try to parse from formatted total
      try {
        const formattedTotal = donationData.value.formattedTotal;
        // Extract numeric value from formatted string (e.g., "1,500 THB" -> 1500)
        const numericValue = formattedTotal.replace(/[^0-9]/g, "");
        donationAmount = parseInt(numericValue);
        console.log(
          "Parsed donation amount from formatted total:",
          donationAmount
        );
      } catch (parseError) {
        console.error("Error parsing amount from formatted total:", parseError);
      }
    }

    // If we still don't have an amount, try to calculate it from quantity
    if (!donationAmount && donationData.value && donationData.value.quantity) {
      const quantity = parseInt(donationData.value.quantity);
      if (!isNaN(quantity) && quantity > 0) {
        donationAmount = quantity * 1500; // Using the standard price per set
        console.log(
          "Calculated donation amount from quantity:",
          donationAmount
        );
      }
    }

    if (!donationAmount) {
      throw new Error(
        "Donation amount not found. Please try again or contact support."
      );
    }

    // Step 1: Create a PaymentIntent on the server
    const response = await fetch(
      "http://localhost:3000/api/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          currency: "thb", // Thai Baht
          donationId: donationId.value,
          metadata: {
            donorName:
              donationData.value?.name ||
              (donationStore.currentDonation
                ? donationStore.currentDonation.donorName
                : ""),
            donorEmail:
              donationData.value?.email ||
              (donationStore.currentDonation
                ? donationStore.currentDonation.donorEmail
                : ""),
            recipientCount:
              donationStore.currentDonation &&
              donationStore.currentDonation.recipients
                ? donationStore.currentDonation.recipients.length
                : donationData.value && donationData.value.recipients
                ? donationData.value.recipients.length
                : 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create payment intent");
    }

    const { clientSecret, paymentIntentId } = await response.json();

    // Step 2: Confirm the PaymentIntent with the card element
    const { error: confirmError } = await stripe.value.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: cardDetails.value.name,
            email:
              donationData.value?.email ||
              donationStore.currentDonation.donorEmail ||
              "",
          },
        },
      }
    );

    if (confirmError) {
      throw new Error(confirmError.message);
    }

    // Payment succeeded!
    return {
      success: true,
      paymentIntentId: paymentIntentId,
      // The card details will be updated by the webhook
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    stripeError.value =
      error.message || "An unexpected error occurred. Please try again.";
    loading.value = false;
    return false;
  }
};

// Function to generate PromptPay QR code
const generatePromptPayQR = async () => {
  if (!donationId.value) {
    promptpayError.value = "Donation ID is missing. Please try again.";
    return;
  }

  promptpayLoading.value = true;
  promptpayError.value = "";

  try {
    // Calculate the donation amount if not already set
    if (!donationAmount.value) {
      if (
        donationStore.currentDonation &&
        donationStore.currentDonation.amount
      ) {
        donationAmount.value = donationStore.currentDonation.amount;
      } else if (donationData.value && donationData.value.rawTotal) {
        donationAmount.value = donationData.value.rawTotal;
      } else if (donationData.value && donationData.value.formattedTotal) {
        // Extract numeric value from formatted total (e.g., "1,500 THB" -> 1500)
        const formattedTotal = donationData.value.formattedTotal;
        const numericValue = formattedTotal.replace(/[^0-9]/g, "");
        donationAmount.value = parseInt(numericValue);
      } else if (donationData.value && donationData.value.quantity) {
        const quantity = parseInt(donationData.value.quantity);
        donationAmount.value = quantity * 2000; // Using the standard price per set
      }
    }

    // Call backend to create PromptPay payment intent
    const response = await fetch(
      "http://localhost:3000/api/create-promptpay-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount.value,
          currency: "thb",
          donationId: donationId.value,
          metadata: {
            donorName:
              donationData.value?.name ||
              (donationStore.currentDonation
                ? donationStore.currentDonation.donorName
                : ""),
            donorEmail:
              donationData.value?.email ||
              (donationStore.currentDonation
                ? donationStore.currentDonation.donorEmail
                : ""),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create PromptPay payment");
    }

    const { clientSecret, paymentIntentId } = await response.json();

    // Mock QR code for now - in production, your backend would generate a real PromptPay QR
    // This is a placeholder. In a real implementation, the QR code would be generated by your backend
    // and returned in the response.
    promptpayData.value = {
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PromptPay:${donationAmount.value}THB:DonationID:${donationId.value}`,
      paymentIntentId: paymentIntentId,
    };

    // Start polling for payment status
    startPollingPaymentStatus(paymentIntentId);
  } catch (error) {
    console.error("Error generating PromptPay QR:", error);
    promptpayError.value =
      error.message ||
      "Failed to generate PromptPay QR code. Please try again.";
  } finally {
    promptpayLoading.value = false;
  }
};

// Function to poll payment status
const startPollingPaymentStatus = (paymentIntentId) => {
  // Clear any existing polling
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }

  promptpayPolling.value = true;

  // Poll every 3 seconds
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/check-payment-status?paymentIntentId=${paymentIntentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();
      console.log(`PromptPay payment status: ${data.status}`);

      // Check payment status
      if (data.status === "succeeded") {
        // Payment successful
        clearInterval(pollingInterval.value);
        promptpayPolling.value = false;

        // Update donation with payment information
        await donationStore.updateDonationPayment(donationId.value, {
          paymentMethod: "promptpay",
          paymentStatus: "completed",
          stripePaymentIntentId: paymentIntentId,
          paymentDate: serverTimestamp(),
          status: "completed",
        });

        // Redirect to thank you page
        localStorage.removeItem("pendingDonation");
        localStorage.removeItem("pendingDonationId");
        localStorage.setItem("donationId", donationId.value);
        router.push("/thank-you");
      } else if (
        ["canceled", "failed", "requires_payment_method"].includes(data.status)
      ) {
        // Payment failed or canceled
        clearInterval(pollingInterval.value);
        promptpayPolling.value = false;
        promptpayError.value =
          "Payment failed or was canceled. Please try again.";
      }
      // For other statuses (like processing, requires_action, etc.), continue polling
    } catch (error) {
      console.error("Error checking payment status:", error);
      // Don't stop polling on network errors, just log them
    }
  }, 5000);

  // Stop polling after 10 minutes (600000 ms) to prevent indefinite polling
  setTimeout(() => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      promptpayPolling.value = false;

      // Only show error if we're still on this page and haven't received a successful payment
      if (promptpayPolling.value) {
        promptpayError.value =
          "Payment timeout. Please check your banking app to see if the payment was processed.";
      }
    }
  }, 600000);
};

// Modify confirmPayment to handle PromptPay
const confirmPayment = async () => {
  if (!paymentMethod.value) {
    alert("Please select a payment method");
    return;
  }

  if (paymentMethod.value === "bank-transfer" && !paymentSlip.value) {
    fileError.value = "Please upload your payment slip";
    return;
  }

  // Set loading state
  loading.value = true;

  try {
    // Update the existing donation record with payment details
    if (!donationId.value) {
      throw new Error("Donation ID not found");
    }

    // Prepare payment data
    const paymentData = {
      paymentMethod: paymentMethod.value,
      paymentStatus: "pending", // Will be updated by webhook for credit cards
      paymentDate: serverTimestamp(),
      status: "pending", // Will be updated by webhook for credit cards
    };

    if (paymentMethod.value === "credit-card") {
      // Process payment with Stripe
      const paymentResult = await processStripePayment();

      if (!paymentResult) {
        return; // Error already handled in processStripePayment
      }

      // Update payment data with Stripe payment intent ID
      paymentData.stripePaymentIntentId = paymentResult.paymentIntentId;

      // For credit card payments, we can immediately create a shipment since payment is verified
      paymentData.paymentStatus = "completed";
      paymentData.status = "completed";
    } else if (paymentMethod.value === "bank-transfer") {
      // Upload payment slip
      if (paymentSlip.value) {
        try {
          const slipUrl = await uploadPaymentSlip(
            paymentSlip.value,
            donationId.value
          );
          paymentData.paymentSlipUrl = slipUrl;
        } catch (error) {
          console.error("Error uploading payment slip:", error);
          alert("Failed to upload payment slip. Please try again.");
          loading.value = false;
          return;
        }
      }
    } else if (paymentMethod.value === "promptpay") {
      // For PromptPay, we don't need to do anything special here
      // Just generate the QR code if not already done
      if (!promptpayData.value) {
        loading.value = false;
        await generatePromptPayQR();
        return;
      }
      return; // Don't proceed with the rest of the function
    }

    // Update donation with payment information
    const success = await donationStore.updateDonationPayment(
      donationId.value,
      paymentData
    );

    if (!success) {
      throw new Error("Failed to update donation payment information");
    }

    // Create a shipment for the donation if payment is completed (credit card)
    // or if it's a bank transfer (admin will verify later)
    try {
      // Import the shipment store
      const { useShipmentStore } = await import("@/stores/shipmentStore");
      const shipmentStore = useShipmentStore();

      // Fetch the latest donation data to ensure we have all the information
      await donationStore.fetchDonationById(donationId.value);

      if (donationStore.currentDonation) {
        console.log(
          "Creating shipment for donation:",
          donationStore.currentDonation
        );

        // Make sure we have the recipients data
        if (
          !donationStore.currentDonation.recipients ||
          donationStore.currentDonation.recipients.length === 0
        ) {
          console.log(
            "No recipients array in donation, creating one from available data"
          );

          // If we have recipient data in the donation form, create a recipients array
          if (
            donationData.value &&
            donationData.value.recipients &&
            donationData.value.recipients.length > 0
          ) {
            console.log(
              "Using recipients from donationData:",
              donationData.value.recipients
            );
            donationStore.currentDonation.recipients =
              donationData.value.recipients.map((recipient) => ({
                recipientName: recipient.recipientName || "",
                address: recipient.address || "",
                phone: recipient.phone || "",
                recipientCategory: recipient.recipientCategory || "individual",
                recipientRegion: recipient.recipientRegion || "",
              }));
          } else if (donationData.value && donationData.value.recipientName) {
            // Create a recipients array from the single recipient
            console.log(
              "Creating recipients array from single recipient in donationData"
            );
            donationStore.currentDonation.recipients = [
              {
                recipientName: donationData.value.recipientName || "",
                address: donationData.value.recipientAddress || "",
                phone: donationData.value.recipientPhone || "",
                recipientCategory:
                  donationData.value.recipientCategory || "individual",
                recipientRegion: donationData.value.recipientRegion || "",
              },
            ];
          } else if (donationStore.currentDonation.recipientName) {
            // Create a recipients array from direct properties in the donation
            console.log(
              "Creating recipients array from direct properties in donation"
            );
            donationStore.currentDonation.recipients = [
              {
                recipientName:
                  donationStore.currentDonation.recipientName || "",
                address: donationStore.currentDonation.recipientAddress || "",
                phone: donationStore.currentDonation.recipientPhone || "",
                recipientCategory:
                  donationStore.currentDonation.recipientCategory ||
                  "individual",
                recipientRegion:
                  donationStore.currentDonation.recipientRegion || "",
              },
            ];
          } else {
            // Last resort: create a recipient using donor information
            console.log("Creating recipients array from donor information");
            donationStore.currentDonation.recipients = [
              {
                recipientName: donationStore.currentDonation.donorName || "",
                address: donationStore.currentDonation.donorAddress || "",
                phone: donationStore.currentDonation.donorPhone || "",
                recipientCategory: "individual",
                recipientRegion: "",
              },
            ];
          }

          console.log(
            "Created recipients array:",
            donationStore.currentDonation.recipients
          );
        } else {
          console.log(
            "Donation already has recipients:",
            donationStore.currentDonation.recipients
          );
        }

        // Create a shipment from the donation
        const shipmentResult = await shipmentStore.createShipmentFromDonation(
          donationStore.currentDonation
        );

        if (shipmentResult) {
          // Handle both single ID and array of IDs
          const shipmentIds = Array.isArray(shipmentResult)
            ? shipmentResult
            : [shipmentResult];
          console.log(
            "Shipment(s) created successfully with IDs:",
            shipmentIds
          );
        } else {
          console.error(
            "Failed to create shipment for donation:",
            donationId.value
          );
        }
      }
    } catch (shipmentError) {
      console.error("Error creating shipment:", shipmentError);
      // Don't throw error here, as we still want to proceed to thank you page
      // even if shipment creation fails
    }

    // Clear localStorage after successful payment
    localStorage.removeItem("pendingDonation");
    localStorage.removeItem("pendingDonationId");

    // Set the donationId in localStorage for the Thank You page
    localStorage.setItem("donationId", donationId.value);

    // Show success message
    if (paymentMethod.value === "credit-card") {
      alert(
        "Thank you for your donation! Your payment has been processed successfully."
      );
    } else {
      alert(
        "Thank you for your donation! Your payment is pending verification."
      );
    }

    // Redirect to a thank you page
    router.push("/thank-you");
  } catch (error) {
    console.error("Error updating donation payment:", error);
    alert("There was an error processing your donation. Please try again.");
  } finally {
    loading.value = false;
  }
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount || 0);
};

// Clear polling interval when component is unmounted
onUnmounted(() => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }
});
</script>

<style scoped>
/* Vue template styles */
/* Custom styling for radio buttons */
input[type="radio"] {
  cursor: pointer;
}

/* Accent color for radio buttons */
input[type="radio"]:checked {
  background-color: #7ecad1;
}

/* Button styling */
button {
  transition: background-color 0.3s ease;
}

/* File upload styling */
.file-upload-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.file-upload-container input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Stripe element styles */
#card-element {
  background-color: white;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  transition: box-shadow 150ms ease;
}

#card-element:focus {
  box-shadow: 0 0 0 2px #7ecad1;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid #7ecad1;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Add any additional custom styles here */
</style>
