import React, { useState, useEffect } from 'react';
import styles from './FloodRouteGame.module.css';
import client from '../../api/client';
import { auth } from '../../lib/firebase';

const FLOOD_CELLS = [3, 6, 11, 12, 17, 20, 21];
const START_CELL = 0;
const END_CELL = 24;
const GRID_SIZE = 5;

const FloodRouteGame: React.FC = () => {
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [pathHistory, setPathHistory] = useState<number[]>([START_CELL]);

    const saveScore = async (score: number) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await client.post('/api/progress/game', {
                gameName: 'Flood Escape', score, maxScore: 1
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error("Failed to save game score", error); }
    };

    const handleCellClick = (index: number) => {
        if (gameState !== 'playing' || pathHistory.includes(index)) return;

        const lastPosition = pathHistory[pathHistory.length - 1];
        const playerCol = lastPosition % GRID_SIZE;
        const playerRow = Math.floor(lastPosition / GRID_SIZE);
        const targetCol = index % GRID_SIZE;
        const targetRow = Math.floor(index / GRID_SIZE);

        const isAdjacent = Math.abs(playerCol - targetCol) + Math.abs(playerRow - targetRow) === 1;

        if (isAdjacent) {
            const newPath = [...pathHistory, index];
            setPathHistory(newPath);
        }
    };
    
    // --- NEW: Function to handle undoing the last move ---
    const handleUndo = () => {
        if (gameState !== 'playing' || pathHistory.length <= 1) return; // Can't undo from the start
        
        // Create a new path by removing the last step
        const newPath = pathHistory.slice(0, -1);
        setPathHistory(newPath);
    };

    useEffect(() => {
        const lastPosition = pathHistory[pathHistory.length - 1];
        if (lastPosition === END_CELL) {
            setGameState('won');
            saveScore(1);
        } else if (FLOOD_CELLS.includes(lastPosition)) {
            setGameState('lost');
            saveScore(0);
        }
    }, [pathHistory]);

    const resetGame = () => {
        setPathHistory([START_CELL]);
        setGameState('playing');
    };

    const playerPosition = pathHistory[pathHistory.length - 1];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Flood Escape</h3>
                <p>Click adjacent squares to find a safe path from the 🏠 to the 🆘!</p>
            </div>
            <div className={styles.grid}>
                {Array.from({ length: 25 }).map((_, i) => {
                    let type = 'grass';
                    if (i === START_CELL) type = 'start';
                    if (i === END_CELL) type = 'end';
                    if (FLOOD_CELLS.includes(i)) type = 'water';
                    
                    const isPlayerOnCell = playerPosition === i;
                    const isInPath = pathHistory.includes(i);
                    const isLostWater = gameState === 'lost' && isInPath && FLOOD_CELLS.includes(i);

                    return (
                        <div 
                            key={i} 
                            className={`
                                ${styles.cell} 
                                ${styles[type]} 
                                ${isInPath && !isPlayerOnCell ? styles.path : ''}
                                ${isLostWater ? styles.flooded : ''}
                                ${gameState === 'won' && i === END_CELL ? styles.won : ''}
                            `} 
                            onClick={() => handleCellClick(i)}
                        >
                            {isPlayerOnCell && <div className={styles.player}></div>}
                        </div>
                    );
                })}
            </div>

            {/* --- NEW CONTROL HUB with UNDO BUTTON --- */}
            <div className={styles.controls}>
                <button 
                    onClick={handleUndo} 
                    className={styles.undoButton}
                    disabled={gameState !== 'playing' || pathHistory.length <= 1}
                >
                    Undo Last Move
                </button>
            </div>

            {gameState !== 'playing' && (
                 <div className={styles.overlay}>
                    <h2>{gameState === 'won' ? 'You Reached Safety!' : 'Swept Away!'}</h2>
                    <p>{gameState === 'won' ? 'Excellent! You found a safe route.' : 'You must find a path that does not go through the water.'}</p>
                    <button onClick={resetGame} className={styles.playButton}>Try Again</button>
                </div>
            )}
        </div>
    );
};

export default FloodRouteGame;