import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/dashboard/DashboardCard';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <DashboardCard title="Manage Students & Parents">
                    <p>Link student accounts to their parents.</p>
                    <Link to="/dashboard/manage-students" style={{ fontWeight: 500, color: '#4f46e5' }}>
                        Go to Management Page &rarr;
                    </Link>
                </DashboardCard>
                <DashboardCard title="Manage Drills">
                    <p>Create, edit, and view statistics for institutional drills.</p>
                     <Link to="/dashboard/manage-drills" style={{ fontWeight: 500, color: '#4f46e5' }}>
                        Go to Drill Management &rarr;
                    </Link>
                </DashboardCard>
            </div>
        </div>
    );
};

export default AdminDashboard;