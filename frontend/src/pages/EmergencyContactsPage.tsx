import React from 'react';
import EmergencyContacts from '../components/contacts/EmergencyContacts'; // Re-using the component we already built

const EmergencyContactsPage: React.FC = () => {
    return (
        <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                Emergency Contacts
            </h1>
            <p style={{ marginTop: '0.5rem', marginBottom: '2rem', fontSize: '1.125rem', color: '#4b5563' }}>
                Quick access to important national and local emergency services for your region.
            </p>
            
            {/* The main EmergencyContacts component is rendered here, filling the page */}
            <EmergencyContacts />
        </div>
    );
};

export default EmergencyContactsPage;