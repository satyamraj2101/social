// routes/profileRoutes.js
const express = require('express');
const { createProfile, updateProfile , getProfile } = require('../controllers/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create Profile
router.post('/', verifyToken, createProfile);

// Update Profile
router.put('/', verifyToken, updateProfile);

// Retrieve Profile
router.get('/', verifyToken, getProfile); // Add this line

module.exports = router;
