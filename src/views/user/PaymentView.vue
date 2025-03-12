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
            <span class="text-gray-600">Recipient:</span>
            <span class="font-medium">{{ donationData.recipientName }}</span>
          </div>

          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">Category:</span>
            <span class="font-medium capitalize">{{
              donationData.recipientCategory
            }}</span>
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

          <div class="flex items-center">
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
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
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
const donationStore = useDonationStore();
const paymentMethod = ref("");
const paymentSlip = ref(null);
const paymentSlipPreview = ref(null);
const fileInput = ref(null);
const fileError = ref("");
const donationData = ref(null);
const donationId = ref("");
const cardDetails = ref({
  number: "",
  expiry: "",
  cvv: "",
  name: "",
});
const loading = ref(false);
const stripeLoading = ref(false);
const stripeError = ref("");

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

// Load donation data from localStorage on component mount
onMounted(() => {
  const storedDonation = localStorage.getItem("pendingDonation");
  const storedDonationId = localStorage.getItem("pendingDonationId");

  if (storedDonation && storedDonationId) {
    try {
      donationData.value = JSON.parse(storedDonation);
      donationId.value = storedDonationId;

      // Pre-fill cardholder name if donor name is available
      if (donationData.value && donationData.value.name) {
        cardDetails.value.name = donationData.value.name;
      }
    } catch (error) {
      console.error("Error parsing donation data:", error);
    }
  } else {
    // No donation data found, redirect back to donation form
    console.warn("No donation data found. Redirecting to donation form.");
    router.push("/donation");
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
    // Step 1: Create a PaymentIntent on the server
    const response = await fetch(
      "http://localhost:3000/api/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationData.value.amount,
          currency: "thb", // Thai Baht
          donationId: donationId.value,
          metadata: {
            donorName: donationData.value.name,
            donorEmail: donationData.value.email,
            recipientName: donationData.value.recipientName,
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
            email: donationData.value.email || "",
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
        // Payment failed, error is already set
        loading.value = false;
        return;
      }

      // For credit card payments, the webhook will update the status
      // We just need to store the payment intent ID
      paymentData.stripePaymentIntentId = paymentResult.paymentIntentId;
    } else if (paymentSlip.value) {
      // Upload payment slip for bank transfers
      try {
        const slipURL = await uploadPaymentSlip(
          paymentSlip.value,
          donationId.value
        );
        if (slipURL) {
          paymentData.paymentSlipURL = slipURL;
        }
      } catch (uploadError) {
        console.error("Error uploading payment slip:", uploadError);
        alert(
          "There was an error uploading your payment slip. Please try again."
        );
        loading.value = false;
        return;
      }
    }

    // Use the donation store to update payment information
    const success = await donationStore.updateDonationPayment(
      donationId.value,
      paymentData
    );

    if (!success) {
      throw new Error("Failed to update payment information");
    }

    // Store the donation ID in localStorage for reference on the thank you page
    localStorage.setItem("donationId", donationId.value);

    // Clear the pending donation from localStorage
    localStorage.removeItem("pendingDonation");
    localStorage.removeItem("pendingDonationId");

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
