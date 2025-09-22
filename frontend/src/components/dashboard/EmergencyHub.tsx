import React from 'react';
import styles from './EmergencyHub.module.css';

// Using the correct, nationally recognized emergency numbers for India.
const EMERGENCY_CONTACTS = [
    { name: 'National Emergency', number: '112', icon: '🚨' },
    { name: 'Police', number: '100', icon: '🚓' },
    { name: 'Fire', number: '101', icon: '🔥' },
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Disaster Helpline', number: '1077', icon: '☎️' }
];

const EmergencyHub: React.FC = () => {
    return (
        <div className={styles.hubContainer}>
            <h3 className={styles.title}>Emergency Hub</h3>
            <p className={styles.subtitle}>Quick access to emergency services.</p>
            <div className={styles.contactList}>
                {EMERGENCY_CONTACTS.map(contact => (
                    <div key={contact.name} className={styles.contactRow}>
                        <span className={styles.contactInfo}>
                            <span className={styles.icon}>{contact.icon}</span>
                            {contact.name}
                        </span>
                        {/* The 'tel:' link will open the phone's dialer */}
                        <a href={`tel:${contact.number}`} className={styles.callButton}>
                            Call
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmergencyHub;