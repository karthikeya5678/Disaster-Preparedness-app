import React, { useState, useMemo, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import CreateDrillForm from '../components/admin/CreateDrillForm';
import DrillsList from '../components/drills/DrillsList';
import { useAuth } from '../lib/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Drill {
  id: string; name: string; type: string; scheduledDate: string;
  participants: string[]; participantsCount: number; totalStudents: number; participationRate: number;
}

const ManageDrillsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [editingDrill, setEditingDrill] = useState<Drill | null>(null);

    const drillsQuery = useMemo(() => {
        if (!currentUser?.institutionId) return null;
        return query(
            collection(db, 'drills'), 
            where('institutionId', '==', currentUser.institutionId),
            orderBy('scheduledDate', 'desc')
        );
    }, [currentUser?.institutionId]);

    // --- THIS IS THE FIX ---
    const { data: drills, loading, error } = useRealtimeData<Drill>(drillsQuery);

    const handleSave = useCallback(() => {
        setEditingDrill(null);
    }, []);
    
    if (loading) return <MainLayout title="Manage Drills"><p>Loading drills...</p></MainLayout>;
    if (error) return <MainLayout title="Manage Drills"><p>Error loading drills.</p></MainLayout>;

    return (
        <MainLayout title="Manage Drills">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
                <div>
                    <CreateDrillForm key={editingDrill?.id || 'new'} initialData={editingDrill} onDrillCreated={handleSave} onCancel={() => setEditingDrill(null)} />
                </div>
                <div>
                    <DrillsList drills={drills} onAction={handleSave} onEdit={setEditingDrill} />
                </div>
            </div>
        </MainLayout>
    );
};

export default ManageDrillsPage;