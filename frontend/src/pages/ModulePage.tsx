import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import styles from './ModulePage.module.css';
import Quiz from '../components/gamification/Quiz';

// --- Interfaces (No changes needed) ---
interface Question { q: string; options: string[]; answer: string; }
interface Lesson { id: number; title: string; type: 'video' | 'text' | 'quiz'; content: string; questions?: Question[]; }
interface Module { id: string; title: string; description: string; lessons: Lesson[]; }
interface UserProgress { completedLessons: string[]; }


// --- Video Player Component (No changes needed) ---
const VideoPlayer: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideoUrl = async () => {
            setIsLoading(true);
            setError('');
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await client.get(`http://localhost:8080/api/education/video-url/${lesson.content}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVideoUrl(res.data.url);
            } catch (err) {
                console.error("Could not fetch video URL", err);
                setError('Could not load video.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideoUrl();
    }, [lesson.content]);

    if (isLoading) return <p>Loading video...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    
    return (
        <div className={styles.videoContainer}>
            <video key={videoUrl} controls controlsList="nodownload" width="100%">
                <source src={videoUrl!} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};


// --- Main ModulePage Component (This is where the fixes are) ---
const ModulePage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const [moduleData, setModuleData] = useState<Module | null>(null);
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true); // FIX: This state variable was missing
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser || !moduleId) return;
            setIsLoading(true);
            try {
                const token = await auth.currentUser?.getIdToken();
                const [moduleRes, progressRes] = await Promise.all([
                    client.get(`http://localhost:8080/api/education/modules/${moduleId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    client.get('/api/progress', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                setModuleData(moduleRes.data);
                setProgress(progressRes.data);

                if (moduleRes.data.lessons?.length > 0) {
                    setCurrentLesson(moduleRes.data.lessons[0]);
                }
            } catch (error) {
                console.error("Failed to fetch page data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser, moduleId]);

    // FIX: This function was incorrect. It now sends all users back to the main dashboard.
    const getDashboardPath = () => {
        return '/dashboard';
    };

    const handleMarkAsComplete = async (lessonId: number) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await client.post('/api/progress/complete', 
                { moduleId: moduleId!, lessonId: lessonId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const progressRes = await client.get('/api/progress', { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setProgress(progressRes.data);
        } catch (error) {
            console.error("Failed to mark lesson as complete", error);
        }
    };

    const renderLessonContent = (lesson: Lesson) => {
        const isCompleted = progress?.completedLessons.includes(`${moduleId}_${lesson.id}`);
        const completeButton = !isCompleted ? (
            <button onClick={() => handleMarkAsComplete(lesson.id)} className={styles.completeButton}>Mark as Complete</button>
        ) : (
            <div className={styles.completedMessage}>✓ Completed</div>
        );

        switch (lesson.type) {
            case 'video': return <div><VideoPlayer lesson={lesson} />{completeButton}</div>;
            case 'text': return <div><div className={styles.textContent}>{lesson.content}</div>{completeButton}</div>;
            case 'quiz': return lesson.questions ? <Quiz questions={lesson.questions} moduleId={moduleId!} lessonId={lesson.id} /> : <p>Quiz not available.</p>;
            default: return <p>Unsupported lesson type.</p>;
        }
    };

    if (isLoading) {
        return <MainLayout title="Loading Course..."><p>Loading...</p></MainLayout>;
    }
    if (!moduleData) {
        return <MainLayout title="Error"><p>Could not find the requested course.</p></MainLayout>;
    }

    const completedInModule = progress?.completedLessons.filter(id => id.startsWith(moduleId!)).length || 0;
    const totalLessonsInModule = moduleData.lessons.length || 0;
    const progressPercentage = totalLessonsInModule > 0 ? (completedInModule / totalLessonsInModule) * 100 : 0;

    return (
        <MainLayout title={moduleData.title}>
            <Link to={getDashboardPath()} className={styles.backLink}>&larr; Back to Dashboard</Link>

            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }}></div>
                <span className={styles.progressText}>{completedInModule} / {totalLessonsInModule} Lessons Completed</span>
            </div>

            <div className={styles.courseLayout}>
                <aside className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>Course Content</h3>
                    <ul className={styles.lessonList}>
                        {moduleData.lessons && moduleData.lessons.map((lesson) => {
                            const isCompleted = progress?.completedLessons.includes(`${moduleId}_${lesson.id}`);
                            return (
                                <li
                                    key={lesson.id}
                                    className={`${styles.lessonItem} ${currentLesson?.id === lesson.id ? styles.activeLesson : ''} ${isCompleted ? styles.completedLesson : ''}`}
                                    onClick={() => setCurrentLesson(lesson)}
                                >
                                    {isCompleted && <span className={styles.checkmark}>✓</span>}
                                    {lesson.title}
                                </li>
                            );
                        })}
                    </ul>
                </aside>
                <section className={styles.mainContent}>
                    {currentLesson ? (
                        <div>
                            <h2 className={styles.lessonTitle}>{currentLesson.title}</h2>
                            {renderLessonContent(currentLesson)}
                        </div>
                    ) : (
                        <p>Select a lesson to begin.</p>
                    )}
                </section>
            </div>
        </MainLayout>
    );
};

export default ModulePage;

// FIX: The incorrect function at the bottom of the file has been removed.