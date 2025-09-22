import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';

const MyProgress: React.FC = () => {
  // In a real app, this data would be fetched from an API
  const progress = {
    modulesCompleted: 2,
    modulesTotal: 5,
    lastCompleted: 'Fire Safety',
  };

  return (
    <DashboardCard title="My Progress">
      <p>You have completed <strong>{progress.modulesCompleted}</strong> out of <strong>{progress.modulesTotal}</strong> modules.</p>
      <p style={{ marginTop: '0.5rem' }}>Last completed: <strong>{progress.lastCompleted}</strong></p>
    </DashboardCard>
  );
};

export default MyProgress;