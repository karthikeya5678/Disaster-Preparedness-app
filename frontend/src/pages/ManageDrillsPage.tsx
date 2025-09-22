import React, { useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import CreateDrillForm from '../components/admin/CreateDrillForm';
import DrillsList from '../components/drills/DrillsList';
import { useAuth } from '../lib/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ManageDrillsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [editingDrill, setEditingDrill] = useState<any | null>(null);

    const drillsQuery = useMemo(() => {
        if (!currentUser?.institutionId) return null;
        return query(
            collection(db, 'drills'), 
            where('institutionId', '==', currentUser.institutionId),
            orderBy('scheduledDate', 'desc')
        );
    }, [currentUser?.institutionId]);

    const { data: drills, loading, error } = useRealtimeData(drillsQuery);

    const handleSave = () => {
        setEditingDrill(null); // This clears the form
    };
    
    if (loading) return <MainLayout title="Manage Drills"><p>Loading drills...</p></MainLayout>;
    if (error) return <MainLayout title="Manage Drills"><p>Error loading drills.</p></MainLayout>;

    return (
        <MainLayout title="Manage Drills">
            <p style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.125rem', color: '#4b5563' }}>
                Use this page to schedule, edit, and track participation for all institutional drills.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
                <div>
                    <CreateDrillForm
                        key={editingDrill ? editingDrill.id : 'new'}
                        initialData={editingDrill}
                        onDrillCreated={handleSave}
                        onCancel={() => setEditingDrill(null)}
                    />
                </div>
                <div>
                    <DrillsList 
                        drills={drills} 
                        onAction={handleSave} // onAction can be reused to clear the form after delete
                        onEdit={setEditingDrill} 
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default ManageDrillsPage;