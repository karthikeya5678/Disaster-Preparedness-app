import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- THIS IS THE CRITICAL FIX ---
// The code now correctly reads the variable prefixed with "VITE_"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "disaster-429f0.firebaseapp.com",
  projectId: "disaster-429f0",
  storageBucket: "disaster-429f0.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Find this in your Firebase project settings
  appId: "YOUR_APP_ID" // Find this in your Firebase project settings
};

// This safety check will help with future debugging.
if (!firebaseConfig.apiKey) {
    console.error("FATAL ERROR: Firebase API Key is missing. The application cannot start.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;