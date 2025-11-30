import React, { useState, useEffect } from 'react';
import client from '../../api/client';
// These are the correct relative paths from this file's location
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import styles from '../Feature.module.css';

interface Drill {
  id: string;
  name: string;
  type: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed';
  participants: string[];
}

const Drills: React.FC = () => {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const fetchDrills = async () => {
      if (!currentUser || !currentUser.institutionId) {
        setError("Could not find your institution ID. Please ensure your profile is set up correctly.");
        setLoading(false);
        return;
      }
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await client.get(`http://localhost:8080/api/drills?institutionId=${currentUser.institutionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrills(res.data);
      } catch (err) {
        console.error("Failed to fetch drills", err);
        setError("An error occurred while fetching drills data.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDrills();
  }, [currentUser]);

  const handleParticipate = async (drillId: string) => {
    if (!currentUser || !currentUser.institutionId) {
      setError("Could not find your institution ID. Please ensure your profile is set up correctly.");
      return;
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      await client.post(
        `http://localhost:8080/api/drills/participate`,
        {
          drillId,
          userId: currentUser.uid,
          institutionId: currentUser.institutionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update UI after participation
      setDrills(prevDrills =>
        prevDrills.map(drill =>
          drill.id === drillId
            ? { ...drill, participants: [...drill.participants, currentUser.uid] }
            : drill
        )
      );
    } catch (err) {
      console.error("Failed to participate in drill", err);
      setError("An error occurred while registering your participation.");
    }
  };

  if (loading) {
    return <div className={styles.featureBox}><p>Loading drills...</p></div>;
  }

  if (error) {
    return <div className={styles.featureBox}><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className={styles.featureBox}>
      <h2 className={styles.featureTitle}>Virtual Drills</h2>
      {drills.length === 0 ? (
        <p>There are no drills scheduled for your institution at this time.</p>
      ) : (
        <ul className={styles.list}>
          {drills.map(drill => (
            <li key={drill.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <p className={styles.itemTitle}>{drill.name}</p>
                <p className={styles.itemSubtitle}>
                  {new Date(drill.scheduledDate).toLocaleDateString()} - Status: {drill.status}
                </p>
              </div>
              {drill.status === 'scheduled' && !drill.participants.includes(currentUser!.uid) && (
                <button onClick={() => handleParticipate(drill.id)} className={styles.button}>
                  Participate
                </button>
              )}
              {(drill.status === 'completed' || drill.participants.includes(currentUser!.uid)) && (
                 <button className={`${styles.button} ${styles.buttonCompleted}`} disabled>
                  Completed
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Drills;