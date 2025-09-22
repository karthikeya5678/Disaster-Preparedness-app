import React from 'react';
import axios from 'axios';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import styles from './DrillsList.module.css';

// This component now ONLY receives the drills list and displays it.
const DrillsList: React.FC<{ drills: any[] }> = ({ drills }) => {
    const { currentUser } = useAuth();
    const isManager = currentUser?.role === 'admin' || currentUser?.role === 'super-admin';
    const isTeacher = currentUser?.role === 'teacher';
    const isStudent = currentUser?.role === 'student';

    const handleParticipate = async (drillId: string) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await axios.patch(`http://localhost:8080/api/drills/${drillId}/participate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // NO NEED TO REFRESH MANUALLY. The onSnapshot listener will do it for us.
        } catch (error) { alert("There was an error recording your participation."); }
    };

    const handleDelete = async (drillId: string) => {
        if (window.confirm("Are you sure you want to delete this drill?")) {
            try {
                const token = await auth.currentUser?.getIdToken();
                await axios.delete(`http://localhost:8080/api/drills/${drillId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // NO NEED TO REFRESH MANUALLY.
            } catch (error) { alert("Failed to delete drill."); }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{isStudent ? "My Assigned Drills" : "Scheduled Drills Overview"}</h2>
            {drills.length === 0 ? <p>No drills are currently scheduled.</p> : (
                <ul className={styles.list}>
                    {drills.map(drill => {
                        const hasParticipated = (drill.participants || []).includes(currentUser!.uid);
                        return (
                            <li key={drill.id} className={styles.listItem}>
                               {/* ... (The JSX for displaying the drill is the same and is correct) ... */}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default DrillsList;