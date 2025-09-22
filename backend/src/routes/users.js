const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const verifyToken = require('../middleware/auth');

// --- ROUTES FOR A USER'S OWN PROFILE ---
router.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const userProfile = await userService.getUserById(uid);
        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
});

router.put('/profile', verifyToken, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const profileData = req.body;
        const updatedUser = await userService.updateUserProfile(uid, profileData);
        res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
        next(error);
    }
});

// --- ROUTES FOR PARENT FUNCTIONALITY (THIS IS THE FIX) ---
// The server now knows what to do when it receives a request for "/api/users/my-child".

// GET /api/users/my-child
router.get('/my-child', verifyToken, async (req, res, next) => {
    try {
        const parentUid = req.user.uid;
        if (req.user.role !== 'parent') {
            return res.status(403).json({ message: "Forbidden: Only parents can access this resource." });
        }
        const childProfile = await userService.getChildProfile(parentUid);
        res.status(200).json(childProfile);
    } catch (error) {
        next(error);
    }
});

// PUT /api/users/my-child
router.put('/my-child', verifyToken, async (req, res, next) => {
    try {
        const parentUid = req.user.uid;
        if (req.user.role !== 'parent') {
            return res.status(403).json({ message: "Forbidden: Only parents can access this resource." });
        }
        const childData = req.body;
        const updatedChild = await userService.updateChildProfile(parentUid, childData);
        res.status(200).json({ message: "Child's profile updated successfully!", user: updatedChild });
    } catch (error) {
        next(error);
    }
});

module.exports = router;