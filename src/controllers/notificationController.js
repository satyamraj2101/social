// controllers/notificationController.js
const pool = require('../config/db');

// Retrieve Notifications
exports.getNotifications = async (req, res) => {
    const userId = req.user.id; // Assume req.user is set by authMiddleware

    try {
        const result = await pool.query(
            `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            notifications: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
};
