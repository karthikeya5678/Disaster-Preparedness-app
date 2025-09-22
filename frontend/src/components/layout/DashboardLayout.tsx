import React, { useState, type ReactNode } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import styles from './DashboardLayout.module.css';
import AlertBanner from '../alerts/AlertBanner';
import EmergencyModal from '../dashboard/EmergencyModal';

// --- SVG Icons (Included for completeness) ---
const ICONS = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
    courses: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    progress: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    drills: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>,
    games: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    child: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    cms: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
    emergency: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>,
};

const DashboardLayout: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);

    const handleLogout = async () => {
        try { await signOut(auth); navigate('/login'); } 
        catch (error) { console.error("Failed to log out", error); }
    };

    // --- THIS IS THE FIX for the invisible avatar initials ---
    const getInitials = (name?: string) => {
        // This function is now more robust. It handles cases where the name is missing.
        if (!name) return 'U'; // Return 'U' for 'User' if name is not available
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    };

    const renderNavLinks = () => {
        const role = currentUser?.role;
        const links: { path: string; label: string; icon: ReactNode }[] = [];

        if (role === 'student') {
            links.push({ path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard });
            links.push({ path: '/dashboard/courses', label: 'Courses', icon: ICONS.courses });
            links.push({ path: '/dashboard/progress', label: 'My Progress', icon: ICONS.progress });
            links.push({ path: '/dashboard/drills', label: 'Drills', icon: ICONS.drills });
            links.push({ path: '/dashboard/games', label: 'Games', icon: ICONS.games });
        } else if (role === 'teacher' || role === 'admin') {
            links.push({ path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard });
            links.push({ path: '/dashboard/manage-students', label: 'Manage Students', icon: ICONS.child });
            links.push({ path: '/dashboard/manage-drills', label: 'Manage Drills', icon: ICONS.drills });
        } else if (role === 'parent') {
            links.push({ path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard });
            links.push({ path: '/dashboard/child-progress', label: "Child's Progress", icon: ICONS.child });
        } else if (role === 'super-admin') {
            links.push({ path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard });
            links.push({ path: '/manage-modules', label: 'Manage Content', icon: ICONS.cms });
            links.push({ path: '/dashboard/manage-drills', label: 'Manage Drills', icon: ICONS.drills });
        }

        return links.map(link => (
            <li key={link.path}>
                <NavLink to={link.path} end className={({ isActive }) => isActive ? styles.active : ''}>
                    <span className={styles.icon}>{link.icon}</span>
                    {link.label}
                </NavLink>
            </li>
        ));
    };

    return (
        <div className={styles.dashboardContainer}>
            <nav className={styles.sidebar}>
                <div className={styles.sidebarMain}>
                    <div className={styles.sidebarHeader}><h3>DisasterReady</h3></div>
                    <div className={styles.navListWrapper}>
                        <ul className={styles.navList}>{renderNavLinks()}</ul>
                    </div>
                </div>
                
                <div className={styles.sidebarFooter}>
                    <button className={styles.emergencyButton} onClick={() => setEmergencyModalOpen(true)}>
                        <span className={styles.icon}>{ICONS.emergency}</span>
                        Emergency Hub
                    </button>
                    <div className={styles.userProfile}>
                        <Link to="/dashboard/profile" className={styles.profileLink}>
                            <div className={styles.avatar}>{getInitials(currentUser?.fullName)}</div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{currentUser?.fullName || 'User'}</span>
                                <span className={styles.userRole}>{currentUser?.role}</span>
                            </div>
                        </Link>
                        {/* --- THIS IS THE FIX for the logout button --- */}
                        <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
                            {/* The SVG is now wrapped in a span to prevent it from stealing the click */}
                            <span>{ICONS.logout}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>
                <AlertBanner />
                <Outlet />
            </main>

            {isEmergencyModalOpen && <EmergencyModal onClose={() => setEmergencyModalOpen(false)} />}
        </div>
    );
};

export default DashboardLayout;