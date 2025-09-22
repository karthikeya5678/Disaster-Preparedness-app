import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';

const ClassRoster: React.FC = () => {
  // This data would be fetched from an API
  const students = ['Ananya Sharma', 'Rohan Verma', 'Priya Singh'];

  return (
    <DashboardCard title="My Class Roster">
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {students.map(student => (
          <li key={student} style={{ padding: '0.25rem 0' }}>{student}</li>
        ))}
      </ul>
    </DashboardCard>
  );
};

export default ClassRoster;