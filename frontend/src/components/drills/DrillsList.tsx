import React from 'react';
import client from '../../api/client';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import styles from './DrillsList.module.css';

interface Drill {
  id: string; name: string; type: string; scheduledDate: string;
  participants: string[]; participantsCount: number; totalStudents: number; participationRate: number;
}

interface DrillsListProps {
    drills: Drill[];
    onAction: () => void;
    onEdit?: (drill: Drill) => void;
}

const DrillsList: React.FC<DrillsListProps> = ({ drills, onAction, onEdit }) => {
    const { currentUser } = useAuth();
    const isManager = currentUser?.role === 'admin' || currentUser?.role === 'super-admin';
    const isTeacher = currentUser?.role === 'teacher';
    const isStudent = currentUser?.role === 'student';

    const handleParticipate = async (drillId: string) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await client.patch(`http://localhost:8080/api/drills/${drillId}/participate`, {}, { headers: { Authorization: `Bearer ${token}` } });
            onAction();
        } catch (error) { alert("There was an error recording your participation."); }
    };

    const handleDelete = async (drillId: string) => {
        if (window.confirm("Are you sure you want to delete this drill?")) {
            try {
                const token = await auth.currentUser?.getIdToken();
                await client.delete(`http://localhost:8080/api/drills/${drillId}`, { headers: { Authorization: `Bearer ${token}` } });
                onAction();
            } catch (error) { alert("Failed to delete drill."); }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{isStudent ? "My Assigned Drills" : "Scheduled Drills Overview"}</h2>
            {!drills || drills.length === 0 ? <p>No drills are currently scheduled.</p> : (
                <ul className={styles.list}>
                    {drills.map(drill => {
                        const hasParticipated = (drill.participants || []).includes(currentUser!.uid);
                        return (
                            <li key={drill.id} className={styles.listItem}>
                                <div className={styles.drillInfo}>
                                    <span className={styles.drillName}>{drill.name}</span>
                                    <span className={styles.drillDate}>Due: {new Date(drill.scheduledDate).toLocaleDateString()}</span>
                                </div>
                                {(isManager || isTeacher) && (
                                    <div className={styles.stats}>
                                        {drill.participationRate}% Complete
                                        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${drill.participationRate}%` }}></div></div>
                                        <span className={styles.participantCount}>{drill.participantsCount} / {drill.totalStudents} Students</span>
                                    </div>
                                )}
                                {isManager && onEdit && (
                                    <div className={styles.managerActions}>
                                        <button onClick={() => onEdit(drill)} className={styles.editButton}>Edit</button>
                                        <button onClick={() => handleDelete(drill.id)} className={styles.deleteButton}>Delete</button>
                                    </div>
                                )}
                                {isStudent && (
                                    <button onClick={() => handleParticipate(drill.id)} disabled={hasParticipated} className={hasParticipated ? styles.completedButton : styles.actionButton}>
                                        {hasParticipated ? "✓ Completed" : "Participate"}
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default DrillsList;