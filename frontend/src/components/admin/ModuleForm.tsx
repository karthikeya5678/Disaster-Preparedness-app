import React, { useState } from 'react';
import type { Module, Lesson } from '../../pages/ManageModulesPage';
import axios from 'axios';
import { auth } from '../../lib/firebase';
import styles from './CMS.module.css';

interface ModuleFormProps {
    initialData: Module | null;
    onSave: () => void;
    onCancel: () => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ initialData, onSave, onCancel }) => {
    const [module, setModule] = useState<Module>(
        initialData || { title: '', description: '', imageUrl: '', lessons: [] }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModule(prev => ({ ...prev, [name]: value }));
    };

    const handleLessonChange = (index: number, field: keyof Lesson, value: any) => {
        const newLessons = [...module.lessons];
        newLessons[index] = { ...newLessons[index], [field]: value };
        setModule(prev => ({ ...prev, lessons: newLessons }));
    };

    const addLesson = () => {
        const newLesson: Lesson = { id: Date.now(), title: '', type: 'text', content: '' };
        setModule(prev => ({ ...prev, lessons: [...prev.lessons, newLesson] }));
    };

    const removeLesson = (index: number) => {
        const newLessons = module.lessons.filter((_, i) => i !== index);
        setModule(prev => ({ ...prev, lessons: newLessons }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await auth.currentUser?.getIdToken();
            if (module.id) { // Editing existing module
                await axios.put(`http://localhost:8080/api/education/modules/${module.id}`, module, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else { // Creating new module
                await axios.post('http://localhost:8080/api/education/modules', module, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onSave();
        } catch (error) {
            console.error("Failed to save module", error);
            alert('Error: Could not save course.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formBox}>
            <div className={styles.formGroup}>
                <label>Course Title</label>
                <input name="title" value={module.title} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
                <label>Description</label>
                <textarea name="description" value={module.description} rows={3} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
                <label>Image URL</label>
                <input name="imageUrl" value={module.imageUrl} onChange={handleChange} required />
            </div>

            <h3 className={styles.subheading}>Lessons</h3>
            {module.lessons.map((lesson, index) => (
                <div key={index} className={styles.lessonBox}>
                    <input placeholder="Lesson Title" value={lesson.title} onChange={e => handleLessonChange(index, 'title', e.target.value)} />
                    <select value={lesson.type} onChange={e => handleLessonChange(index, 'type', e.target.value as Lesson['type'])}>
                        <option value="text">Text</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                    </select>
                    <textarea placeholder="Content (Text or Video URL)" value={lesson.content} rows={4} onChange={e => handleLessonChange(index, 'content', e.target.value)} />
                    <button type="button" onClick={() => removeLesson(index)} className={`${styles.button} ${styles.deleteButton}`}>Remove Lesson</button>
                </div>
            ))}
            <button type="button" onClick={addLesson} className={styles.button}>+ Add Lesson</button>
            
            <hr className={styles.divider} />
            <div className={styles.actions}>
                <button type="submit" className={styles.saveButton}>Save Course</button>
                <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancel</button>
            </div>
        </form>
    );
};

export default ModuleForm;