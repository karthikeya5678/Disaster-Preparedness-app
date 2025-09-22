import { useState, useEffect } from 'react';
import { onSnapshot, query, Query, type DocumentData } from 'firebase/firestore';

// This is a generic, reusable hook to listen for real-time data from any Firestore query.
export const useRealtimeData = (q: Query | null) => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Only run the hook if the query is valid
        if (!q) {
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
                }));
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