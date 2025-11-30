import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read configuration from Vite environment variables. Vite injects variables
// that start with VITE_ at build time. We provide sensible fallbacks where
// the project is already known, but it's best to set all VITE_ vars in your
// build environment (GitHub Actions / Netlify / etc.).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'disaster-429f0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'disaster-429f0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'disaster-429f0.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
  console.error('FATAL ERROR: Firebase API Key is missing. The application cannot start.');
}
if (!firebaseConfig.appId) {
  console.warn('Warning: Firebase App ID is missing. Some features (analytics, dynamic links) may not work.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;