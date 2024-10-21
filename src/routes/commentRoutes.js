// routes/commentRoutes.js
const express = require('express');
const { addComment } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Add a comment
router.post('/:postId', verifyToken, addComment);

module.exports = router;
