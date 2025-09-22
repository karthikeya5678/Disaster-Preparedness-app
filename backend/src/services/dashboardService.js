const { db } = require('../config/firebase');
const weatherService = require('./weatherService'); 
const alertsService = require('./alertsService');

/**
 * Fetches aggregated data for an administrator's dashboard.
 * This is a mock implementation. A real one would involve more complex queries.
 */
const getAdminDashboardData = async (institutionId) => {
    // Mock data - in a real app, you would query your collections
    const usersSnap = await db.collection('users').where('institutionId', '==', institutionId).get();
    const drillsSnap = await db.collection('drills').where('institutionId', '==', institutionId).get();

    const totalStudents = usersSnap.docs.filter(doc => doc.data().role === 'student').length;
    const totalTeachers = usersSnap.docs.filter(doc => doc.data().role === 'teacher').length;
    const completedDrills = drillsSnap.docs.filter(doc => doc.data().status === 'completed').length;
    
    // Example preparedness score calculation
    const preparednessScore = Math.min(100, (completedDrills * 20) + (totalStudents * 2));

    return {
        totalStudents,
        totalTeachers,
        completedDrills,
        upcomingDrills: drillsSnap.size - completedDrills,
        preparednessScore: `${preparednessScore}%`,
    };
};

/**
 * Fetches and calculates all summary data for a student's dashboard.
 */
const getStudentDashboardData = async (uid, institutionId) => {
    // 1. Fetch user's progress
    const progressDoc = await db.collection('userProgress').doc(uid).get();
    const completedLessons = progressDoc.exists ? progressDoc.data().completedLessons : [];
    const completedCount = completedLessons.length;

    // 2. Fetch all modules to calculate total lessons
    const modulesSnap = await db.collection('educationModules').get();
    let totalLessons = 0;
    modulesSnap.forEach(doc => {
        const module = doc.data();
        if (module.lessons) {
            totalLessons += module.lessons.length;
        }
    });

    // 3. Calculate Preparedness Score
    const preparednessScore = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // 4. Find the next upcoming drill for their institution
    const drillsSnap = await db.collection('drills')
        .where('institutionId', '==', institutionId)
        .where('scheduledDate', '>=', new Date().toISOString())
        .orderBy('scheduledDate', 'asc')
        .limit(1)
        .get();
        
    let nextDrill = null;
    if (!drillsSnap.empty) {
        nextDrill = drillsSnap.docs[0].data();
    }

    return {
        completedLessons: completedCount,
        totalLessons: totalLessons,
        preparednessScore: `${preparednessScore}%`,
        nextDrill: nextDrill,
    };
};

/**
 * Fetches nearby cities' weather and merges it with active disaster alerts to create a regional outlook.
 */
const getRegionalOutlookData = async (lat, lon) => {
    // 1. Fetch weather for the user's location and 4 other nearby cities
    const nearbyCities = await weatherService.getNearbyCitiesWeather(lat, lon);
    
    // 2. Fetch all relevant disaster alerts near the user's location
    const nearbyAlerts = await alertsService.getNearbyAlerts(lat, lon);

    // 3. Merge the two datasets. For each city, check if there is an active alert nearby.
    const regionalData = nearbyCities.map(city => {
        let activeAlert = null;
        // Find the closest high-severity alert to this city (within a 50km radius)
        for (const alert of nearbyAlerts) {
            if (alert.latitude && alert.longitude) {
                const distance = alertsService.getDistance(city.lat, city.lon, alert.latitude, alert.longitude);
                if (distance < 50) { 
                    activeAlert = { title: alert.title, severity: alert.severity };
                    break; // Stop after finding the first alert for this city to keep it simple
                }
            }
        }
        return { ...city, activeAlert }; // Return the city data with an attached alert, if any
    });

    return regionalData;
};

module.exports = {
    getAdminDashboardData,
    getStudentDashboardData,
    getRegionalOutlookData,
};