const admin = require('firebase-admin');

// --- THIS IS THE CRITICAL FIX ---
// The old path was './serviceAccountKey.json', which looked in the current folder.
// The new path '../../serviceAccountKey.json' tells the code to go up two levels
// from 'src/config/' to the main 'backend/' folder to find the file where Render places it.
const serviceAccount = require('../../serviceAccountKey.json');

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