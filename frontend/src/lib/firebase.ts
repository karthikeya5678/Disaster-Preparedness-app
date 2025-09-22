// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your own Firebase configuration object that you saved earlier
const firebaseConfig = {
  apiKey: "AIzaSyBwYihrfpp-ImW8a9DCPyBvOcSpQsM6CT8",
  authDomain: "disaster-429f0.firebaseapp.com",
  projectId: "disaster-429f0",
  storageBucket: "disaster-429f0.firebasestorage.app",
  messagingSenderId: "385733181390",
  appId: "1:385733181390:web:a8b2c1565090e2fe80759f",
  measurementId: "G-JR7NKEC6ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;