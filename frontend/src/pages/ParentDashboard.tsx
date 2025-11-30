import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import client from '../api/client';
import { auth } from '../lib/firebase';
import DashboardCard from '../components/dashboard/DashboardCard';
import ChildProgressCard from '../components/parent/ChildProgressCard';
import styles from './ParentDashboard.module.css';

// Define the structure of a Drill object for clarity
interface Drill {
  id: string;
  name: string;
  scheduledDate: string;
}

const ParentDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const [nextDrill, setNextDrill] = useState<Drill | null>(null);
    const [isLoadingDrills, setIsLoadingDrills] = useState(true);

    useEffect(() => {
        const fetchUpcomingDrill = async () => {
            // Only fetch if the parent is linked to an institution (via their child)
            if (!currentUser || !currentUser.institutionId) {
                setIsLoadingDrills(false);
                return;
            }

            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await client.get(`https://disaster-preparedness-app.onrender.com/api/drills?institutionId=${currentUser.institutionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Find the soonest drill that is in the future
                const upcomingDrills = res.data
                    .filter((drill: Drill) => new Date(drill.scheduledDate) >= new Date())
                    .sort((a: Drill, b: Drill) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

                if (upcomingDrills.length > 0) {
                    setNextDrill(upcomingDrills[0]);
                }
            } catch (error) {
                console.error("Failed to fetch drills for parent dashboard", error);
            } finally {
                setIsLoadingDrills(false);
            }
        };

        fetchUpcomingDrill();
    }, [currentUser]);

    return (
        <div>
            <h1 className={styles.title}>Parent Dashboard</h1>
            <p className={styles.subtitle}>Welcome, {currentUser?.fullName}! Here's an overview of your child's preparedness journey.</p>
            
            <div className={styles.cardGrid}>
                <ChildProgressCard />
                
                <DashboardCard title="Manage Child's Profile">
                    <p>View and edit your child's personal information to keep it up-to-date.</p>
                    <Link to="/dashboard/manage-child" className={styles.cardLink}>
                        Edit Profile &rarr;
                    </Link>
                </DashboardCard>

                {/* --- THIS IS THE NEW, DYNAMIC DRILL CARD --- */}
                <DashboardCard title="Upcoming School Drill">
                    {isLoadingDrills ? (
                        <p>Loading drill information...</p>
                    ) : nextDrill ? (
                        <div>
                            <p><strong>{nextDrill.name}</strong> is scheduled for:</p>
                            <p className={styles.drillDate}>{new Date(nextDrill.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>Please remind your child of the evacuation procedures.</p>
                        </div>
                    ) : (
                        <p>No upcoming drills are scheduled at this time.</p>
                    )}
                </DashboardCard>
            </div>
        </div>
    );
};

export default ParentDashboard;