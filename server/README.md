# B-Commerce Payment Server

This is the backend server for processing payments in the B-Commerce donation platform. It handles Stripe payment processing and integrates with Firebase for data storage.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Stripe account
- Firebase project with Firestore

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Configuration

1. Create a `.env` file in the server directory with the following variables:

   ```
   # Stripe API Keys
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Server Configuration
   PORT=3000

   # Firebase Configuration (if needed)
   FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
   ```

   > **IMPORTANT**: Make sure to use your Stripe **secret key** (starts with `sk_test_` or `sk_live_`) for the `STRIPE_SECRET_KEY` variable. The publishable key (starts with `pk_test_` or `pk_live_`) should only be used on the client side.

2. Generate a Firebase service account key:
   - Go to your Firebase project settings
   - Navigate to "Service accounts"
   - Click "Generate new private key"
   - Save the JSON file as `service-account.json` in the server directory
   - You can use the `service-account-example.json` file as a reference for the expected format

### Running the Server

For development:

```
npm run dev
```

For production:

```
npm start
```

## API Endpoints

### Health Check

- **URL**: `/api/health`
- **Method**: `GET`
- **Response**: `{ "status": "ok", "stripe": "configured", "firebase": "configured" }`

### Create Payment Intent

- **URL**: `/api/create-payment-intent`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "amount": 1000,
    "currency": "thb",
    "donationId": "donation123",
    "metadata": {
      "donorName": "John Doe",
      "donorEmail": "john@example.com",
      "recipientName": "Library Foundation"
    }
  }
  ```
- **Response**:
  ```json
  {
    "clientSecret": "pi_123_secret_456",
    "paymentIntentId": "pi_123"
  }
  ```

### Stripe Webhook

- **URL**: `/api/webhook`
- **Method**: `POST`
- **Headers**: Requires `stripe-signature` header
- **Body**: Raw Stripe event payload
- **Response**: `{ "received": true }`

## Setting Up Stripe Webhooks

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to your Stripe account:
   ```
   stripe login
   ```
3. Forward webhooks to your local server:
   ```
   stripe listen --forward-to http://localhost:3000/api/webhook
   ```
4. Use the webhook signing secret provided by the Stripe CLI in your `.env` file

## Troubleshooting

### Common Issues

#### "You did not provide an API key" Error

If you see an error like:

```
Error: You did not provide an API key. You need to provide your API key in the Authorization header, using Bearer auth...
```

This usually means:

1. Your `.env` file is not being loaded correctly
2. You're using the wrong type of API key (publishable instead of secret)
3. The environment variable name doesn't match what the code is looking for

**Solution:**

- Make sure your `.env` file exists in the server directory
- Ensure you're using a secret key (starts with `sk_test_` or `sk_live_`)
- Check that the variable name is `STRIPE_SECRET_KEY`
- Restart your server after making changes to the `.env` file

#### Firebase Service Account Issues

If you see errors related to Firebase authentication:

**Solution:**

- Make sure your `service-account.json` file exists in the server directory
- Verify that the JSON format is correct
- Ensure the service account has the necessary permissions in your Firebase project

#### Webhook Verification Failures

If webhook events aren't being processed:

**Solution:**

- Check that your `STRIPE_WEBHOOK_SECRET` is correct
- Make sure you're using the webhook secret provided by the Stripe CLI or dashboard
- Verify that the webhook endpoint is accessible from the internet if testing with real events

## Production Deployment

For production, you should:

1. Deploy the server to a cloud provider (Heroku, AWS, Google Cloud, etc.)
2. Set up proper environment variables in your hosting environment
3. Configure Stripe webhooks to point to your production server URL
4. Ensure your Firebase service account has appropriate permissions

## Security Considerations

- Never commit your `.env` file or `service-account.json` to version control
- Always use HTTPS in production
- Validate all incoming requests
- Implement rate limiting for production use
