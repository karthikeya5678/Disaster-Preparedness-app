import React from 'react';
import CreateDrillForm from '../components/admin/CreateDrillForm';
import AnalyticsOverview from '../components/analytics/AnalyticsOverview';

const AdminDashboard: React.FC = () => {
    // This component now ONLY returns its specific content, not the whole layout.
    return (
        <div>
            <AnalyticsOverview />
            <CreateDrillForm />
        </div>
    );
};

export default AdminDashboard;