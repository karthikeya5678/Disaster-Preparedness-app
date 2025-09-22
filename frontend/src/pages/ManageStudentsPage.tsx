import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import StudentParentLinker from '../components/teacher/StudentParentLinker';

const ManageStudentsPage: React.FC = () => {
    return (
        <MainLayout title="Manage Student & Parent Links">
            <p style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.125rem', color: '#4b5563' }}>
                Use this page to view all students in your institution and link them to their parent accounts.
            </p>
            <StudentParentLinker />
        </MainLayout>
    );
};

export default ManageStudentsPage;