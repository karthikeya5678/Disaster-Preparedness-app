import React, { useState, useEffect, useRef } from 'react';
import styles from './EarthquakeDrillGame.module.css';
import { auth } from '../../lib/firebase';
import client from '../../api/client';

const EarthquakeDrillGame: React.FC = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
    const [feedback, setFeedback] = useState({ message: '', correct: false });
    const [isShaking, setIsShaking] = useState(false);
    const [timer, setTimer] = useState(15);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const saveScore = async (score: number) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await client.post('/api/progress/game', {
                gameName: 'Earthquake Survivor Drill',
                score: score,
                maxScore: 1
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            console.error("Failed to save game score", error);
        }
    };

    const endGame = (isCorrect: boolean, message: string) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsShaking(false);
        setFeedback({ message, correct: isCorrect });
        saveScore(isCorrect ? 1 : 0);
        setGameState('finished');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const isSafe = e.currentTarget.dataset.safe === 'true';
        const reason = e.currentTarget.dataset.reason || 'That spot is not safe.';
        endGame(isSafe, isSafe ? 'Perfect! A sturdy table is the best protection from falling objects.' : reason);
    };

    const startGame = () => {
        setGameState('playing');
        setIsShaking(true);
        setTimer(15);
        timerRef.current = setInterval(() => {
            setTimer(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
    };
    
    useEffect(() => {
        if (timer <= 0 && gameState === 'playing') {
            endGame(false, "Time's up! In a real earthquake, you must act fast. Let's try again.");
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timer, gameState]);

    const resetGame = () => {
        setGameState('start');
    }

    if (gameState === 'start') {
        return (
             <div className={styles.gameContainer}>
                <div className={styles.startScreen}>
                    <h3>Game: Earthquake Survivor Drill</h3>
                    <p>The ground is about to shake! When it does, drag the person to the safest spot in the room as quickly as you can.</p>
                    <button onClick={startGame} className={styles.playButton}>Start Drill</button>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className={styles.gameContainer}>
                <div className={styles.resultsScreen}>
                    <div className={feedback.correct ? styles.correctIcon : styles.incorrectIcon}>
                        {feedback.correct ? '✓' : '✗'}
                    </div>
                    <h2>{feedback.correct ? 'You Survived!' : 'That Was Dangerous!'}</h2>
                    <p className={styles.feedbackText}>{feedback.message}</p>
                    <button onClick={resetGame} className={styles.playButton}>Try Again</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.gameContainer}>
            <p className={styles.instructions}>
                Drag the person to safety!
            </p>
            <div className={`${styles.gameArea} ${isShaking ? styles.shake : ''}`}>
                <div className={styles.wall}>
                    <div className={styles.window}></div>
                    <div className={styles.shelf}>
                        <div className={`${styles.book} ${isShaking ? styles.fall1 : ''}`}></div>
                        <div className={`${styles.book} ${isShaking ? styles.fall2 : ''}`}></div>
                        <div className={`${styles.vase} ${isShaking ? styles.fall3 : ''}`}></div>
                    </div>
                    <div className={styles.table}></div>
                </div>
                <div className={styles.floor}></div>
                
                <div draggable className={styles.person} onDragStart={(e) => e.dataTransfer.setData("text/plain", "person")}>
                    <span>You</span>
                </div>

                <div className={styles.dropZone} style={{top: '60%', left: '50%', width: '30%', height: '25%'}} data-safe="true" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}></div>
                <div className={styles.dropZone} style={{top: '25%', left: '10%', width: '25%', height: '50%'}} data-safe="false" data-reason="Not safe! The window glass could shatter." onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}></div>
                <div className={styles.dropZone} style={{top: '20%', right: '5%', width: '25%', height: '70%'}} data-safe="false" data-reason="Dangerous! The bookshelf and items could fall on you." onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}></div>
            </div>
        </div>
    );
};

export default EarthquakeDrillGame;