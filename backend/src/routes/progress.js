const express = require('express');
const router = express.Router();
const progressService = require('../services/progressService');
const verifyToken = require('../middleware/auth');

// POST /api/progress/complete
// A general endpoint to mark any lesson as complete.
router.post('/complete', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const { moduleId, lessonId } = req.body;

        if (!moduleId || !lessonId) {
            return res.status(400).json({ message: 'moduleId and lessonId are required.' });
        }

        const result = await progressService.markLessonAsComplete(uid, moduleId, lessonId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// POST /api/progress/quiz
// A specific endpoint to save the results of a quiz.
router.post('/quiz', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const { moduleId, lessonId, score, totalQuestions } = req.body;

        if (moduleId === undefined || lessonId === undefined || score === undefined || totalQuestions === undefined) {
            return res.status(400).json({ message: 'Missing required fields for saving quiz result.' });
        }

        const result = await progressService.saveQuizResult(uid, moduleId, lessonId, score, totalQuestions);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// GET /api/progress
// A new endpoint to get all progress data for the logged-in user.
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const progressData = await progressService.getUserProgress(uid);
        res.status(200).json(progressData);
    } catch (error) {
        next(error);
    }
});

// --- NEW ROUTE: Save a Game Result ---
// POST /api/progress/game
router.post('/game', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const { gameName, score, maxScore } = req.body;

        if (!gameName || score === undefined || maxScore === undefined) {
            return res.status(400).json({ message: 'Missing required fields for saving game result.' });
        }

        const result = await progressService.saveGameResult(uid, gameName, score, maxScore);
        res.status(200).json(result);
    } catch (error){
        next(error);
    }
});

module.exports = router;