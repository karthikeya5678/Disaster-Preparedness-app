import React from 'react';
import styles from './EmergencyModal.module.css';
import EmergencyHub from './EmergencyHub'; // We will place the Hub inside this modal

interface EmergencyModalProps {
    onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
    return (
        // The dark overlay that covers the page
        <div className={styles.overlay} onClick={onClose}>
            {/* The modal itself, which stops click propagation */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Emergency Hub</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.content}>
                    <EmergencyHub />
                </div>
            </div>
        </div>
    );
};

export default EmergencyModal;