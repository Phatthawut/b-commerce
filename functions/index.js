/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

// Set global options for all functions - deploy to asia-southeast1 region
setGlobalOptions({
  region: "asia-southeast1",
  maxInstances: 10,
});

// Initialize Firebase Admin (no need for service account in Functions)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Define secrets for Stripe configuration (v6 modern approach)
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Initialize Stripe - will be loaded at runtime
let stripe;

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));

// Important: Use JSON parser for all routes EXCEPT the webhook route
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Initialize Stripe lazily with proper secret handling
const getStripe = () => {
  if (!stripe) {
    const secretKey = stripeSecretKey.value();
    if (!secretKey) {
      throw new Error("Stripe secret key not configured");
    }

    // Clean the secret key of any potential whitespace or invalid characters
    const cleanSecretKey = secretKey.toString().trim();

    console.log("Initializing Stripe with cleaned secret key");
    stripe = new Stripe(cleanSecretKey);
  }
  return stripe;
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send({
    status: "ok",
    region: "asia-southeast1",
    stripe: stripeSecretKey.value() ? "configured" : "missing",
    firebase: "configured",
    version: "v6.3.2",
  });
});

// Create payment intent endpoint
app.post("/create-payment-intent", async (req, res) => {
  try {
    const {
      amount,
      currency,
      donationId,
      metadata,
      automatic_payment_methods,
    } = req.body;

    // Validate required fields
    if (!amount || !currency || !donationId) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    console.log(
      `Creating payment intent for donation ${donationId} with amount ${amount} ${currency}`
    );

    // Prepare payment intent options
    const paymentIntentOptions = {
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        donationId,
        ...metadata,
      },
    };

    // Enable automatic payment methods if requested (includes PromptPay for THB)
    if (automatic_payment_methods && automatic_payment_methods.enabled) {
      paymentIntentOptions.automatic_payment_methods = {
        enabled: true,
      };
    } else {
      // Fallback: For THB currency, explicitly include PromptPay and card
      if (currency.toLowerCase() === "thb") {
        paymentIntentOptions.payment_method_types = ["card", "promptpay"];
      } else {
        paymentIntentOptions.payment_method_types = ["card"];
      }
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await getStripe().paymentIntents.create(
      paymentIntentOptions
    );

    console.log(`Payment intent created: ${paymentIntent.id}`);

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

// Create PromptPay payment intent endpoint
app.post("/create-promptpay-payment", async (req, res) => {
  try {
    const { amount, currency, donationId, metadata } = req.body;

    // Validate required fields
    if (!amount || !currency || !donationId) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    console.log(
      `Creating PromptPay payment intent for donation ${donationId} with amount ${amount} ${currency}`
    );

    // Create a PaymentIntent with the PromptPay payment method
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency.toLowerCase(),
      payment_method_types: ["promptpay"],
      metadata: {
        donationId,
        paymentMethod: "promptpay",
        ...metadata,
      },
    });

    console.log(`PromptPay payment intent created: ${paymentIntent.id}`);

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating PromptPay payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

// Check payment status endpoint
app.get("/check-payment-status", async (req, res) => {
  try {
    const { paymentIntentId } = req.query;

    if (!paymentIntentId) {
      return res.status(400).send({ error: "Missing payment intent ID" });
    }

    console.log(`Checking payment status for intent: ${paymentIntentId}`);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await getStripe().paymentIntents.retrieve(
      paymentIntentId
    );

    console.log(`Payment status: ${paymentIntent.status}`);

    // Return the payment status
    res.send({
      status: paymentIntent.status,
      paymentIntent: paymentIntent,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).send({ error: error.message });
  }
});

// Webhook endpoint to handle Stripe events
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = stripeWebhookSecret.value();

    let event;

    try {
      // Use the raw request body for signature verification
      event = getStripe().webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await handleFailedPayment(failedPayment);
        break;
      case "payment_intent.processing":
        const processingPayment = event.data.object;
        await handleProcessingPayment(processingPayment);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send({ received: true });
  }
);

// Handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { donationId } = paymentIntent.metadata;

    if (!donationId) {
      console.error("No donation ID found in payment metadata");
      return;
    }

    console.log(`Processing successful payment for donation ${donationId}`);

    // Get the donation data first to have complete information for email
    const donationDoc = await db.collection("donations").doc(donationId).get();

    if (!donationDoc.exists) {
      console.error(`Donation ${donationId} not found`);
      return;
    }

    const donationData = donationDoc.data();

    // Update the donation in Firestore
    await db
      .collection("donations")
      .doc(donationId)
      .update({
        paymentStatus: "completed",
        status: "completed",
        stripePaymentIntentId: paymentIntent.id,
        paymentDate: admin.firestore.FieldValue.serverTimestamp(),
        cardDetails: {
          last4: paymentIntent.payment_method_details?.card?.last4 || "",
          brand: paymentIntent.payment_method_details?.card?.brand || "",
        },
        // Add automated verification info
        verificationNotes: "Payment automatically verified by Stripe",
        verificationDate: admin.firestore.FieldValue.serverTimestamp(),
        automatedVerification: true,
      });

    console.log(`Updated donation ${donationId} with successful payment`);

    // Create a shipment record automatically
    try {
      await createShipmentFromDonation(donationData, donationId);
    } catch (shipmentError) {
      console.error("Error creating shipment:", shipmentError);
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    const { donationId } = paymentIntent.metadata;

    if (!donationId) {
      console.error("No donation ID found in payment metadata");
      return;
    }

    console.log(`Processing failed payment for donation ${donationId}`);

    // Update the donation in Firestore
    await db
      .collection("donations")
      .doc(donationId)
      .update({
        paymentStatus: "failed",
        status: "failed",
        stripePaymentIntentId: paymentIntent.id,
        paymentError:
          paymentIntent.last_payment_error?.message || "Payment failed",
        paymentDate: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(`Updated donation ${donationId} with failed payment status`);
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

// Handle processing payment
async function handleProcessingPayment(paymentIntent) {
  try {
    const { donationId } = paymentIntent.metadata;

    if (!donationId) {
      console.error("No donation ID found in payment metadata");
      return;
    }

    console.log(`Processing payment in progress for donation ${donationId}`);

    // Update the donation in Firestore
    await db.collection("donations").doc(donationId).update({
      paymentStatus: "processing",
      status: "processing",
      stripePaymentIntentId: paymentIntent.id,
      paymentDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(
      `Updated donation ${donationId} with processing payment status`
    );
  } catch (error) {
    console.error("Error handling processing payment:", error);
  }
}

// Helper function to create a shipment from a donation
async function createShipmentFromDonation(donationData, donationId) {
  try {
    console.log(`Creating shipment for donation ${donationId}`);

    // Check if shipments already exist for this donation
    const existingShipmentsQuery = await db
      .collection("shipments")
      .where("donationId", "==", donationId)
      .get();

    if (!existingShipmentsQuery.empty) {
      console.log(
        `Shipments already exist for donation ${donationId}, skipping creation`
      );
      return;
    }

    // Create recipients array from donation data
    let recipients = [];

    // Check if donation has recipients array
    if (donationData.recipients && donationData.recipients.length > 0) {
      recipients = donationData.recipients.map((recipient) => ({
        ...recipient,
        quantity: 1, // Each recipient gets 1 book set
      }));
    } else {
      // Create a single recipient from donation fields
      const recipientInfo = {
        recipientName:
          donationData.recipientName || donationData.donorName || "",
        address: donationData.recipientAddress || "",
        phone: donationData.recipientPhone || donationData.donorPhone || "",
        recipientCategory: donationData.recipientCategory || "individual",
        recipientId: donationData.recipientId || "",
        recipientRegion: donationData.recipientRegion || "",
        quantity: 1,
      };
      recipients = [recipientInfo];
    }

    // Create a separate shipment for each recipient
    const shipmentIds = [];

    for (const recipient of recipients) {
      const shipmentData = {
        donationId: donationId,
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail || null,
        donorPhone: donationData.donorPhone,
        recipientName:
          recipient.recipientName || recipient.institutionName || "",
        recipientAddress: recipient.address || "",
        recipientPhone: recipient.phone || "",
        recipients: [recipient],
        quantity: 1,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        notes: "Automatically created from successful payment",
        automatedCreation: true,
        items: [
          {
            name: "Book Donation",
            quantity: 1,
          },
        ],
      };

      const shipmentRef = await db.collection("shipments").add(shipmentData);
      shipmentIds.push(shipmentRef.id);
    }

    // Update the donation with all shipment IDs
    await db.collection("donations").doc(donationId).update({
      shipmentIds: shipmentIds,
      shipmentId: shipmentIds[0],
      shipmentStatus: "pending",
    });

    console.log(
      `Updated donation ${donationId} with ${shipmentIds.length} shipment IDs`
    );

    return shipmentIds;
  } catch (error) {
    console.error(`Error creating shipment for donation ${donationId}:`, error);
    throw error;
  }
}

// Export the API as a Firebase Function in asia-southeast1 region with secrets
exports.api = onRequest(
  {
    secrets: [stripeSecretKey, stripeWebhookSecret],
    maxInstances: 10,
  },
  app
);
