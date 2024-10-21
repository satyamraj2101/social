const pool = require('../config/db');

// Send Friend Request
exports.sendFriendRequest = async (req, res) => {
    const senderId = req.user.id; // Assuming user ID is set by auth middleware
    const { receiverId } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO friend_requests (sender_id, receiver_id, status) 
             VALUES ($1, $2, 'pending') RETURNING *`,
            [senderId, receiverId]
        );

        res.status(201).json({
            message: 'Friend request sent successfully',
            request: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send friend request' });
    }
};

// Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
    const userId = req.user.id;
    const { requestId } = req.body;

    try {
        // Update the friend request status
        await pool.query(
            `UPDATE friend_requests SET status = 'accepted' 
             WHERE id = $1 AND receiver_id = $2`,
            [requestId, userId]
        );

        // Add to connections
        const result = await pool.query(
            `INSERT INTO connections (user_id, friend_id) 
             SELECT receiver_id, sender_id FROM friend_requests 
             WHERE id = $1 RETURNING *`,
            [requestId]
        );

        res.status(200).json({
            message: 'Friend request accepted',
            connection: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to accept friend request' });
    }
};

// Reject Friend Request
exports.rejectFriendRequest = async (req, res) => {
    const userId = req.user.id;
    const { requestId } = req.body;

    try {
        await pool.query(
            `UPDATE friend_requests SET status = 'rejected' 
             WHERE id = $1 AND receiver_id = $2`,
            [requestId, userId]
        );

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reject friend request' });
    }
};

// List Connections
exports.listConnections = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT u.id, u.username FROM connections c 
             JOIN users u ON c.friend_id = u.id 
             WHERE c.user_id = $1`,
            [userId]
        );

        res.status(200).json({ connections: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve connections' });
    }
};
