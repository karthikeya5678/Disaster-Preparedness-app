import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import axios from 'axios';
import { auth } from '../../lib/firebase';
import DashboardCard from '../dashboard/DashboardCard';
import styles from './ChildProgressCard.module.css';

interface ChildProfile {
    uid: string;
    fullName: string;
}
interface ChildProgress {
    completedLessonsCount: number;
    earnedBadges: any[];
}

const ChildProgressCard: React.FC = () => {
    const { currentUser } = useAuth();
    const [child, setChild] = useState<ChildProfile | null>(null);
    const [progress, setProgress] = useState<ChildProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChildData = async () => {
            if (!currentUser) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };

                const childRes = await axios.get('http://localhost:8080/api/users/my-child', { headers });
                const childProfile = childRes.data;
                
                // This check is now more robust.
                if (childProfile && childProfile.uid) {
                    setChild(childProfile);
                    const progressRes = await axios.get(`http://localhost:8080/api/progress?uid=${childProfile.uid}`, { headers });
                    setProgress(progressRes.data);
                } else {
                    // This will now only trigger if the backend sends a truly empty response.
                    setError("Child data is incomplete.");
                }
            } catch (err: any) {
                console.error("Failed to fetch child data", err);
                setError(err.response?.data?.message || "Could not load child's progress.");
            } finally {
                setLoading(false);
            }
        };
        fetchChildData();
    }, [currentUser]);

    if (loading) {
        return <DashboardCard title="Child's Progress"><p>Loading...</p></DashboardCard>;
    }
    if (error || !child) {
        return <DashboardCard title="Child's Progress"><p className={styles.error}>{error}</p></DashboardCard>;
    }

    return (
        <DashboardCard title={`Progress for ${child.fullName}`}>
            <div className={styles.progressGrid}>
                <div className={styles.statBox}>
                    <span className={styles.statValue}>{progress?.completedLessonsCount || 0}</span>
                    <span className={styles.statLabel}>Lessons Completed</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statValue}>{progress?.earnedBadges?.length || 0}</span>
                    <span className={styles.statLabel}>Badges Earned</span>
                </div>
            </div>
        </DashboardCard>
    );
};

export default ChildProgressCard;