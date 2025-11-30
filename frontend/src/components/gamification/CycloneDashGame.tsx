import React, { useState, useEffect, useRef } from 'react';
import styles from './CycloneDashGame.module.css';
import client from '../../api/client';
import { auth } from '../../lib/firebase';

const CycloneDashGame: React.FC = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
    const [result, setResult] = useState<'won' | 'lost' | null>(null);
    const [timer, setTimer] = useState(12);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const saveScore = async (score: number) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await client.post('/api/progress/game', {
                gameName: 'Cyclone Shelter Dash', score, maxScore: 1
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error("Failed to save score", error); }
    };

    const endGame = (won: boolean) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState('finished');
        setResult(won ? 'won' : 'lost');
        saveScore(won ? 1 : 0);
    };

    const handleBuildingClick = (isSafe: boolean) => {
        // This safety check ensures you can't click after the game is over.
        if (gameState === 'playing') {
            endGame(isSafe);
        }
    };

    const startGame = () => {
        setResult(null);
        setTimer(12);
        setGameState('playing');
        timerRef.current = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);
    };

    useEffect(() => {
        if (timer <= 0 && gameState === 'playing') {
            endGame(false);
        }
        return () => { 
            if (timerRef.current) clearInterval(timerRef.current); 
        };
    }, [timer, gameState]);

    const renderOverlay = () => {
        let title = '';
        let message = '';
        if (gameState === 'start') {
            title = 'Game: Cyclone Shelter Dash';
            message = 'A cyclone warning has been issued! Click on the strongest building to shelter in before the storm hits.';
        } else if (gameState === 'finished') {
            if (result === 'won') {
                title = 'You Made It to Safety!';
                message = 'Excellent choice! A specially designed concrete shelter offers the best protection during a cyclone.';
            } else {
                title = 'Evacuation Failed!';
                message = timer <= 0 ? 'You ran out of time! Evacuation must be swift in a real emergency.' : 'That building is not strong enough to withstand a cyclone.';
            }
        }

        return (
            <div className={styles.overlay}>
                <h3>{title}</h3>
                <p>{message}</p>
                <button onClick={startGame} className={styles.playButton}>
                    {gameState === 'start' ? 'Start Evacuation' : 'Try Again'}
                </button>
            </div>
        );
    };

    return (
        <div className={`${styles.container} ${gameState === 'playing' ? styles.storm : ''}`}>
            {gameState !== 'playing' && renderOverlay()}
            
            <div className={`${styles.rain}`}></div>
            <div className={styles.ground}>
                 <div className={`${styles.tree} ${styles.tree1}`}></div>
                 <div className={`${styles.tree} ${styles.tree2}`}></div>
            </div>

            <div className={`${styles.buildingWrapper} ${styles.hut}`} onClick={() => handleBuildingClick(false)}>
                <div className={styles.building}>🛖</div>
                <span>Weak Hut</span>
            </div>
            <div className={`${styles.buildingWrapper} ${styles.shelter}`} onClick={() => handleBuildingClick(true)}>
                <div className={styles.building}>🏢</div>
                <span>Shelter</span>
            </div>
            <div className={`${styles.buildingWrapper} ${styles.house}`} onClick={() => handleBuildingClick(false)}>
                <div className={styles.building}>🏡</div>
                <span>House</span>
            </div>
        </div>
    );
};

export default CycloneDashGame;