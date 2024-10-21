// controllers/aiMessageController.js
const pool = require('../config/db');

// Handle AI Messages
exports.handleAIMessages = async (req, res) => {
    const { actionType, recipientId } = req.body; // Extract action type and recipient ID
    const senderId = req.user.id; // Assume req.user is set by authMiddleware

    try {
        let message;

        if (actionType === 'greet') {
            // Fetch user profile for greeting
            const profileResult = await pool.query(
                `SELECT * FROM user_profiles WHERE user_id = $1`,
                [senderId]
            );

            if (profileResult.rowCount === 0) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            const profile = profileResult.rows[0];
            message = `Hello, ${profile.first_name}! How can I assist you today?`;

        } else if (actionType === 'reply') {
            // Fetch the last message received by the user
            const lastMessageResult = await pool.query(
                `SELECT * FROM messages WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 1`,
                [senderId]
            );

            if (lastMessageResult.rowCount === 0) {
                return res.status(404).json({ error: 'No messages found' });
            }

            const lastMessage = lastMessageResult.rows[0];
            message = `You received a message: "${lastMessage.message}". How would you like to respond?`;
        } else {
            return res.status(400).json({ error: 'Invalid action type' });
        }

        // Send the AI-generated message
        await pool.query(
            `INSERT INTO messages (sender_id, recipient_id, message) VALUES ($1, $2, $3) RETURNING *`,
            [senderId, recipientId, message]
        );

        res.status(200).json({
            message: 'AI message sent successfully',
            content: message,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to handle AI message' });
    }
};
