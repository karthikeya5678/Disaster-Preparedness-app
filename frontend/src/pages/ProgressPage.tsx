import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import styles from './ProgressPage.module.css';
import Achievements from '../components/student/Achievements';

// Define the structure for badges
interface Badge {
    name: string;
    iconUrl: string;
    courseTitle: string;
}

interface QuizResult {
    moduleTitle: string;
    lessonTitle: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
}

// Update ProgressData to include badges
interface ProgressData {
    completedLessonsCount: number;
    quizResults: QuizResult[];
    earnedBadges: Badge[];
}

const ProgressPage: React.FC = () => {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchProgress = async () => {
            if (!currentUser) return;
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await client.get('/api/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProgress(res.data);
            } catch (error) {
                console.error("Failed to fetch progress data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [currentUser]);

    if (loading) {
        return <p>Loading your progress...</p>;
    }

    if (!progress) {
        return <p>Could not load your progress data.</p>;
    }

    return (
        <div>
            <h1 className={styles.title}>My Progress</h1>
            <div className={styles.summaryBox}>
                You have completed a total of <strong>{progress.completedLessonsCount}</strong> lessons. Keep up the great work!
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <Achievements badges={progress.earnedBadges} />
            </div>

            <div className={styles.resultsContainer}>
                <h2 className={styles.subtitle}>Quiz Results</h2>
                {progress.quizResults.length > 0 ? (
                    <table className={styles.resultsTable}>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Quiz</th>
                                <th>Score</th>
                                <th>Date Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progress.quizResults.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.moduleTitle}</td>
                                    <td>{result.lessonTitle}</td>
                                    <td>
                                        <span className={result.percentage >= 70 ? styles.scoreGood : styles.scoreBad}>
                                            {result.score} / {result.totalQuestions} ({result.percentage}%)
                                        </span>
                                    </td>
                                    <td>{new Date(result.completedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You haven't completed any quizzes yet. Head to the "Courses" tab to get started!</p>
                )}
            </div>
        </div>
    );
};

export default ProgressPage;