import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import useGeolocation from '../../hooks/useGeolocation'; // We need the location hook here
import styles from './AlertBanner.module.css';

interface Alert {
    id: string;
    title: string;
    severity: 'High' | 'Medium' | 'Low';
}

const AlertBanner: React.FC = () => {
    const { currentUser } = useAuth();
    const { location } = useGeolocation(); // Get the user's location
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            // --- THIS IS THE CRITICAL FIX ---
            // Only make the API call if we have BOTH a logged-in user AND their location.
            if (currentUser && location) {
                try {
                    const token = await auth.currentUser?.getIdToken();
                    const res = await client.get(`https://disaster-preparedness-app.onrender.com/api/alerts?lat=${location.latitude}&lon=${location.longitude}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Show all non-High severity alerts
                    setAlerts(res.data.filter((a: Alert) => a.severity !== 'High'));
                } catch (error) {
                    console.error("Failed to fetch alerts", error);
                }
            }
        };

        fetchAlerts();
    }, [currentUser, location]); // This effect re-runs when the location is found

    if (alerts.length === 0) {
        return null; // Don't render anything if there are no alerts
    }

    // For now, we just show the most recent alert
    const latestAlert = alerts[0];
    const alertClass = styles[(latestAlert.severity || 'low').toLowerCase()];

    return (
        <div className={`${styles.banner} ${alertClass}`}>
            <strong>ALERT:</strong> {latestAlert.title}
            <button onClick={() => setAlerts([])} className={styles.closeButton}>×</button>
        </div>
    );
};

export default AlertBanner;