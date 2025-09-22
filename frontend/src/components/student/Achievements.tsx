import React from 'react';
import DashboardCard from '../dashboard/DashboardCard';
import styles from './Achievements.module.css';

interface Badge {
    name: string;
    iconUrl: string;
    courseTitle: string;
}

interface AchievementsProps {
    badges: Badge[];
}

const Achievements: React.FC<AchievementsProps> = ({ badges }) => {
    return (
        <DashboardCard title="My Achievements">
            {badges && badges.length > 0 ? (
                <div className={styles.badgeGrid}>
                    {badges.map((badge, index) => (
                        <div key={index} className={styles.badge} title={`Earned for completing: ${badge.courseTitle}`}>
                            <img src={badge.iconUrl} alt={badge.name} className={styles.badgeIcon} />
                            <span className={styles.badgeName}>{badge.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Complete a course to earn your first badge!</p>
            )}
        </DashboardCard>
    );
};

export default Achievements;