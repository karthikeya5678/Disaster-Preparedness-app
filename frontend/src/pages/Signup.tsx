import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css'; // Use the correct, shared stylesheet

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('student');
    const [institutionId, setInstitutionId] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [grade, setGrade] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { return setError("Password must be at least 6 characters long."); }
        
        // Institution ID is now correctly not required for parents during signup.
        const isInstitutionIdRequired = role !== 'parent';
        if (isInstitutionIdRequired && !institutionId) { return setError('Institution ID is required for this role.'); }

        try {
            // The incorrect childUid field has been completely removed from the data payload.
            await axios.post('http://localhost:8080/api/auth/register', {
                email, password, fullName, role, 
                institutionId: institutionId || null,
                schoolName: schoolName || null,
                grade: grade || null,
                city: city || null,
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to register.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <div><h1 className={styles.panelHeader}>DisasterReady</h1></div>
                <img src="https://img.freepik.com/free-vector/people-volunteering-donating-food-items_53876-66151.jpg?w=826" alt="Community helping each other" className={styles.panelIllustration} />
                <div className={styles.panelQuote}>
                    <p>"The future depends on what you do today."</p>
                    <footer>- Mare Jene</footer>
                </div>
            </div>
            <div className={styles.formContainer}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Create Your Account</h2>
                    <form onSubmit={handleSignup} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName" className={styles.label}>Full Name</label>
                            <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="role" className={styles.label}>I am a:</label>
                            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className={styles.input}>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                                <option value="parent">Parent</option>
                            </select>
                        </div>

                        {/* Institution ID is now correctly hidden for parents */}
                        {role !== 'parent' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="institutionId" className={styles.label}>Institution ID</label>
                                <input id="institutionId" type="text" required={role !== 'parent'} value={institutionId} onChange={(e) => setInstitutionId(e.target.value)} className={styles.input} />
                            </div>
                        )}
                        
                        {/* Grade field is now correctly hidden for Admins */}
                        {(role === 'student' || role === 'teacher' || role === 'admin') && (
                            <>
                                <div className={styles.formGroup}>
                                    <label htmlFor="schoolName" className={styles.label}>School/College Name</label>
                                    <input id="schoolName" type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className={styles.input} />
                                </div>
                                {(role === 'student' || role === 'teacher') && (
                                     <div className={styles.formGroup}>
                                        <label htmlFor="grade" className={styles.label}>Grade / Class</label>
                                        <input id="grade" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className={styles.input} />
                                    </div>
                                )}
                                 <div className={styles.formGroup}>
                                    <label htmlFor="city" className={styles.label}>City</label>
                                    <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={styles.input} />
                                </div>
                            </>
                        )}
                        
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.button}>Sign Up</button>
                    </form>
                    <p className={styles.linkText}>
                        Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;