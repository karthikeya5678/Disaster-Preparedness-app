import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../lib/AuthContext';
import styles from './ProfilePage.module.css'; // Reuse existing profile page styles
import client from '../api/client';
import { auth } from '../lib/firebase';
import { Link } from 'react-router-dom';

const ManageChildPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [childData, setChildData] = useState({
        fullName: '', schoolName: '', grade: '', city: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChildData = async () => {
            if (!currentUser) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await client.get('/api/users/my-child', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChildData({
                    fullName: res.data.fullName || '',
                    schoolName: res.data.schoolName || '',
                    grade: res.data.grade || '',
                    city: res.data.city || '',
                });
            } catch (err) {
                console.error(err);
                setError("Could not fetch your child's profile. Please ensure you have linked the correct User ID.");
            } finally {
                setLoading(false);
            }
        };
        fetchChildData();
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChildData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); 
        setError('');
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await client.put('/api/users/my-child', childData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
        } catch (err) {
            setError("Failed to update child's profile.");
        }
    };

    if (loading) {
        return <MainLayout title="Manage Child Profile"><p>Loading child's details...</p></MainLayout>;
    }

    return (
        <MainLayout title="Manage Child Profile">
            <Link to="/dashboard" className={styles.backLink}>&larr; Back to Dashboard</Link>
            <div className={styles.profileContainer}>
                {error ? <p className={styles.messageError}>{error}</p> : (
                    <form onSubmit={handleUpdate} className={styles.profileForm}>
                        <h2>Edit {childData.fullName}'s Details</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName">Full Name</label>
                            <input name="fullName" value={childData.fullName} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="schoolName">School Name</label>
                            <input name="schoolName" value={childData.schoolName} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="grade">Grade / Class</label>
                            <input name="grade" value={childData.grade} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">City</label>
                            <input name="city" value={childData.city} onChange={handleChange} />
                        </div>
                        <button type="submit" className={styles.saveButton}>Save Changes</button>
                        {message && <p className={styles.messageSuccess}>{message}</p>}
                    </form>
                )}
            </div>
        </MainLayout>
    );
};

export default ManageChildPage;