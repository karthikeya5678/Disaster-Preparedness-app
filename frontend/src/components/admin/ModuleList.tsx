import React from 'react';
import type { Module } from '../../pages/ManageModulesPage';
import client from '../../api/client';
import { auth } from '../../lib/firebase';
import styles from './CMS.module.css';

interface ModuleListProps {
    modules: Module[];
    onEdit: (module: Module) => void;
    onDelete: () => void;
}

const ModuleList: React.FC<ModuleListProps> = ({ modules, onEdit, onDelete }) => {
    const handleDelete = async (moduleId: string) => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                const token = await auth.currentUser?.getIdToken();
                await client.delete(`https://disaster-preparedness-app.onrender.com/api/education/modules/${moduleId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onDelete();
            } catch (error) {
                console.error("Failed to delete module", error);
                alert('Error: Could not delete course.');
            }
        }
    };

    return (
        <div className={styles.listBox}>
            {modules.length === 0 && <p>No courses found. Create one to get started!</p>}
            {modules.map(module => (
                <div key={module.id} className={styles.listItem}>
                    <span className={styles.listItemTitle}>{module.title}</span>
                    <div className={styles.listItemActions}>
                        <button onClick={() => onEdit(module)} className={styles.button}>Edit</button>
                        <button onClick={() => handleDelete(module.id!)} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ModuleList;