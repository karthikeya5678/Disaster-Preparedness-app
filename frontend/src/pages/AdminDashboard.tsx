import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/dashboard/DashboardCard';
import styles from './ParentDashboard.module.css'; // Reuse parent styles for consistency

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h1 className={styles.title}>Administrator Dashboard</h1>
            <p className={styles.subtitle}>Manage your institution's users and preparedness activities.</p>
            <div className={styles.cardGrid}>
                <DashboardCard title="Manage Students & Parents">
                    <p>View all students in your institution and link them to their parent accounts.</p>
                    <Link to="/dashboard/manage-students" className={styles.cardLink}>
                        Go to Student Management &rarr;
                    </Link>
                </DashboardCard>
                <DashboardCard title="Manage Drills">
                    <p>Create, edit, and view participation statistics for institutional drills.</p>
                     <Link to="/dashboard/manage-drills" className={styles.cardLink}>
                        Go to Drill Management &rarr;
                    </Link>
                </DashboardCard>
            </div>
        </div>
    );
};

export default AdminDashboard;