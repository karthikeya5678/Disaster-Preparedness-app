const admin = require('firebase-admin');

// Check for environment variable first (for Render), then fall back to local file
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('../../serviceAccountKey.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database
const db = admin.firestore();

// Get a reference to Firebase Authentication
const auth = admin.auth();

console.log('Firebase Admin SDK initialized successfully.');

module.exports = { db, auth };