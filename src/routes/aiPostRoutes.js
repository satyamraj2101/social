// routes/aiPostRoutes.js
const express = require('express');
const router = express.Router();
const { createAIPost } = require('../controllers/aiPostController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route for AI-driven post creation
router.post('/', verifyToken, createAIPost);

module.exports = router;
