import React from 'react';
import DashboardCard from './DashboardCard';
import styles from './WidgetStyles.module.css';

interface ProgressCardProps {
    score: string;
    completed: number;
    total: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ score, completed, total }) => {
    return (
        <DashboardCard title="My Preparedness Score">
            <div className={styles.statContainer}>
                <span className={styles.mainStat}>{score}</span>
                <span className={styles.subStat}>You have completed {completed} of {total} lessons.</span>
            </div>
        </DashboardCard>
    );
};

export default ProgressCard;