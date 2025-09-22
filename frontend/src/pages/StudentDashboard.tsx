import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import EducationModules from '../components/education/EducationModules';
import Drills from '../components/drills/Drills';
import MyProgress from '../components/student/MyProgress'; // Import student component

const StudentDashboard: React.FC = () => {
  return (
    <MainLayout title="Student Dashboard">
      <div style={{ marginBottom: '1.5rem' }}>
        <MyProgress />
      </div>
      <EducationModules />
      <Drills />
    </MainLayout>
  );
};

export default StudentDashboard;