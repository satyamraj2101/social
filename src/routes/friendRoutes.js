const express = require('express');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, listConnections } = require('../controllers/friendController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Send friend request
router.post('/send-request', verifyToken, sendFriendRequest);

// Accept friend request
router.post('/accept-request', verifyToken, acceptFriendRequest);

// Reject friend request
router.post('/reject-request', verifyToken, rejectFriendRequest);

// List connections
router.get('/connections', verifyToken, listConnections);

module.exports = router;
