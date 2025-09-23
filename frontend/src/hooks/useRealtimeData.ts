import { useState, useEffect } from 'react';
// --- THIS IS THE CRITICAL FIX ---
// The unused 'type DocumentData' has been completely removed from this import line.
import { onSnapshot, Query } from 'firebase/firestore';

// This is the final, generic, reusable hook to listen for real-time data from any Firestore query.
// <T> is a placeholder for any specific type we want, like Drill or UserProfile.
export const useRealtimeData = <T,>(q: Query | null) => {
    // The state is now strongly typed to an array of whatever type <T> is.
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!q) {
            setData([]); // Ensure data is an empty array if the query is null
            setLoading(false);
            return;
        }

        setLoading(true);
        
        // This is the core of Firebase's real-time functionality.
        // onSnapshot creates a live connection to the database.
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const documents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as T[]; // We tell TypeScript to treat the final result as our specific type T.
                setData(documents);
                setLoading(false);
            }, 
            (err) => {
                console.error("Real-time listener error:", err);
                setError(err);
                setLoading(false);
            }
        );

        // This is a crucial cleanup step. When the component unmounts,
        // we close the live connection to prevent memory leaks.
        return () => unsubscribe();
    }, [q]); // The hook will re-run if the query itself changes

    return { data, loading, error };
};