const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const verifyToken = require('../middleware/auth');

// GET /api/weather?lat=...&lon=...
router.get('/', verifyToken, async (req, res, next) => {
    try {
        // --- THIS IS THE CRITICAL FIX ---
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ message: "Latitude (lat) and Longitude (lon) are required." });
        }
        const weatherData = await weatherService.getWeatherData(parseFloat(lat), parseFloat(lon));
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
});

// GET /api/weather/by-city?q=...
router.get('/by-city', verifyToken, async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "City name query (q) is required." });
        }
        const weatherData = await weatherService.getWeatherByCityName(q);
        res.status(200).json(weatherData);
    } catch (error) {
        next(error);
    }
});

module.exports = router;