const admin = require('firebase-admin');

// IMPORTANT: This file expects 'serviceAccountKey.json' to be in the same directory.
// Make sure you have downloaded this file from your Firebase project settings.
const serviceAccount = require('./serviceAccountKey.json');

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