import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { auth } from '../../lib/firebase';
import styles from './LocationWidget.module.css';

interface Location { latitude: number; longitude: number; }

interface LocationWidgetProps {
    initialLocation: Location | null;
    onLocationChange: (newLocation: Location) => void; // A function to tell the parent about changes
    initialError: string | null;
}

const LocationWidget: React.FC<LocationWidgetProps> = ({ initialLocation, onLocationChange, initialError }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState('');
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        const fetchAutoWeather = async () => {
            if (initialLocation) {
                setLoading(true);
                try {
                    const token = await auth.currentUser?.getIdToken();
                    const res = await client.get(`http://localhost:8080/api/weather?lat=${initialLocation.latitude}&lon=${initialLocation.longitude}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setWeather(res.data);
                } catch (error) { console.error("Could not fetch weather for initial location:", error); } 
                finally { setLoading(false); }
            } else if (initialError) {
                setLoading(false);
            }
        };
        fetchAutoWeather();
    }, [initialLocation, initialError]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCity) return;
        setLoading(true);
        setSearchError('');
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await client.get(`http://localhost:8080/api/weather/by-city?q=${searchCity}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWeather(res.data); // Update this widget's own display
            
            // CRITICAL: Tell the parent component about the new location coordinates
            onLocationChange({ latitude: res.data.coord.lat, longitude: res.data.coord.lon });
        } catch (err) {
            setSearchError(`Could not find "${searchCity}". Please check the spelling.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {loading && <p>Loading location data...</p>}
            {initialError && !weather && <p className={styles.error}>{initialError}</p>}
            
            {weather && (
                <div className={styles.weatherDisplay}>
                    <div className={styles.weatherInfo}>
                        <span className={styles.city}>{weather.city}</span>
                        <span className={styles.temp}>{weather.temperature}°C</span>
                    </div>
                    <div className={styles.weatherIcon}>
                        <img src={weather.icon} alt={weather.description} />
                        <span>{weather.description}</span>
                    </div>
                </div>
            )}

            <div className={styles.searchSection}>
                 <p className={styles.searchLabel}>Location inaccurate? Search for your city:</p>
                 <form onSubmit={handleSearch} className={styles.form}>
                    <input 
                        type="text"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        placeholder="E.g., Kolluru, Guntur"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? '...' : 'Search'}
                    </button>
                </form>
                {searchError && <p className={styles.error}>{searchError}</p>}
            </div>
        </div>
    );
};

export default LocationWidget;