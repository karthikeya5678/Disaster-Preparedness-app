import React from 'react';
import DashboardCard from './DashboardCard';
import styles from './WidgetStyles.module.css';

interface NextDrillCardProps {
    drill: {
        name: string;
        scheduledDate: string;
    } | null;
}

const NextDrillCard: React.FC<NextDrillCardProps> = ({ drill }) => {
    return (
        <DashboardCard title="Next Virtual Drill">
            {drill ? (
                <div className={styles.statContainer}>
                    <span className={styles.mainStat}>{drill.name}</span>
                    <span className={styles.subStat}>
                        Scheduled for: {new Date(drill.scheduledDate).toLocaleDateString()}
                    </span>
                </div>
            ) : (
                <p>No upcoming drills are scheduled. Stay tuned!</p>
            )}
        </DashboardCard>
    );
};

export default NextDrillCard;