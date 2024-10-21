const express = require('express');
const router = express.Router();
const { handleAIMessages } = require('../controllers/aiMessageController'); // Import the new controller
const { verifyToken } = require('../middlewares/authMiddleware');

// Route for handling AI messages
router.post('/', verifyToken, handleAIMessages); // POST request for AI messaging

module.exports = router;
