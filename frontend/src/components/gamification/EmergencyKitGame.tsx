import React, { useState, useEffect } from 'react';
import styles from './EmergencyKitGame.module.css';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import axios from 'axios';

const ALL_ITEMS = [
    { name: 'Water Bottle', correct: true, emoji: '💧' },
    { name: 'First-Aid Kit', correct: true, emoji: '🩹' },
    { name: 'Flashlight', correct: true, emoji: '🔦' },
    { name: 'Video Game', correct: false, emoji: '🎮' },
    { name: 'Pizza Slice', correct: false, emoji: '🍕' },
    { name: 'Batteries', correct: true, emoji: '🔋' },
    { name: 'Canned Food', correct: true, emoji: '🥫' },
    { name: 'Soccer Ball', correct: false, emoji: '⚽' },
    { name: 'Whistle', correct: true, emoji: '📣' },
];
const CORRECT_ITEM_COUNT = ALL_ITEMS.filter(item => item.correct).length;

const EmergencyKitGame: React.FC = () => {
    const [items, setItems] = useState(ALL_ITEMS);
    const [kit, setKit] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
    const [timer, setTimer] = useState(30);
    useAuth();

    useEffect(() => {
        if (gameState === 'playing' && timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            finishGame();
        }
    }, [timer, gameState]);

    const handleDragStart = (e: React.DragEvent, item: any) => {
        e.dataTransfer.setData("itemName", item.name);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const itemName = e.dataTransfer.getData("itemName");
        const item = items.find(i => i.name === itemName);
        if (item && !kit.some(k => k.name === item.name)) {
            setKit(prev => [...prev, item]);
            setItems(prev => prev.filter(i => i.name !== item.name));
        }
    };

    const finishGame = async () => {
        setGameState('finished');
        let finalScore = 0;
        kit.forEach(item => {
            if (item.correct) {
                finalScore++;
            }
        });
        setScore(finalScore);
        
        // Save score to backend
        try {
            const token = await auth.currentUser?.getIdToken();
            await axios.post('http://localhost:8080/api/progress/game', {
                gameName: 'Emergency Kit Packer',
                score: finalScore,
                maxScore: CORRECT_ITEM_COUNT
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            console.error("Failed to save game score", error);
        }
    };

    const resetGame = () => {
        setItems(ALL_ITEMS);
        setKit([]);
        setScore(0);
        setTimer(30);
        setGameState('playing');
    };

    if (gameState === 'finished') {
        return (
            <div className={styles.resultsScreen}>
                <h2>Time's Up!</h2>
                <p className={styles.scoreText}>You packed {score} out of {CORRECT_ITEM_COUNT} correct items!</p>
                <div className={styles.review}>
                    <h3>Your Kit:</h3>
                    {kit.map(item => (
                        <span key={item.name} className={item.correct ? styles.correct : styles.incorrect}>
                            {item.emoji} {item.name}
                        </span>
                    ))}
                </div>
                <button onClick={resetGame} className={styles.playAgainButton}>Play Again</button>
            </div>
        );
    }
    
    return (
        <div className={styles.gameContainer}>
            <div className={styles.timer}>Time Left: {timer}s</div>
            <div className={styles.gameArea}>
                <div className={styles.itemPool}>
                    <h3>Available Items</h3>
                    {items.map(item => (
                        <div key={item.name} draggable onDragStart={(e) => handleDragStart(e, item)} className={styles.item}>
                            {item.emoji} {item.name}
                        </div>
                    ))}
                </div>
                <div className={styles.dropZone} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                    <h3>Drag Correct Items Here</h3>
                    <div className={styles.backpack}>🎒</div>
                    <div className={styles.kitItems}>
                        {kit.map(item => <div key={item.name} className={styles.itemInKit}>{item.emoji}</div>)}
                    </div>
                </div>
            </div>
            <button onClick={finishGame} className={styles.finishButton}>Finish Packing</button>
        </div>
    );
};

export default EmergencyKitGame;