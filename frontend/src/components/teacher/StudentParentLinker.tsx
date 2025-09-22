import React, { useState, useEffect } from 'react';
import { useAuth, type UserProfile } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import axios from 'axios';
import styles from './StudentParentLinker.module.css';

const StudentParentLinker: React.FC = () => {
    const { currentUser } = useAuth();
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [parents, setParents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- THIS IS THE CRITICAL FIX ---
    // This useEffect hook is now more robust. It correctly waits for all necessary data.
    useEffect(() => {
        const fetchData = async () => {
            // First, ensure the user object is fully loaded.
            if (!currentUser) {
                // If there's no user at all, we're still authenticating. Wait.
                return;
            }
            // Next, ensure the user has an institutionId.
            if (!currentUser.institutionId) {
                // If there's no institution ID, it's a data error for a teacher.
                // We show an error message instead of getting stuck.
                setError("Your teacher account is not associated with an institution. Please contact an administrator.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setMessage('');
            setError('');
            try {
                const token = await auth.currentUser?.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };
                // Fetch students and parents in parallel for speed.
                const [studentsRes, parentsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/teacher/students?institutionId=${currentUser.institutionId}`, { headers }),
                    axios.get(`http://localhost:8080/api/teacher/parents`, { headers })
                ]);
                setStudents(studentsRes.data);
                setParents(parentsRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setError("An error occurred while loading student and parent data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]); // This effect correctly re-runs when the currentUser object is fully loaded.

    const handleLink = async (studentUid: string, parentUid: string) => {
        if (!parentUid) {
            alert("Please select a parent from the dropdown list to link.");
            return;
        }
        try {
            const token = await auth.currentUser?.getIdToken();
            await axios.post('http://localhost:8080/api/teacher/link', { studentUid, parentUid }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Successfully linked parent to student.`);
            // After linking, refetch data to update the lists
            const headers = { Authorization: `Bearer ${token}` };
            const [studentsRes, parentsRes] = await Promise.all([
                 axios.get(`http://localhost:8080/api/teacher/students?institutionId=${currentUser!.institutionId}`, { headers }),
                 axios.get(`http://localhost:8080/api/teacher/parents`, { headers })
            ]);
            setStudents(studentsRes.data);
            setParents(parentsRes.data);
        } catch (error) {
            alert("Failed to link accounts. Please try again.");
        }
    };

    // if (loading) return <p>Loading student and parent data...</p>;
    // if (error) return <p style={{ color: '#dc2626', fontWeight: 500 }}>{error}</p>;

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
                    {students.length === 0 && (
                        <tr><td colSpan={3}>No students found for your institution.</td></tr>
                    )}
                    {students.map(student => (
                        <tr key={student.uid}>
                            <td>{student.fullName} ({student.email})</td>
                            <td>
                                {student.parentName ? 
                                    <span className={styles.linkedText}>{student.parentName}</span> :
                                    <select className={styles.parentSelect} id={`parent-select-${student.uid}`}>
                                        <option value="">Select an Unlinked Parent</option>
                                        {parents.length === 0 && <option disabled>No unlinked parents available</option>}
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
                                        onClick={() => handleLink(
                                            student.uid, 
                                            (document.getElementById(`parent-select-${student.uid}`) as HTMLSelectElement).value
                                        )}
                                    >
                                        Link Parent
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentParentLinker;