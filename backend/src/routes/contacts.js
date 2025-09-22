const express = require('express');
const router = express.Router();
const contactsService = require('../services/contactsService');
const verifyToken = require('../middleware/auth');

// GET /api/contacts
// Get emergency contacts. Users must be logged in.
router.get('/', verifyToken, async (req, res, next) => {
    try {
        // Potentially filter contacts by user's institution
        const { institutionId } = req.query;
        const contacts = await contactsService.getContacts(institutionId);
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
});

module.exports = router;