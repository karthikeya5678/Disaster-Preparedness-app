import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import client from '../api/client';
import { auth } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import Achievements from '../components/student/Achievements';
import { Link } from 'react-router-dom';

const ChildProgressPage: React.FC = () => {
    const [progress, setProgress] = useState<any>(null);
    const [child, setChild] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchChildData = async () => {
            if (!currentUser) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };
                // We need to find the child's UID first
                const childRes = await client.get('/api/users/my-child', { headers });
                setChild(childRes.data);
                // Then, we can fetch the child's progress using their UID
                const progressRes = await client.get(`http://localhost:8080/api/progress?uid=${childRes.data.uid}`, { headers });
                setProgress(progressRes.data);
            } catch (error) {
                console.error("Failed to fetch child data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChildData();
    }, [currentUser]);

    if (loading) {
        return <MainLayout title="Child's Progress"><p>Loading progress...</p></MainLayout>;
    }
    if (!child || !progress) {
        return (
            <MainLayout title="Child's Progress">
                 <Link to="/dashboard" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
                 <p>Could not load your child's progress. Please ensure they are correctly linked by a teacher.</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout title={`Progress for ${child.fullName}`}>
            <Link to="/dashboard" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
            <div style={{ marginBottom: '2rem' }}>
                <Achievements badges={progress.earnedBadges} />
            </div>
            {/* Here you would add the quiz results table for the child */}
        </MainLayout>
    );
};

export default ChildProgressPage;