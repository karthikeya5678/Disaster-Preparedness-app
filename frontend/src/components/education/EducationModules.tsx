import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import styles from './EducationModules.module.css';

interface Lesson { id: number; }
interface Module {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lessons: Lesson[];
}
interface UserProgress {
    completedLessons: string[];
}

const EducationModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
        if (!currentUser) return;
        try {
            const token = await auth.currentUser?.getIdToken();
            const [moduleRes, progressRes] = await Promise.all([
                axios.get('http://localhost:8080/api/education/modules', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:8080/api/progress', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setModules(moduleRes.data);
            setProgress(progressRes.data);
        } catch (error) {
            console.error("Failed to fetch page data:", error);
        }
    };
    fetchData();
  }, [currentUser]);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Courses</h2>
      <div className={styles.catalogGrid}>
        {modules.map(module => {
            const completedInModule = progress?.completedLessons.filter(id => id.startsWith(module.id)).length || 0;
            const totalLessonsInModule = module.lessons.length || 0;
            const progressPercentage = totalLessonsInModule > 0 ? (completedInModule / totalLessonsInModule) * 100 : 0;

            return (
              <Link to={`/modules/${module.id}`} key={module.id} className={styles.cardLink}>
                <div className={styles.card}>
                  <img src={module.imageUrl} alt={module.title} className={styles.cardImage} />
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{module.title}</h3>
                    <p className={styles.cardDescription}>{module.description}</p>
                  </div>
                  <div className={styles.cardProgressBarContainer}>
                    <div className={styles.cardProgressBar} style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>
              </Link>
            );
        })}
      </div>
    </div>
  );
};

export default EducationModules;