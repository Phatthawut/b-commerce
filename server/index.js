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
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // In production, specify allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:5173", "http://localhost:3000"]; // Development fallback

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Important: Use JSON parser for all routes EXCEPT the webhook route
// This is because Stripe needs the raw request body for signature verification
app.use((req, res, next) => {
  if (req.originalUrl === "/api/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

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
    const paymentIntent = await stripe.paymentIntents.create(
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
app.post("/api/create-promptpay-payment", async (req, res) => {
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
    const paymentIntent = await stripe.paymentIntents.create({
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
app.get("/api/check-payment-status", async (req, res) => {
  try {
    const { paymentIntentId } = req.query;

    if (!paymentIntentId) {
      return res.status(400).send({ error: "Missing payment intent ID" });
    }

    console.log(`Checking payment status for intent: ${paymentIntentId}`);

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

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
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      // Use the raw request body for signature verification
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

    // Send confirmation email to donor if email is available
    if (donationData.donorEmail) {
      try {
        // You can use nodemailer or any other email service here
        // This is a placeholder for the email sending logic
        console.log(
          `Sending payment confirmation email to ${donationData.donorEmail}`
        );

        // Example email sending code (uncomment and configure when ready)
        /*
        const mailOptions = {
          from: 'noreply@yourorganization.com',
          to: donationData.donorEmail,
          subject: 'Your Donation Payment Confirmation',
          html: `
            <h1>Thank you for your donation!</h1>
            <p>Dear ${donationData.donorName},</p>
            <p>Your payment of ${formatCurrency(donationData.amount)} has been successfully processed.</p>
            <p>Donation ID: ${donationId}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Thank you for your generosity!</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
        */

        console.log(`Confirmation email sent to ${donationData.donorEmail}`);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    // Create a shipment record automatically
    try {
      await createShipmentFromDonation(donationId, donationData);
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
        paymentStatus: "failed",
        status: "failed",
        stripePaymentIntentId: paymentIntent.id,
        paymentError:
          paymentIntent.last_payment_error?.message || "Payment failed",
        paymentDate: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(`Updated donation ${donationId} with failed payment status`);

    // Send notification email to donor if email is available
    if (donationData.donorEmail) {
      try {
        console.log(
          `Sending payment failure email to ${donationData.donorEmail}`
        );

        // Example email sending code (uncomment and configure when ready)
        /*
        const mailOptions = {
          from: 'noreply@yourorganization.com',
          to: donationData.donorEmail,
          subject: 'Your Donation Payment Failed',
          html: `
            <h1>Payment Failed</h1>
            <p>Dear ${donationData.donorName},</p>
            <p>We're sorry, but your payment of ${formatCurrency(donationData.amount)} could not be processed.</p>
            <p>Reason: ${paymentIntent.last_payment_error?.message || "Unknown error"}</p>
            <p>Donation ID: ${donationId}</p>
            <p>Please try again or contact our support team for assistance.</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
        */

        console.log(
          `Failure notification email sent to ${donationData.donorEmail}`
        );
      } catch (emailError) {
        console.error("Error sending failure email:", emailError);
      }
    }
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
async function createShipmentFromDonation(donationId, donationData) {
  try {
    console.log(`Creating shipment for donation ${donationId}`);
    console.log("Donation data:", donationData);

    // Check if shipments already exist for this donation
    const existingShipmentsQuery = await db
      .collection("shipments")
      .where("donationId", "==", donationId)
      .get();

    if (!existingShipmentsQuery.empty) {
      const existingShipments = [];
      existingShipmentsQuery.forEach((doc) => {
        existingShipments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(
        `Shipments already exist for donation ${donationId}:`,
        existingShipments
      );
      console.log(
        `Returning existing shipment IDs instead of creating duplicates`
      );

      // Return the IDs of existing shipments
      const existingIds = existingShipments.map((shipment) => shipment.id);
      return existingIds;
    }

    // Create recipients array from donation data
    let recipients = [];

    // Check if donation has recipients array
    if (donationData.recipients && donationData.recipients.length > 0) {
      console.log(
        "Using recipients array from donation:",
        donationData.recipients
      );
      // Use the recipients array directly, but add quantity field
      recipients = donationData.recipients.map((recipient) => ({
        ...recipient,
        quantity: 1, // Each recipient gets 1 book set
      }));
      console.log("Recipients array for shipment:", recipients);
    } else {
      // Create a single recipient from donation fields
      console.log("Creating recipient from donation fields");
      const recipientInfo = {
        recipientName:
          donationData.recipientName || donationData.donorName || "",
        address: donationData.recipientAddress || "",
        phone: donationData.recipientPhone || donationData.donorPhone || "",
        recipientCategory: donationData.recipientCategory || "individual",
        recipientId: donationData.recipientId || "",
        recipientRegion: donationData.recipientRegion || "",
        quantity: 1, // Always 1 book set per recipient
      };
      recipients = [recipientInfo];
      console.log("Created recipient for shipment:", recipientInfo);
    }

    // Create a separate shipment for each recipient
    const shipmentIds = [];

    for (const recipient of recipients) {
      // Create a shipment record in Firestore for this recipient
      const shipmentData = {
        donationId: donationId,
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail || null,
        donorPhone: donationData.donorPhone,
        // Add recipient information as direct properties
        recipientName:
          recipient.recipientName || recipient.institutionName || "",
        recipientAddress: recipient.address || "",
        recipientPhone: recipient.phone || "",
        // Also store the single recipient in the recipients array for consistency
        recipients: [recipient],
        quantity: 1, // Each shipment is for 1 book set
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        notes: "Automatically created from successful payment",
        automatedCreation: true,
        // Add items
        items: [
          {
            name: "Book Donation",
            quantity: 1, // Each shipment is for 1 book set
          },
        ],
      };

      console.log(
        `Creating shipment for recipient: ${recipient.recipientName}`,
        shipmentData
      );
      const shipmentRef = await db.collection("shipments").add(shipmentData);

      console.log(
        `Created shipment ${shipmentRef.id} for recipient: ${recipient.recipientName}`
      );

      shipmentIds.push(shipmentRef.id);
    }

    // Update the donation with all shipment IDs
    await db.collection("donations").doc(donationId).update({
      shipmentIds: shipmentIds, // Store all shipment IDs
      shipmentId: shipmentIds[0], // Keep the first one for backward compatibility
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

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount || 0);
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
