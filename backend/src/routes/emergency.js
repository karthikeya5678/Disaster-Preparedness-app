const express = require('express');
const router = express.Router();
const emergencyService = require('../services/emergencyService');
const verifyToken = require('../middleware/auth');

// POST /api/emergency/check-in
// Endpoint for a student to report their status.
router.post('/check-in', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const { alertId, status, location } = req.body;

        if (!alertId || !status) {
            return res.status(400).json({ message: 'alertId and status are required.' });
        }

        let result;
        if (status === 'safe') {
            result = await emergencyService.markSafe(uid, alertId);
        } else if (status === 'help') {
            result = await emergencyService.requestHelp(uid, alertId, location);
        } else {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }
        
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;