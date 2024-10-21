const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Retrieve Notifications
router.get('/:userId', verifyToken, getNotifications);

module.exports = router;
