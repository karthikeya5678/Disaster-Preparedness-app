import React, { useState, useEffect } from 'react';
import { useAuth, type UserProfile } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import client from '../../api/client';
import styles from './StudentParentLinker.module.css';

const StudentParentLinker: React.FC = () => {
    const { currentUser } = useAuth();
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [parents, setParents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!currentUser || !currentUser.institutionId) {
            return; // Wait for user data
        }
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };
            const [studentsRes, parentsRes] = await Promise.all([
                client.get(`https://disaster-preparedness-app.onrender.com/api/teacher/students?institutionId=${currentUser.institutionId}`, { headers }),
                client.get(`https://disaster-preparedness-app.onrender.com/api/teacher/parents`, { headers })
            ]);
            setStudents(studentsRes.data);
            setParents(parentsRes.data);
        } catch (err) {
            setError("An error occurred while loading data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [currentUser]);

    const handleLink = async (studentUid: string, parentUid: string) => {
        if (!parentUid) {
            alert("Please select a parent to link.");
            return;
        }
        try {
            const token = await auth.currentUser?.getIdToken();
            await client.post('/api/teacher/link', { studentUid, parentUid }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Successfully linked parent to student.`);
            fetchData(); // Refresh data after linking
        } catch (error) {
            alert("Failed to link accounts. Please try again.");
        }
    };

    if (loading) return <p>Loading student and parent data...</p>;
    if (error) return <p style={{ color: '#dc2626', fontWeight: 500 }}>{error}</p>;

    return (
        <div className={styles.container}>
            {message && <p className={styles.successMessage}>{message}</p>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Linked Parent</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr><td colSpan={3}>No students found for your institution.</td></tr>
                    ) : (
                        students.map(student => (
                            <tr key={student.uid}>
                                <td>{student.fullName} ({student.email})</td>
                                <td>
                                    {student.parentName ? 
                                        <span className={styles.linkedText}>{student.parentName}</span> :
                                        <select className={styles.parentSelect} id={`parent-select-${student.uid}`}>
                                            <option value="">Select an Unlinked Parent</option>
                                            {parents.map(parent => (
                                                <option key={parent.uid} value={parent.uid}>
                                                    {parent.fullName} ({parent.email})
                                                </option>
                                            ))}
                                        </select>
                                    }
                                </td>
                                <td>
                                    {!student.parentName && (
                                        <button 
                                            className={styles.linkButton}
                                            onClick={() => handleLink(student.uid, (document.getElementById(`parent-select-${student.uid}`) as HTMLSelectElement).value)}
                                        >
                                            Link Parent
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentParentLinker;