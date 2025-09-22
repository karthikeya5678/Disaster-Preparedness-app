const express = require('express');
const router = express.Router();
const drillsService = require('../services/drillsService');
const verifyToken = require('../middleware/auth');

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: This action requires administrator privileges.' });
    }
};

const isTeacherOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin' || req.user.role === 'super-admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: This action requires teacher or administrator privileges.' });
    }
};

// GET /api/drills?institutionId=...
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const { institutionId } = req.query;
        if (!institutionId) { return res.status(400).json({ message: 'Missing query parameter: institutionId.' }); }
        const drills = await drillsService.getDrillsByInstitution(institutionId);
        res.status(200).json(drills);
    } catch (error) { next(error); }
});

// POST /api/drills (For creating new drills)
router.post('/', verifyToken, isTeacherOrAdmin, async (req, res, next) => {
    try {
        const newDrill = await drillsService.scheduleDrill(req.body);
        res.status(201).json(newDrill);
    } catch (error) { next(error); }
});

// PATCH /api/drills/:id/participate (For students)
router.patch('/:id/participate', verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        const result = await drillsService.updateDrillParticipation(id, userId);
        res.status(200).json(result);
    } catch (error) { next(error); }
});

// PUT /api/drills/:id (For admins to edit a drill)
router.put('/:id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedDrill = await drillsService.updateDrill(id, req.body);
        res.status(200).json(updatedDrill);
    } catch (error) { next(error); }
});

// DELETE /api/drills/:id (For admins to delete a drill)
router.delete('/:id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await drillsService.deleteDrill(id);
        res.status(200).json(result);
    } catch (error) { next(error); }
});

module.exports = router;