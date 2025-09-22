const { db } = require('../config/firebase');
const checkInsCollection = db.collection('checkIns');

/**
 * Marks a student as "Safe" during a specific emergency event.
 */
const markSafe = async (uid, alertId) => {
    // Create a unique document ID for this user and this specific alert
    const checkInId = `${uid}_${alertId}`;
    await checkInsCollection.doc(checkInId).set({
        uid,
        alertId,
        status: 'safe',
        timestamp: new Date().toISOString(),
    });
    return { success: true, message: 'Status updated to SAFE.' };
};

/**
 * Marks a student as needing "Help" during an emergency.
 * In a real-world app, this would also trigger notifications (e.g., email, SMS).
 */
const requestHelp = async (uid, alertId, location) => {
    const checkInId = `${uid}_${alertId}`;
    await checkInsCollection.doc(checkInId).set({
        uid,
        alertId,
        status: 'help_needed',
        location: location || null, // Store user's location if provided
        timestamp: new Date().toISOString(),
    });
    // TODO: Add notification logic here (e.g., trigger an email to the admin)
    return { success: true, message: 'SOS signal sent. Help is on the way.' };
};

/**
 * Gets the check-in status for all students for a given alert.
 * This is for admins/teachers to see who is safe.
 */
const getCheckInStatus = async (alertId) => {
    const snapshot = await checkInsCollection.where('alertId', '==', alertId).get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => doc.data());
};

module.exports = {
    markSafe,
    requestHelp,
    getCheckInStatus,
};