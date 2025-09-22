import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import axios from 'axios';
import ProgressCard from '../dashboard/ProgressCard';
import NextDrillCard from '../dashboard/NextDrillCard';
import DashboardCard from '../dashboard/DashboardCard';
import { Link } from 'react-router-dom';

interface DashboardData {
    completedLessons: number;
    totalLessons: number;
    preparednessScore: string;
    nextDrill: { name: string; scheduledDate: string } | null;
}

const StudentDashboardHub: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await axios.get('http://localhost:8080/api/dashboard/student', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch student dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    if (loading) {
        return <p>Loading your dashboard summary...</p>;
    }

    if (!data) {
        return <p>Could not load your dashboard data at this time.</p>;
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <ProgressCard 
                score={data.preparednessScore} 
                completed={data.completedLessons} 
                total={data.totalLessons} 
            />
            <NextDrillCard drill={data.nextDrill} />
             <DashboardCard title="Start Learning">
                <p>Jump back into your courses and continue learning.</p>
                <Link to="/dashboard/courses" style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none' }}>
                    Go to Courses &rarr;
                </Link>
            </DashboardCard>
        </div>
    );
};

export default StudentDashboardHub;