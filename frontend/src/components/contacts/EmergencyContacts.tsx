import React from 'react';
import styles from './EmergencyContacts.module.css';
import DashboardCard from '../dashboard/DashboardCard'; // We can reuse our beautiful card component

const EMERGENCY_CONTACTS = [
    { name: 'National Emergency', number: '112', icon: '🚨' },
    { name: 'Police', number: '100', icon: '🚓' },
    { name: 'Fire', number: '101', icon: '🔥' },
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Disaster Helpline', number: '1077', icon: '☎️' }
];

const EmergencyContacts: React.FC = () => {
    return (
        // We wrap the content in our standard DashboardCard for a consistent look
        <DashboardCard title="Emergency Contacts">
            <p className={styles.subtitle}>Quick access to emergency services for your region.</p>
            <div className={styles.contactList}>
                {EMERGENCY_CONTACTS.map(contact => (
                    <div key={contact.name} className={styles.contactRow}>
                        <span className={styles.contactInfo}>
                            <span className={styles.icon}>{contact.icon}</span>
                            {contact.name}
                        </span>
                        <a href={`tel:${contact.number}`} className={styles.callButton}>
                            Call Now
                        </a>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

export default EmergencyContacts;