# Firebase Deployment Guide for Woody Prieb Dharmoscience Series Book Donation Campaign

## Overview

This guide will help you deploy your Vue.js donation application using Firebase Hosting and Firebase Functions.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Node.js 18+ installed

## Step 1: Environment Setup

### 1.1 Update your .env file for production

```env
# Firebase Configuration (replace with your project values)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_live_your-live-public-key

# API URL (will be your Firebase Functions URL)
VITE_API_URL=https://asia-southeast1-your-project-id.cloudfunctions.net/api
```

## Step 2: Firebase Functions Setup

### 2.1 Set Firebase Functions Configuration

```bash
# Set Stripe secret key
firebase functions:config:set stripe.secret_key="sk_live_your-live-secret-key"

# Set Stripe webhook secret (get this from Stripe Dashboard)
firebase functions:config:set stripe.webhook_secret="whsec_your-webhook-secret"

# Check configuration
firebase functions:config:get
```

### 2.2 Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

## Step 3: Build and Deploy

### 3.1 Build the Vue.js Application

```bash
npm run build
```

### 3.2 Deploy to Firebase

```bash
# Deploy everything (hosting + functions)
firebase deploy

# Or deploy separately:
firebase deploy --only hosting
firebase deploy --only functions
```

## Step 4: Configure Stripe Webhook

### 4.1 Add Webhook Endpoint in Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://asia-southeast1-your-project-id.cloudfunctions.net/api/webhook`
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.processing`

### 4.2 Update Webhook Secret

```bash
# Get the webhook secret from Stripe and update Firebase config
firebase functions:config:set stripe.webhook_secret="whsec_new-webhook-secret"
firebase deploy --only functions
```

## Step 5: Domain Configuration (Optional)

### 5.1 Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

## Step 6: Security Rules

### 6.1 Firestore Security Rules

Ensure your `firestore.rules` file has proper security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Donations - authenticated users can create, admins can read/update
    match /donations/{donationId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null &&
        (resource.data.donorEmail == request.auth.token.email ||
         request.auth.token.admin == true);
    }

    // Shipments - admin only
    match /shipments/{shipmentId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }

    // Recipients - read only for authenticated users
    match /recipients/{recipientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 6.2 Storage Security Rules

Update your `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Payment slips
    match /payment_slips/{fileName} {
      allow read, write: if request.auth != null;
    }

    // Profile pictures
    match /profile_pictures/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Testing

### 7.1 Test Payment Flow

1. Create a test donation
2. Try both credit card and bank transfer payments
3. Verify webhook is working (check Functions logs)
4. Confirm shipments are created automatically

### 7.2 Monitor Functions

```bash
# View function logs
firebase functions:log

# View real-time logs
firebase functions:log --follow
```

## Step 8: Environment Variables Update

Update your production environment variables:

```env
# Production API URL
VITE_API_URL=https://asia-southeast1-your-project-id.cloudfunctions.net/api

# Production Stripe keys
VITE_STRIPE_PUBLIC_KEY=pk_live_your-live-public-key
```

## Deployment Commands Summary

```bash
# Initial setup
npm install -g firebase-tools
firebase login
firebase init

# Set environment variables
firebase functions:config:set stripe.secret_key="your-stripe-secret"
firebase functions:config:set stripe.webhook_secret="your-webhook-secret"

# Build and deploy
npm run build
firebase deploy

# Deploy only specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Benefits of Firebase Deployment

✅ **Automatic Scaling**: Functions scale automatically with demand  
✅ **Global CDN**: Fast content delivery worldwide  
✅ **SSL/HTTPS**: Automatic SSL certificates  
✅ **Easy Rollbacks**: Simple version management  
✅ **Integrated**: Works seamlessly with your existing Firebase services  
✅ **Cost Effective**: Pay only for what you use  
✅ **Monitoring**: Built-in logging and monitoring

## Alternative Backend-as-a-Service Options

If you prefer alternatives to Firebase Functions:

### 1. **Vercel** (Recommended for Next.js/React)

- Great for frontend hosting
- Serverless functions support
- Easy GitHub integration

### 2. **Netlify**

- Excellent for static sites
- Serverless functions
- Built-in form handling

### 3. **Railway**

- Full-stack deployment
- Database included
- Git-based deployment

### 4. **Supabase**

- Firebase alternative
- PostgreSQL database
- Real-time subscriptions

### 5. **AWS Amplify**

- Full AWS integration
- Auto-scaling
- Multiple environments

## Why Firebase is Best for Your Project

Given your current setup with Firebase Auth, Firestore, and Storage, **Firebase Functions + Hosting** is the most logical choice because:

1. **Seamless Integration**: No need to configure CORS or authentication between services
2. **Single Console**: Manage everything from one dashboard
3. **Shared Security Rules**: Use the same Firebase Auth tokens
4. **Cost Efficiency**: No additional services to pay for
5. **Familiar Environment**: You're already using Firebase extensively

## Need Help?

If you encounter issues during deployment:

1. Check Firebase Console logs
2. Verify environment variables are set correctly
3. Ensure Stripe webhook is configured properly
4. Test with small amounts first

The Firebase approach will give you a production-ready, scalable solution that integrates perfectly with your existing Firebase services!
