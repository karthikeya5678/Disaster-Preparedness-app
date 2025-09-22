const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// POST /api/auth/register
// Registers a new user
router.post('/register', async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        // Note: Login is handled client-side via Firebase SDK. 
        // This endpoint just creates the user in Auth and Firestore.
        res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        // Pass error to the centralized error handler
        if (error.code === 'auth/email-already-exists') {
            error.statusCode = 409; // Conflict
        } else {
            error.statusCode = 400; // Bad Request
        }
        next(error);
    }
});

module.exports = router;