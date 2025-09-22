import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const SuperAdminDashboard: React.FC = () => {
    return (
        <MainLayout title="Super Admin Dashboard">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900">Manage Institutions</h3>
                    <p className="mt-2 text-gray-600">Onboard new schools and colleges.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900">Global Analytics</h3>
                    <p className="mt-2 text-gray-600">View preparedness data across all institutions.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                    <p className="mt-2 text-gray-600">Manage global configurations and alerts.</p>
                </div>
                 <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900">Master Content</h3>
                    <p className="mt-2 text-gray-600">Create and edit master education modules.</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default SuperAdminDashboard;