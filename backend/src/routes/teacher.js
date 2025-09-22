const express = require('express');
const router = express.Router();
const teacherService = require('../services/teacherService');
const verifyToken = require('../middleware/auth');

const isTeacherOrAdmin = (req, res, next) => { /* ... (Same as before) ... */ };

router.get('/students', verifyToken, isTeacherOrAdmin, async (req, res, next) => {
    try {
        const { institutionId } = req.query;
        const students = await teacherService.getStudentsByInstitution(institutionId);
        res.status(200).json(students);
    } catch (error) { next(error); }
});

router.get('/parents', verifyToken, isTeacherOrAdmin, async (req, res, next) => {
    try {
        const parents = await teacherService.getUnlinkedParents();
        res.status(200).json(parents);
    } catch (error) { next(error); }
});

router.post('/link', verifyToken, isTeacherOrAdmin, async (req, res, next) => {
    try {
        const { studentUid, parentUid } = req.body;
        const result = await teacherService.linkParentToStudent(studentUid, parentUid);
        res.status(200).json(result);
    } catch (error) { next(error); }
});

module.exports = router;