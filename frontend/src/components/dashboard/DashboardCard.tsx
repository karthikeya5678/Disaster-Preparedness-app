import React from 'react';
import type { ReactNode } from 'react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;