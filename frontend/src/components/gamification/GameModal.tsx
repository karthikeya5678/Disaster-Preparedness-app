import React, { type ReactNode } from 'react';
import styles from './GameModal.module.css';

interface GameModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

const GameModal: React.FC<GameModalProps> = ({ title, onClose, children }) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default GameModal;