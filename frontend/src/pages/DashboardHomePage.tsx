import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import styles from './DashboardHomePage.module.css';
import client from '../api/client';
import { auth } from '../lib/firebase';
import useGeolocation from '../hooks/useGeolocation';

// Import all necessary components
import StudentDashboardHub from '../components/student/StudentDashboardHub';
import AdminDashboard from './AdminDashboard';
import ParentDashboard from './ParentDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import LocationWidget from '../components/dashboard/LocationWidget';
import RegionalOutlook from '../components/dashboard/RegionalOutlook';
import EmergencyMode from '../components/dashboard/EmergencyMode';

// Define the shape of the location object that will be passed between components
interface Location {
    latitude: number;
    longitude: number;
}
// Define the shape of a high-priority alert
interface ActiveAlert {
    id: string;
    title: string;
    severity: string;
}

const DashboardHomePage: React.FC = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const { location: autoLocation, error: geoError } = useGeolocation();
    const [activeAlert, setActiveAlert] = useState<ActiveAlert | null>(null);

    // Effect to set the initial location from the browser's automatic guess
    useEffect(() => {
        if (autoLocation) {
            setCurrentLocation(autoLocation);
        }
    }, [autoLocation]);

    // This effect checks for high-severity alerts for the user's location
    useEffect(() => {
        const checkAlerts = async () => {
            // Only check for alerts if we have a location and a logged-in user
            if (currentLocation && currentUser) {
                try {
                    const token = await auth.currentUser?.getIdToken();
                    const res = await client.get(`http://localhost:8080/api/alerts?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Find the first alert with "High" severity to trigger emergency mode
                    const highSeverityAlert = res.data.find((a: ActiveAlert) => a.severity === 'High');
                    setActiveAlert(highSeverityAlert || null);
                } catch (error) { 
                    console.error("Could not check for active alerts", error); 
                }
            }
        };
        checkAlerts();
    }, [currentLocation, currentUser]);

    // Show a loading message while authentication is being checked
    if (authLoading) {
        return <p>Loading dashboard...</p>;
    }

    // This should ideally not happen due to the ProtectedRoute, but it's a good safety check
    if (!currentUser) {
        return <p>Could not load user information. Please log in again.</p>;
    }
    
    // --- CRITICAL: EMERGENCY MODE OVERRIDE ---
    // If there is an active high-severity alert, show the EmergencyMode component and nothing else.
    if (activeAlert) {
        return <EmergencyMode activeAlert={activeAlert} />;
    }

    // This function renders the main content area based on the user's role
    const renderDashboardByRole = () => {
        switch (currentUser.role) {
            case 'student':
                return (
                    <div className={styles.roleSpecificContent}>
                        <h1 className={styles.title}>Welcome back, {currentUser.fullName}!</h1>
                        <p className={styles.subtitle}>Here is a summary of your preparedness journey.</p>
                        <StudentDashboardHub />
                    </div>
                );
            case 'admin':
                return <AdminDashboard />;
            case 'parent':
                 return <ParentDashboard />;
            case 'super-admin':
                 return <SuperAdminDashboard />;
            default:
                return (
                    <div className={styles.roleSpecificContent}>
                         <h1 className={styles.title}>Welcome, {currentUser.fullName}!</h1>
                         <p className={styles.subtitle}>Select an option from the sidebar to get started.</p>
                    </div>
                );
        }
    };

    // If there is no emergency, render the normal dashboard layout
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <LocationWidget 
                    initialLocation={currentLocation} 
                    onLocationChange={setCurrentLocation} 
                    initialError={geoError}
                />
            </div>
            
            {renderDashboardByRole()}

            <RegionalOutlook location={currentLocation} />
        </div>
    );
};

export default DashboardHomePage;