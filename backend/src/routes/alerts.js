const express = require('express');
const router = express.Router();
const alertsService = require('../services/alertsService');
const verifyToken = require('../middleware/auth');

// GET /api/alerts?lat=...&lon=...
router.get('/', verifyToken, async (req, res, next) => {
    try {
        // --- THIS IS THE CRITICAL FIX ---
        // We now correctly use req.query to get the URL parameters.
        const { lat, lon } = req.query; 

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitude (lat) and Longitude (lon) are required." });
        }
        const alerts = await alertsService.getNearbyAlerts(parseFloat(lat), parseFloat(lon));
        res.status(200).json(alerts);
    } catch (error) {
        next(error);
    }
});

// POST /api/alerts
router.post('/', verifyToken, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can create alerts.' });
        }
        const newAlert = await alertsService.createAlert(req.body);
        res.status(201).json(newAlert);
    } catch (error) {
        next(error);
    }
});

module.exports = router;