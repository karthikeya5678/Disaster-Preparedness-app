import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import styles from './MainLayout.module.css';
import AlertBanner from '../alerts/AlertBanner';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {currentUser && <p className={styles.welcomeMessage}>Welcome, {currentUser.fullName}!</p>}
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </header>
      <main className={styles.mainContent}>
        <AlertBanner />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;