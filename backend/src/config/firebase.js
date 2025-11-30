const admin = require('firebase-admin');

let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Attempting to initialize Firebase using environment variable...');
    // Handle potential double-escaped newlines or quotes in Render env vars
    const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n');
    serviceAccount = JSON.parse(rawConfig);
  } else {
    console.log('Environment variable FIREBASE_SERVICE_ACCOUNT not found. Attempting to load from file...');
    serviceAccount = require('../../serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('FATAL ERROR: Failed to initialize Firebase Admin SDK.');
  console.error('Error details:', error.message);
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('Reason: serviceAccountKey.json file not found and FIREBASE_SERVICE_ACCOUNT env var is missing.');
  } else if (error instanceof SyntaxError) {
    console.error('Reason: Invalid JSON in FIREBASE_SERVICE_ACCOUNT env var or serviceAccountKey.json file.');
  }
  // Do not throw here if you want the server to stay alive (though it won't work well), 
  // but usually it's better to crash if DB is essential.
  // We will re-throw to ensure the user sees the error in logs.
  throw error;
}

// Get a reference to the Firestore database
const db = admin.firestore();

// Get a reference to Firebase Authentication
const auth = admin.auth();

module.exports = { db, auth };