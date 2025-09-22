const { db } = require('../config/firebase');
const alertsCollection = db.collection('alerts');

// Helper function to calculate distance in Kilometers between two lat/lon points
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Fetches all alerts and filters them to find those within a certain radius of the user.
 */
const getNearbyAlerts = async (userLat, userLon) => {
    const snapshot = await alertsCollection.orderBy('timestamp', 'desc').get();
    if (snapshot.empty) {
        return [];
    }
    
    const allAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter alerts to only include those within a 100km radius
    const nearbyAlerts = allAlerts.filter(alert => {
        // If an alert has location data, check if it's within the radius
        if (alert.latitude && alert.longitude) {
            const distance = getDistance(userLat, userLon, alert.latitude, alert.longitude);
            return distance <= 100; // 100km radius
        }
        // If an alert has no location data, it is considered "global" and is shown to everyone
        return true; 
    });

    return nearbyAlerts;
};

/**
 * Creates and stores a new disaster alert, which can optionally include location.
 */
const createAlert = async (alertData) => {
    const { title, message, severity, region, latitude, longitude } = alertData;
    const newAlert = {
        title,
        message,
        severity,
        region,
        latitude: latitude || null,   // Store location if provided
        longitude: longitude || null, // Store location if provided
        timestamp: new Date().toISOString(),
    };
    const docRef = await alertsCollection.add(newAlert);
    return { id: docRef.id, ...newAlert };
};

module.exports = {
    getNearbyAlerts,
    createAlert,
    getDistance,
};