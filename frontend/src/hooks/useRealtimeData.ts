import { useState, useEffect } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';

// --- THIS IS THE CRITICAL FIX ---
// 1. The hook is now "generic". <T> is a placeholder for any specific type we want, like Drill or UserProfile.
export const useRealtimeData = <T,>(q: Query | null) => {
    // 2. The state is now strongly typed to an array of whatever type <T> is.
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
        
        const unsubscribe = onSnapshot(q, 
            (querySnapshot) => {
                const documents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as T[]; // 3. We tell TypeScript to treat the final result as our specific type T.
                setData(documents);
                setLoading(false);
            }, 
            (err) => {
                console.error("Real-time listener error:", err);
                setError(err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [q]);

    return { data, loading, error };
};