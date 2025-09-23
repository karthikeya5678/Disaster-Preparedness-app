import React, { useMemo } from 'react';
import { useAuth } from '../lib/AuthContext';
import DrillsList from '../components/drills/DrillsList';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Define the Drill type here so we can use it
interface Drill {
  id: string; name: string; type: string; scheduledDate: string;
  participants: string[]; participantsCount: number; totalStudents: number; participationRate: number;
}

const DrillsPage: React.FC = () => {
    const { currentUser } = useAuth();

    const drillsQuery = useMemo(() => {
        if (!currentUser?.institutionId) return null;
        return query(
            collection(db, 'drills'),
            where('institutionId', '==', currentUser.institutionId),
            orderBy('scheduledDate', 'desc')
        );
    }, [currentUser?.institutionId]);

    // --- THIS IS THE FIX ---
    // We now tell the hook that we expect it to return a list of Drills.
    const { data: drills, loading, error } = useRealtimeData<Drill>(drillsQuery);

    if (loading) return <p>Loading drills...</p>;
    if (error) return <p>Error loading drills.</p>;

    return (
        <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Virtual Drills</h1>
            <p style={{ marginTop: '0.5rem', marginBottom: '2.5rem', fontSize: '1.125rem' }}>
                Participate in scheduled drills to test your knowledge and preparedness.
            </p>
            <DrillsList drills={drills} onAction={() => {}} />
        </div>
    );
};

export default DrillsPage;