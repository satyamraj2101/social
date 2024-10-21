const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Send Message
router.post('/', verifyToken, sendMessage);

// Retrieve Messages
router.get('/:userId', verifyToken, getMessages);

module.exports = router;
