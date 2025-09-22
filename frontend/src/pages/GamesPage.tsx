import React, { useState } from 'react';
import styles from './GamesPage.module.css';
import GameModal from '../components/gamification/GameModal';
import EmergencyKitGame from '../components/gamification/EmergencyKitGame';
import EarthquakeDrillGame from '../components/gamification/EarthquakeDrillGame';
import CycloneDashGame from '../components/gamification/CycloneDashGame';
import FloodRouteGame from '../components/gamification/FloodRouteGame';

type GameId = 'emergencyKit' | 'earthquakeDrill' | 'cycloneDash' | 'floodRoute';

const GAMES_META = {
    emergencyKit: { title: 'Emergency Kit Packer', description: 'A disaster is approaching! Drag the essential items into the backpack before time runs out.', icon: '🎒' },
    earthquakeDrill: { title: 'Earthquake Survivor Drill', description: 'The room is shaking! Drag the person to the safest spot to protect them from falling objects.', icon: '🏠' },
    cycloneDash: { title: 'Cyclone Shelter Dash', description: 'A cyclone warning is issued! Click on the strongest building to find shelter before the storm hits.', icon: '🌪️' },
    floodRoute: { title: 'Flood Route Planner', description: 'The city is flooding! Draw a safe path from the house to the relief shelter, avoiding the water.', icon: '🗺️' }
};

const GamesPage: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

    const renderGame = (gameId: GameId | null) => {
        switch (gameId) {
            case 'emergencyKit': return <EmergencyKitGame />;
            case 'earthquakeDrill': return <EarthquakeDrillGame />;
            case 'cycloneDash': return <CycloneDashGame />;
            case 'floodRoute': return <FloodRouteGame />;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className={styles.title}>Learning Games Arcade</h1>
            <p className={styles.subtitle}>
                Test your knowledge and skills with these interactive challenges!
            </p>
            
            <div className={styles.gameGrid}>
                {Object.keys(GAMES_META).map(key => {
                    const game = GAMES_META[key as GameId];
                    return (
                        <div key={key} className={styles.gameCard}>
                            <div className={styles.cardIcon}>{game.icon}</div>
                            <h2 className={styles.gameTitle}>{game.title}</h2>
                            <p className={styles.gameDescription}>{game.description}</p>
                            <button onClick={() => setSelectedGame(key as GameId)} className={styles.playButton}>Play Now</button>
                        </div>
                    );
                })}
            </div>

            {selectedGame && (
                <GameModal onClose={() => setSelectedGame(null)} title={GAMES_META[selectedGame].title}>
                    {renderGame(selectedGame)}
                </GameModal>
            )}
        </div>
    );
};

export default GamesPage;