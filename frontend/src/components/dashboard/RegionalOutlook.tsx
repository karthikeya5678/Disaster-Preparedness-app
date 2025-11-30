import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { auth } from '../../lib/firebase';
import styles from './RegionalOutlook.module.css';

interface Location { latitude: number; longitude: number; }

interface RegionalOutlookProps {
    location: Location | null; // It receives the location from its parent
}

const RegionalOutlook: React.FC<RegionalOutlookProps> = ({ location }) => {
    const [regionalData, setRegionalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Only fetch data if a location has been set by the parent
            if (location) {
                setLoading(true);
                try {
                    const token = await auth.currentUser?.getIdToken();
                    const res = await client.get(`https://disaster-backend.onrender.com/api/dashboard/regional?lat=${location.latitude}&lon=${location.longitude}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRegionalData(res.data);
                } catch (error) {
                    console.error("Failed to fetch regional data", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [location]); // This effect re-runs every time the 'location' prop from the parent changes

    if (!location) {
        return null; // Don't render if there's no location yet
    }
    
    if (loading) {
        return <div className={styles.container}><p>Loading regional outlook...</p></div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Regional Outlook</h2>
            <div className={styles.grid}>
                {regionalData.map((city, index) => (
                    <div key={index} className={`${styles.card} ${city.activeAlert ? styles.alertBorder : ''}`}>
                       <div className={styles.weather}>
                            <img src={city.icon} alt={city.description} className={styles.icon} />
                            <div className={styles.temp}>{city.temp}°C</div>
                        </div>
                        <div className={styles.location}>
                            <div className={styles.cityName}>{city.name}, {city.country}</div>
                            <div className={styles.description}>{city.description}</div>
                        </div>
                        {city.activeAlert && (
                            <div className={styles.alertInfo}>
                                <strong>ALERT:</strong> {city.activeAlert.title}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegionalOutlook;