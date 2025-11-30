import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
// import ModuleForm from '../components/admin/ModuleForm';
import ModuleForm from '../components/admin/ModuleForm'; // Update the path if your ModuleForm is in 'components/admin'
// import ModuleList from '../components/ModuleList'; // Update the path if the file is in a different location
import ModuleList from '../components/admin/ModuleList'; // Update the path if your ModuleList is in 'components/admin'
import client from '../api/client';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';

// These interfaces are needed by the child components, so we export them
export interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  questions?: any[];
}
export interface Module {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  lessons: Lesson[];
}

const ManageModulesPage: React.FC = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const { currentUser } = useAuth();

    const fetchModules = async () => {
        if (!currentUser) return;
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await client.get('/api/education/modules', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setModules(res.data);
        } catch (error) {
            console.error("Failed to fetch modules", error);
        }
    };

    useEffect(() => {
        fetchModules();
    }, [currentUser]);

    const handleSave = () => {
        fetchModules(); // Refresh the list after saving
        setEditingModule(null); // Close the form and reset to "Create New"
    };

    const handleDelete = () => {
        fetchModules(); // Refresh after deleting
    };

    return (
        <MainLayout title="Content Management">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
                <div>
                    <h2>{editingModule ? 'Edit Course' : 'Create New Course'}</h2>
                    <ModuleForm
                        key={editingModule ? editingModule.id : 'new'}
                        initialData={editingModule}
                        onSave={handleSave}
                        onCancel={() => setEditingModule(null)} // Add a cancel button logic
                    />
                </div>
                <div>
                    <h2>Existing Courses</h2>
                    <ModuleList
                        modules={modules}
                        onEdit={setEditingModule}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default ManageModulesPage;