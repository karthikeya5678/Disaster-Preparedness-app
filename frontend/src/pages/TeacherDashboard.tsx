import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Drills from '../components/drills/Drills';
import ClassRoster from '../components/teacher/ClassRoster'; // Import teacher component
import DashboardCard from '../components/dashboard/DashboardCard';

const TeacherDashboard: React.FC = () => {
    return (
        <MainLayout title="Teacher Dashboard">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <ClassRoster />
                <DashboardCard title="Student Progress">
                    <p>Track module completion for your students.</p>
                </DashboardCard>
            </div>
            <Drills />
        </MainLayout>
    );
};

export default TeacherDashboard;