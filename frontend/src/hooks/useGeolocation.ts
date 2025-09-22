import { useState, useEffect } from 'react';

interface Location {
    latitude: number;
    longitude: number;
}
interface GeolocationState {
    location: Location | null;
    error: string | null;
}

const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(s => ({ ...s, error: 'Geolocation is not supported by your browser.' }));
            return;
        }

        const onSuccess = (position: GeolocationPosition) => {
            setState({
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                error: null,
            });
        };

        const onError = (error: GeolocationPositionError) => {
            setState(s => ({ ...s, error: `Could not get location: ${error.message}` }));
        };

        // Request location with settings for better accuracy
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    }, []);

    return state;
};

export default useGeolocation;