import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import styles from './AnalyticsOverview.module.css'; // We will create this CSS file next
import featureStyles from '../Feature.module.css'; // Reuse some shared styles

// Define the structure for the dashboard data
interface DashboardData {
  totalStudents: number;
  totalTeachers: number;
  completedDrills: number;
  upcomingDrills: number;
  preparednessScore: string;
}

const AnalyticsOverview: React.FC = () => {
    const { currentUser } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser || !currentUser.institutionId) {
                setLoading(false);
                return;
            }
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await client.get(`https://disaster-preparedness-app.onrender.com/api/dashboard/admin?institutionId=${currentUser.institutionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch admin dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    if (loading) {
        return <div className={featureStyles.featureBox}>Loading analytics...</div>;
    }

    if (!data) {
        return <div className={featureStyles.featureBox}>Could not load analytics data.</div>;
    }

    return (
        <div className={featureStyles.featureBox}>
            <h2 className={featureStyles.featureTitle}>Institution Overview</h2>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Preparedness Score</h3>
                    <p className={styles.cardStat}>{data.preparednessScore}</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Total Students</h3>
                    <p className={styles.cardStat}>{data.totalStudents}</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Completed Drills</h3>
                    <p className={styles.cardStat}>{data.completedDrills}</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Upcoming Drills</h3>
                    <p className={styles.cardStat}>{data.upcomingDrills}</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOverview;