const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');
const userService = require('../services/userService');
const verifyToken = require('../middleware/auth');

// GET /api/dashboard/admin
router.get('/admin', verifyToken, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({ message: 'Forbidden: Access restricted to admins.' });
        }
        const { institutionId } = req.query;
        if (!institutionId) {
            return res.status(400).json({ message: 'Missing institutionId query parameter.' });
        }
        const data = await dashboardService.getAdminDashboardData(institutionId);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/student
router.get('/student', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const userProfile = await userService.getUserById(uid);
        if (!userProfile.institutionId) {
             return res.status(400).json({ message: 'User is not associated with an institution.' });
        }
        const data = await dashboardService.getStudentDashboardData(uid, userProfile.institutionId);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/regional?lat=...&lon=...
router.get('/regional', verifyToken, async (req, res, next) => {
    try {
        // --- THIS IS THE CRITICAL FIX ---
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitude and Longitude are required." });
        }
        const data = await dashboardService.getRegionalOutlookData(parseFloat(lat), parseFloat(lon));
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;