const express = require('express');
const router = express.Router();
const educationService = require('../services/educationService');
const verifyToken = require('../middleware/auth');
const s3Service = require('../services/s3Service');

// GET /api/education/modules
// Get all education modules.
router.get('/modules', verifyToken, async (req, res, next) => {
    try {
        const modules = await educationService.getModules();
        res.status(200).json(modules);
    } catch (error) {
        next(error);
    }
});

// GET /api/education/modules/:id
// Get a single module by its ID.
router.get('/modules/:id', verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const module = await educationService.getModuleById(id);
        res.status(200).json(module);
    } catch (error) {
        next(error);
    }
});

// --- NEW ROUTE: Get a secure S3 URL for a video lesson ---
// GET /api/education/video-url/:key
router.get('/video-url/:key', verifyToken, async (req, res, next) => {
    try {
        const { key } = req.params;
        const videoUrl = await s3Service.getVideoUrl(key);
        res.status(200).json({ url: videoUrl });
    } catch (error) {
        next(error);
    }
});

module.exports = router;