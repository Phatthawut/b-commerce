const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables first, before any other initialization
dotenv.config();

// Check if the Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("ERROR: Stripe secret key is missing. Check your .env file.");
  process.exit(1);
}

// Initialize Stripe with the secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin
let serviceAccount;
try {
  serviceAccount = require("./service-account.json");
} catch (error) {
  console.error(
    "ERROR: Could not load service-account.json file:",
    error.message
  );
  console.error(
    "Make sure you have created a service-account.json file in the server directory."
  );
  process.exit(1);
}

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Log configuration on startup
console.log(`Server starting with configuration:
- PORT: ${port}
- STRIPE_SECRET_KEY: ${
  process.env.STRIPE_SECRET_KEY
    ? "Configured (starts with " +
      process.env.STRIPE_SECRET_KEY.substring(0, 7) +
      "...)"
    : "Missing"
}
- STRIPE_WEBHOOK_SECRET: ${
  process.env.STRIPE_WEBHOOK_SECRET ? "Configured" : "Missing"
}
- Firebase Admin SDK: ${serviceAccount ? "Configured" : "Missing"}
`);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).send({
    status: "ok",
    stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "missing",
    firebase: serviceAccount ? "configured" : "missing",
  });
});

// Create payment intent endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, donationId, metadata } = req.body;

    // Validate required fields
    if (!amount || !currency || !donationId) {
      return res.status(400).send({ error: "Missing required parameters" });
    }

    console.log(
      `Creating payment intent for donation ${donationId} with amount ${amount} ${currency}`
    );

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        donationId,
        ...metadata,
      },
    });

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

// Webhook endpoint to handle Stripe events
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
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
      });

    console.log(`Updated donation ${donationId} with successful payment`);
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
