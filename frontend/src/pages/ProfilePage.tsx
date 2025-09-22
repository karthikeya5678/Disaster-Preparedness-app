import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth, type UserProfile } from '../lib/AuthContext';
import styles from './ProfilePage.module.css';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isResetting, setIsResetting] = useState(false); // State for password reset loading

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                fullName: currentUser.fullName || '',
                schoolName: currentUser.schoolName || '',
                grade: currentUser.grade || '',
                city: currentUser.city || '',
            });
        }
    }, [currentUser]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); 
        setError('');
        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await axios.put('http://localhost:8080/api/users/profile', profileData, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
        } catch (err) { 
            setError('Error: Could not update profile.'); 
        }
    };

    // --- THIS IS THE FULLY CORRECTED FUNCTION ---
    const handlePasswordReset = async () => {
        setMessage(''); 
        setError('');
        
        if (!currentUser?.email) {
            setError("Could not find your email address. Please try logging out and in again.");
            return;
        }

        setIsResetting(true); // Disable the button and show loading text
        try {
            await sendPasswordResetEmail(auth, currentUser.email);
            setMessage("Password reset link sent! Please check your inbox and spam folder.");
        } catch (err: any) {
            console.error("Firebase Password Reset Error:", err);
            setError("Failed to send reset email. Please try again later.");
        } finally {
            setIsResetting(false); // Re-enable the button
        }
    };

    if (!currentUser) {
        return <MainLayout title="My Profile"><p>Loading profile...</p></MainLayout>;
    }

    const renderRoleSpecificFields = () => {
        const role = currentUser.role;
        if (role === 'student' || role === 'teacher' || role === 'admin') {
            return (
                <>
                    <div className={styles.formGroup}>
                        <label htmlFor="schoolName">School Name</label>
                        <input name="schoolName" value={profileData.schoolName} onChange={(e) => setProfileData(p => ({...p, schoolName: e.target.value}))} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="grade">Grade / Class</label>
                        <input name="grade" value={profileData.grade} onChange={(e) => setProfileData(p => ({...p, grade: e.target.value}))} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="city">City</label>
                        <input name="city" value={profileData.city} onChange={(e) => setProfileData(p => ({...p, city: e.target.value}))} />
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <MainLayout title="My Profile">
            <Link to="/dashboard" className={styles.backLink}>&larr; Back to Dashboard</Link>
            <div className={styles.profileContainer}>
                <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                    <h2>Edit Your Details</h2>
                    {currentUser.role === 'student' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="uid">Your Unique User ID (for parents)</label>
                            <input id="uid" type="text" value={currentUser.uid} readOnly disabled />
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" value={currentUser.email || ''} disabled />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Your Role</label>
                        <input type="text" value={currentUser.role} disabled />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">Full Name</label>
                        <input name="fullName" value={profileData.fullName} onChange={(e) => setProfileData(p => ({...p, fullName: e.target.value}))} required />
                    </div>
                    {renderRoleSpecificFields()}
                    <button type="submit" className={styles.saveButton}>Save Changes</button>
                    {message && <p className={styles.messageSuccess}>{message}</p>}
                    {error && <p className={styles.messageError}>{error}</p>}
                </form>
                <div className={styles.resetSection}>
                    <h3>Manage Your Password</h3>
                    <p>Click the button below to send a password reset link to your email.</p>
                    <button onClick={handlePasswordReset} className={styles.resetButton} disabled={isResetting}>
                        {isResetting ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;