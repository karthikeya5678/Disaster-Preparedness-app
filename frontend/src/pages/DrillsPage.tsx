import React, { useMemo } from 'react'; // Import useMemo
import { useAuth } from '../lib/AuthContext';
import DrillsList from '../components/drills/DrillsList';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DrillsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const isStudent = currentUser?.role === 'student';

    // --- APPLYING THE SAME CRITICAL FIX ---
    const drillsQuery = useMemo(() => {
        if (!currentUser?.institutionId) return null;
        return query(
            collection(db, 'drills'),
            where('institutionId', '==', currentUser.institutionId),
            orderBy('scheduledDate', 'desc')
        );
    }, [currentUser?.institutionId]);

    const { data: drills, loading, error } = useRealtimeData(drillsQuery);

    if (loading) return <p>Loading drills...</p>;
    if (error) return <p>Error loading drills.</p>;

    return (
        <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Virtual Drills</h1>
            <p style={{ marginTop: '0.5rem', marginBottom: '2.5rem', fontSize: '1.125rem' }}>
                {isStudent
                    ? "Participate in scheduled drills to test your knowledge and preparedness."
                    : "Here is an overview of all scheduled drills for your institution."
                }
            </p>
            <DrillsList drills={drills} onAction={() => {}} />
        </div>
    );
};

export default DrillsPage;