import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import styles from './CMS.module.css';

interface CreateDrillFormProps {
    initialData: any | null;
    onDrillCreated: () => void;
    onCancel: () => void;
}

const CreateDrillForm: React.FC<CreateDrillFormProps> = ({ initialData, onDrillCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('Fire Evacuation');
    const [scheduledDate, setScheduledDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setType(initialData.type || 'Fire Evacuation');
            const date = new Date(initialData.scheduledDate);
            const formattedDate = date.toISOString().split('T')[0];
            setScheduledDate(formattedDate);
        } else {
            setName('');
            setType('Fire Evacuation');
            setScheduledDate('');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        const payload = { name, type, scheduledDate, institutionId: currentUser?.institutionId };

        try {
            const token = await auth.currentUser?.getIdToken();
            if (initialData) {
                await client.put(`https://disaster-preparedness-app.onrender.com/api/drills/${initialData.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                setMessage('Drill updated successfully!');
            } else {
                await client.post('/api/drills', payload, { headers: { Authorization: `Bearer ${token}` } });
                setMessage('Drill scheduled successfully!');
            }
            // The real-time listener on the parent page will handle the list update.
            // This function just needs to clear the form.
            onDrillCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save drill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formBox}>
            <h2 className={styles.subheading}>{initialData ? 'Edit Drill Details' : 'Schedule a New Drill'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Drill Name:</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Drill Type:</label>
                    <select value={type} onChange={e => setType(e.target.value)} required>
                        <option>Fire Evacuation</option>
                        <option>Earthquake Drop-Cover-Hold</option>
                        <option>Flood Response</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Date:</label>
                    <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
                </div>
                <div className={styles.actions}>
                    <button type="submit" className={styles.saveButton} disabled={loading}>
                        {loading ? 'Saving...' : (initialData ? 'Update Drill' : 'Schedule Drill')}
                    </button>
                    {initialData && <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancel</button>}
                </div>
                {message && <p className={styles.successMessage}>{message}</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}
            </form>
        </div>
    );
};

export default CreateDrillForm;