<template>
  <section class="bg-white">
    <div class="container mx-auto md:p-8 font-thai">
      <h1 class="text-4xl font-bold py-4 text-black text-center">
        {{ $t("pages.payment.title") }}
      </h1>
      <div class="divider divider-info w-1/2 mx-auto"></div>

      <!-- Donation Summary -->
      <div
        v-if="donationData"
        class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm my-4 text-black"
      >
        <h2 class="text-xl font-semibold mb-4">
          {{ $t("pages.payment.donationSummary.title") }}
        </h2>

        <div class="bg-gray-50 p-4 rounded mb-6">
          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">{{
              $t("pages.payment.donationSummary.donor")
            }}</span>
            <span class="font-medium">{{ donationData.name }}</span>
          </div>

          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">{{
              $t("pages.payment.donationSummary.quantity")
            }}</span>
            <span class="font-medium"
              >{{ donationData.quantity }}
              {{ $t("pages.thankYou.donationDetails.sets") }}</span
            >
          </div>

          <div class="flex justify-between py-2">
            <span class="text-gray-600 font-semibold">{{
              $t("pages.payment.donationSummary.totalAmount")
            }}</span>
            <span class="font-bold text-[#7ECAD1]">{{
              donationData.formattedTotal
            }}</span>
          </div>
        </div>

        <!-- Recipients List -->
        <div
          v-if="donationData.recipients && donationData.recipients.length > 0"
        >
          <h3 class="text-lg font-semibold mb-2">
            {{ $t("pages.payment.donationSummary.recipients") }}
          </h3>
          <div
            v-for="(recipient, index) in donationData.recipients"
            :key="index"
            class="bg-gray-50 p-3 rounded mb-2"
          >
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-600">{{
                $t("pages.payment.donationSummary.recipientNumber", {
                  number: index + 1,
                })
              }}</span>
              <span class="font-medium">{{ recipient.recipientName }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-200">
              <span class="text-gray-600">{{
                $t("pages.payment.donationSummary.category")
              }}</span>
              <span class="font-medium capitalize">{{
                recipient.recipientCategory
              }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-600">{{
                $t("pages.payment.donationSummary.region")
              }}</span>
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
            <span class="text-gray-600">{{
              $t("pages.payment.donationSummary.recipient")
            }}</span>
            <span class="font-medium">{{ donationData.recipientName }}</span>
          </div>

          <div class="flex justify-between py-2 border-b border-gray-200">
            <span class="text-gray-600">{{
              $t("pages.payment.donationSummary.category")
            }}</span>
            <span class="font-medium capitalize">{{
              donationData.recipientCategory
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm my-4 text-black"
      >
        <h2 class="text-xl mb-6">
          {{ $t("pages.payment.paymentMethod.title") }}
        </h2>

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
            <label for="bank-transfer" class="text-lg">{{
              $t("pages.payment.paymentMethod.bankTransfer")
            }}</label>
          </div>
          <!-- Stripe Payment (Credit Card + PromptPay) - DISABLED FOR BANK TRANSFER ONLY VERSION -->
          <!-- 
          <div class="flex items-center">
            <input
              type="radio"
              id="stripe-payment"
              name="payment-method"
              value="stripe-payment"
              v-model="paymentMethod"
              class="mr-3 h-5 w-5 accent-button-blue"
            />
            <label for="stripe-payment" class="text-lg flex items-center">
              {{ $t('pages.payment.paymentMethod.creditCard') }}
            </label>
          </div>
          -->
        </div>

        <!-- Bank transfer details (shown when bank transfer is selected) -->
        <div
          v-if="paymentMethod === 'bank-transfer'"
          class="mt-6 p-4 bg-gray-50 rounded"
        >
          <h3 class="font-semibold mb-2">
            {{ $t("pages.payment.bankTransfer.title") }}
          </h3>
          <p>{{ $t("pages.payment.bankTransfer.bank") }} ธนาคารกรุงเทพ</p>
          <p>
            {{ $t("pages.payment.bankTransfer.accountName") }} นายวุฒิพงษ์
            เพรียบจริยวัฒน์
          </p>
          <p>
            {{ $t("pages.payment.bankTransfer.accountNumber") }} 101-957220-3
          </p>
          <p>{{ $t("pages.payment.bankTransfer.branch") }} สำนักงานใหญ่สีลม</p>
          <p class="mt-4 text-sm text-gray-600">
            {{ $t("pages.payment.bankTransfer.uploadInstruction") }}
          </p>

          <!-- File upload with preview -->
          <div class="mt-2">
            <input
              type="file"
              id="payment-slip"
              class="hidden"
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              @change="handleFileUpload"
              ref="fileInput"
            />
            <label
              for="payment-slip"
              class="block w-full cursor-pointer text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {{
                paymentSlip
                  ? $t("pages.payment.bankTransfer.changeSlip")
                  : $t("pages.payment.bankTransfer.selectSlip")
              }}
            </label>

            <!-- File preview -->
            <div v-if="paymentSlipPreview" class="mt-4">
              <div class="relative">
                <img
                  :src="paymentSlipPreview"
                  :alt="$t('pages.payment.bankTransfer.selectSlip')"
                  class="max-w-full h-auto max-h-64 mx-auto border rounded-md"
                />
                <button
                  @click="removePaymentSlip"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  :title="$t('pages.payment.bankTransfer.removeSlip')"
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
          v-if="paymentMethod === 'stripe-payment'"
          class="mt-6 p-4 bg-gray-50 rounded"
        >
          <div v-if="stripeLoading" class="text-center py-4">
            <div class="spinner mb-2"></div>
            <p>{{ $t("pages.payment.creditCard.loadingPayment") }}</p>
          </div>

          <div v-else>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="card-holder-name"
              >
                {{ $t("pages.payment.creditCard.cardholderName") }}
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="card-holder-name"
                type="text"
                :placeholder="$t('pages.payment.creditCard.nameOnCard')"
                v-model="cardDetails.name"
              />
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                {{ $t("pages.payment.creditCard.cardInformation") }}
              </label>
              <div
                id="payment-element"
                class="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <!-- Stripe Payment Element will be mounted here -->
              </div>
              <div v-if="stripeError" class="text-red-500 text-sm mt-2">
                {{ stripeError }}
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {{ $t("pages.payment.creditCard.securityNotice") }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button
            class="w-full bg-[#7ECAD1] hover:bg-[#6BB8BF] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            @click="confirmPayment"
          >
            {{ $t("pages.payment.buttons.confirm") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useDonationStore } from "@/stores/donationStore";
import { useShipmentStore } from "@/stores/shipmentStore";
import { loadStripe } from "@stripe/stripe-js";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const donationStore = useDonationStore();
const shipmentStore = useShipmentStore();
const paymentMethod = ref("bank-transfer"); // Auto-select bank transfer for old server deployment
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

// Stripe configuration
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  "pk_test_51R1VDH01oGcDuhY0GoareBWdcQMmp4ai7AQbtydydt3MCL1BnvXVEEb3jxSX5QOk1apFMBmldRmtXgu3KAcMGv8f00NpBQeJZM"; // Fallback to test key
const stripe = ref(null);
const elements = ref(null);
const paymentElement = ref(null);

// Initialize Stripe on component mount
const initializeStripe = async () => {
  try {
    stripeLoading.value = true;
    stripe.value = await loadStripe(STRIPE_PUBLIC_KEY);

    // Calculate the donation amount
    let donationAmount;
    if (donationStore.currentDonation && donationStore.currentDonation.amount) {
      donationAmount = donationStore.currentDonation.amount;
    } else if (donationData.value && donationData.value.rawTotal) {
      donationAmount = donationData.value.rawTotal;
    } else if (donationData.value && donationData.value.formattedTotal) {
      const formattedTotal = donationData.value.formattedTotal;
      const numericValue = formattedTotal.replace(/[^0-9]/g, "");
      donationAmount = parseInt(numericValue);
    } else if (donationData.value && donationData.value.quantity) {
      const quantity = parseInt(donationData.value.quantity);
      donationAmount = quantity * 1500;
    } else {
      donationAmount = 1500; // Default amount
    }

    // Create Payment Intent on the server first
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL ||
        "https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app/api"
      }/create-payment-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          currency: "thb", // Thai Baht - this enables PromptPay automatically
          donationId: donationId.value,
          automatic_payment_methods: {
            enabled: true, // This enables PromptPay and other local payment methods
          },
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
      throw new Error(errorData.error || "Failed to create payment intent");
    }

    const { clientSecret } = await response.json();

    // Create Elements instance with the client secret
    elements.value = stripe.value.elements({
      clientSecret: clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#7ECAD1",
        },
      },
    });

    // Create payment element (automatically includes PromptPay for THB)
    paymentElement.value = elements.value.create("payment", {
      layout: "tabs",
    });

    // Mount the payment element to the DOM
    setTimeout(() => {
      if (document.getElementById("payment-element")) {
        paymentElement.value.mount("#payment-element");
        paymentElement.value.on("change", (event) => {
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

        // Initialize Stripe if needed - DISABLED FOR BANK TRANSFER ONLY VERSION
        // if (!stripe.value) {
        //   initializeStripe();
        // }
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

        // Initialize Stripe - DISABLED FOR BANK TRANSFER ONLY VERSION
        // if (!stripe.value) {
        //   initializeStripe();
        // }
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

  // Initialize Stripe when payment method is set to credit card - DISABLED FOR BANK TRANSFER ONLY VERSION
  // watch(paymentMethod, (newValue) => {
  //   if (newValue === "stripe-payment") {
  //     initializeStripe();
  //   }
  // });
});

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Reset any previous error
  fileError.value = "";

  // Validate file type - only JPG and PNG allowed (matching Storage rules)
  const validTypes = ["image/jpeg", "image/png"];

  if (!validTypes.includes(file.type)) {
    fileError.value = t("pages.payment.fileUpload.errorInvalidType");
    return;
  }

  // Additional file validation - check file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = [".jpg", ".jpeg", ".png"];
  const hasValidExtension = validExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    fileError.value = t("pages.payment.fileUpload.errorInvalidExtension");
    return;
  }

  // Validate file size (max 1MB for initial upload)
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    fileError.value = t("pages.payment.fileUpload.errorFileSize");
    return;
  }

  // For images, perform additional security checks using FileReader
  if (file.type.startsWith("image/")) {
    try {
      await validateImageContent(file);
    } catch (error) {
      fileError.value =
        error.message || t("pages.payment.fileUpload.errorInvalidImage");
      return;
    }
  }

  // Store the original file
  let fileToUpload = file;

  // Compress image if it's over 250KB and is an image
  if (file.type.startsWith("image/") && file.size > 250 * 1024) {
    try {
      fileError.value = t("pages.payment.fileUpload.compressing");
      fileToUpload = await compressImage(file);
      fileError.value = t("pages.payment.fileUpload.compressed", {
        originalSize: formatFileSize(file.size),
        newSize: formatFileSize(fileToUpload.size),
      });
      setTimeout(() => {
        fileError.value = "";
      }, 3000);
    } catch (error) {
      console.error("Error compressing image:", error);
      // If compression fails, use the original file but log the error
      fileToUpload = file;
    }
  }

  // Store the file (original or compressed)
  paymentSlip.value = fileToUpload;

  // Create preview for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      paymentSlipPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Function to validate image content (checks if file is actually an image)
const validateImageContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;

      // Check for image file signatures (magic numbers)
      const byteArray = new Uint8Array(arrayBuffer.slice(0, 4));

      // JPEG signature: FF D8 FF
      const isJpeg =
        byteArray[0] === 0xff && byteArray[1] === 0xd8 && byteArray[2] === 0xff;

      // PNG signature: 89 50 4E 47
      const isPng =
        byteArray[0] === 0x89 &&
        byteArray[1] === 0x50 &&
        byteArray[2] === 0x4e &&
        byteArray[3] === 0x47;

      if (isJpeg || isPng) {
        resolve();
      } else {
        reject(
          new Error(
            "The file appears to be invalid or corrupted. Only JPG and PNG files are allowed."
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };

    // Read the first few bytes to check the file signature
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

// Function to compress image
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    // Create an image element to load the file
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Create canvas for image manipulation
      const canvas = document.createElement("canvas");

      // Calculate dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      // Max dimensions - adjust as needed for your use case
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas with new dimensions
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with quality adjustment
      // Start with 0.7 quality for JPEG
      const quality = 0.7;

      // Use the original file type, or default to JPEG
      let outputType = file.type;
      if (!outputType.startsWith("image/")) {
        outputType = "image/jpeg";
      }

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"));
            return;
          }

          // Create a new file from the blob
          const compressedFile = new File([blob], file.name, {
            type: outputType,
            lastModified: new Date().getTime(),
          });

          // Clean up
          URL.revokeObjectURL(img.src);

          // Resolve with the compressed file
          resolve(compressedFile);
        },
        outputType,
        quality
      );
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(img.src);
      reject(error);
    };
  });
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

    // Sanitize file name to prevent path traversal attacks
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileExtension = sanitizedName.split(".").pop().toLowerCase();

    // Generate a unique filename with timestamp and random string
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileName = `donations/${donationId}/payment_slip_${Date.now()}_${randomString}.${fileExtension}`;

    const fileRef = storageRef(storage, fileName);

    // For files still over 250KB after compression, show a warning
    if (file.size > 250 * 1024) {
      console.warn(
        `Uploading large file (${formatFileSize(
          file.size
        )}). This may affect performance.`
      );
    }

    // Set appropriate metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: donationData.value?.name || "anonymous user",
        donationId: donationId,
        originalFilename: sanitizedName,
        uploadDate: new Date().toISOString(),
      },
    };

    // Upload the file with metadata
    await uploadBytes(fileRef, file, metadata);

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
    // Confirm payment with the Payment Element
    const { error: confirmError } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you?donationId=${donationId.value}`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      throw new Error(confirmError.message);
    }

    // Payment succeeded!
    return {
      success: true,
      // The payment details will be handled by the webhook
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    stripeError.value =
      error.message || "An unexpected error occurred. Please try again.";
    loading.value = false;
    return false;
  }
};

// Modify confirmPayment to handle PromptPay
const confirmPayment = async () => {
  if (!paymentMethod.value) {
    alert(t("pages.payment.messages.selectPaymentMethod"));
    return;
  }

  if (paymentMethod.value === "bank-transfer" && !paymentSlip.value) {
    fileError.value = t("pages.payment.messages.uploadPaymentSlip");
    return;
  }

  // Set loading state
  loading.value = true;

  try {
    // Update the existing donation record with payment details
    if (!donationId.value) {
      throw new Error(t("pages.payment.messages.donationIdNotFound"));
    }

    // Prepare payment data
    const paymentData = {
      paymentMethod: paymentMethod.value,
      paymentStatus: "pending", // Will be updated by webhook for Stripe payments
      paymentDate: serverTimestamp(),
      status: "pending", // Will be updated by webhook for Stripe payments
    };

    if (paymentMethod.value === "stripe-payment") {
      // Process payment with Stripe (includes PromptPay, Credit Cards, etc.)
      const paymentResult = await processStripePayment();

      if (!paymentResult) {
        return; // Error already handled in processStripePayment
      }

      // For Stripe payments, we can immediately create a shipment since payment is verified
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
          alert(t("pages.payment.messages.errorUploadSlip"));
          loading.value = false;
          return;
        }
      }
    }

    // Update donation with payment information
    const success = await donationStore.updateDonationPayment(
      donationId.value,
      paymentData
    );

    if (!success) {
      throw new Error(t("pages.payment.messages.errorUpdatePayment"));
    }

    // Create shipment only if payment is confirmed/completed
    if (paymentData.paymentStatus === "completed") {
      try {
        console.log("Payment confirmed, creating shipment...");

        // Ensure we have recipient information
        if (
          !donationStore.currentDonation.recipients ||
          donationStore.currentDonation.recipients.length === 0
        ) {
          console.log("No recipients found, creating from donation data");

          // Create recipients array from donationData
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
      } catch (shipmentError) {
        console.error("Error creating shipment:", shipmentError);
        // Don't throw error here, as we still want to proceed to thank you page
        // even if shipment creation fails
      }
    } else {
      console.log(
        "Payment not yet confirmed, shipment will be created after admin approval"
      );
    }

    // Clear localStorage after successful payment
    localStorage.removeItem("pendingDonation");
    localStorage.removeItem("pendingDonationId");

    // Set the donationId in localStorage for the Thank You page
    localStorage.setItem("donationId", donationId.value);

    // Show success message
    if (paymentMethod.value === "stripe-payment") {
      alert(t("pages.payment.messages.paymentProcessed"));
    } else {
      alert(t("pages.payment.messages.paymentPending"));
    }

    // Redirect to a thank you page
    router.push("/thank-you");
  } catch (error) {
    console.error("Error updating donation payment:", error);
    alert(t("pages.payment.messages.errorProcessing"));
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

// Clear any intervals when component is unmounted
onUnmounted(() => {
  // No cleanup needed for Stripe Elements - handled automatically
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
#payment-element {
  background-color: white;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  transition: box-shadow 150ms ease;
}

#payment-element:focus {
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
