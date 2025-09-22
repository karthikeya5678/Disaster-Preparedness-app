const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');
const usersCollection = db.collection('users');
const drillsCollection = db.collection('drills');

const getDrillsByInstitution = async (institutionId) => { /* ... (This function is correct and unchanged) ... */ };
const scheduleDrill = async (drillData) => { /* ... (This function is correct and unchanged) ... */ };
const updateDrillParticipation = async (drillId, userId) => { /* ... (This function is correct and unchanged) ... */ };

// --- THIS IS THE CRITICAL FIX ---
// This function is now more robust and will not crash.
const updateDrill = async (drillId, drillData) => {
    const drillRef = drillsCollection.doc(drillId);
    const doc = await drillRef.get();

    // First, check if the document actually exists.
    if (!doc.exists) {
        const error = new Error('Drill not found. It may have been deleted by another user.');
        error.statusCode = 404; // Use the correct "Not Found" status code
        throw error;
    }

    // If it exists, proceed with the update.
    await drillRef.update(drillData);
    return { id: drillId, ...drillData };
};

const deleteDrill = async (drillId) => {
    // Also add a check here for consistency
    const drillRef = drillsCollection.doc(drillId);
    if (!(await drillRef.get()).exists) {
        // If it's already gone, we can consider it a success.
        return { id: drillId, message: 'Drill was already deleted.' };
    }
    await drillRef.delete();
    return { id: drillId, message: 'Drill deleted successfully.' };
};

module.exports = {
    getDrillsByInstitution,
    scheduleDrill,
    updateDrillParticipation,
    updateDrill,
    deleteDrill,
};