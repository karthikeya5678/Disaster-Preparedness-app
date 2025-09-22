import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// --- THIS IS THE CRITICAL FIX ---
// We have added the 'export' keyword to the UserProfile interface.
// This makes the UserProfile type public so other files can import it.
export interface UserProfile {
  uid: string;
  email: string | null;
  fullName: string;
  role: 'student' | 'admin' | 'teacher' | 'parent' | 'super-admin';
  institutionId?: string;
  schoolName?: string;
  grade?: string;
  city?: string;
  parentId?: string;
  parentName?: string; // This is a temporary field from the backend, not stored in DB
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as UserProfile);
        } else {
          console.error("User profile not found in Firestore.");
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};