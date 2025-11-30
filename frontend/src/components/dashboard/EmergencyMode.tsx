import React, { useState } from 'react';
import styles from './EmergencyMode.module.css';
import client from '../../api/client';
import { auth } from '../../lib/firebase';

interface Alert {
    id: string;
    title: string;
}
interface EmergencyModeProps {
    activeAlert: Alert;
}

const EmergencyMode: React.FC<EmergencyModeProps> = ({ activeAlert }) => {
    const [status, setStatus] = useState<'unreported' | 'safe' | 'help_needed'>('unreported');
    const [message, setMessage] = useState('');

    const handleCheckIn = async (checkInStatus: 'safe' | 'help') => {
        // Simple confirmation for the SOS button
        if (checkInStatus === 'help') {
            if (!window.confirm("Are you sure you want to send an SOS? This will alert school administrators that you need immediate help.")) {
                return;
            }
        }

        try {
            const token = await auth.currentUser?.getIdToken();
            const payload: any = { alertId: activeAlert.id, status: checkInStatus };

            // For SOS, try to get the user's location
            if (checkInStatus === 'help' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    payload.location = { lat: position.coords.latitude, lon: position.coords.longitude };
                    await sendStatus(token!, payload);
                }, async () => {
                    // Handle case where location is denied but user still needs help
                    await sendStatus(token!, payload);
                });
            } else {
                await sendStatus(token!, payload);
            }
        } catch (error) {
            console.error("Failed to send status", error);
            setMessage("Error: Could not send status.");
        }
    };

    const sendStatus = async (token: string, payload: any) => {
        const res = await client.post('/api/emergency/check-in', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(payload.status);
        setMessage(res.data.message);
    };

    const emergencyContacts = [
        { name: 'Police', number: '100' },
        { name: 'Ambulance', number: '108' },
        { name: 'Fire', number: '101' },
        { name: 'Disaster Helpline', number: '1077' }
    ];

    if (status !== 'unreported') {
        return (
            <div className={styles.container}>
                <div className={styles.confirmation}>
                    <h2>Your Status has been Reported</h2>
                    <p className={status === 'safe' ? styles.safeText : styles.helpText}>
                        {message}
                    </p>
                    <p>Stay safe and follow instructions from authorities.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.alertHeader}>
                <h1>EMERGENCY ALERT</h1>
                <p>{activeAlert.title}</p>
            </div>
            
            <div className={styles.actions}>
                <button className={styles.safeButton} onClick={() => handleCheckIn('safe')}>
                    <span className={styles.icon}>✓</span> I am Safe
                </button>
                <button className={styles.helpButton} onClick={() => handleCheckIn('help')}>
                    <span className={styles.icon}>🆘</span> I Need Help (SOS)
                </button>
            </div>
            
            <div className={styles.contacts}>
                <h3>Quick Emergency Contacts</h3>
                <div className={styles.contactGrid}>
                    {emergencyContacts.map(contact => (
                        <div key={contact.name} className={styles.contactCard}>
                            <span>{contact.name}</span>
                            <div className={styles.contactButtons}>
                                <a href={`tel:${contact.number}`}>Call</a>
                                <a href={`sms:${contact.number}`}>Message</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmergencyMode;