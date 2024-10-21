// controllers/messageController.js
const pool = require('../config/db');

// Send Message
exports.sendMessage = async (req, res) => {
    const { recipientId, message } = req.body;
    const senderId = req.user.id; // Assume req.user is set by authMiddleware

    try {
        const result = await pool.query(
            `INSERT INTO messages (sender_id, recipient_id, message)
             VALUES ($1, $2, $3) RETURNING *`,
            [senderId, recipientId, message]
        );

        res.status(201).json({
            message: 'Message sent successfully',
            messageData: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Retrieve Messages
exports.getMessages = async (req, res) => {
    const userId = req.user.id; // Assume req.user is set by authMiddleware

    try {
        const result = await pool.query(
            `SELECT * FROM messages WHERE recipient_id = $1 OR sender_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            messages: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

// Send Greeting Message
exports.sendGreetingMessage = async (userId, recipientId) => {
    // Get user profile to craft a greeting message
    const profileQuery = await pool.query(
        `SELECT first_name, last_name FROM user_profiles WHERE user_id = $1`,
        [userId]
    );

    if (profileQuery.rowCount === 0) {
        console.error('Profile not found');
        return;
    }

    const { first_name } = profileQuery.rows[0];
    const greetingMessage = `Hello ${first_name}! How can I assist you today?`;

    // Send the greeting message
    await pool.query(
        `INSERT INTO messages (sender_id, recipient_id, message)
        VALUES ($1, $2, $3)`,
        [userId, recipientId, greetingMessage]
    );

    console.log('Greeting message sent:', greetingMessage);
};

// Reply to Last Message
exports.replyToLastMessage = async (userId, recipientId) => {
    // Retrieve the last message sent by the recipient to the user
    const lastMessageQuery = await pool.query(
        `SELECT message FROM messages 
        WHERE recipient_id = $1 AND sender_id = $2 
        ORDER BY created_at DESC LIMIT 1`,
        [userId, recipientId]
    );

    if (lastMessageQuery.rowCount === 0) {
        console.error('No messages found to reply to');
        return;
    }

    const lastMessage = lastMessageQuery.rows[0].message;
    const replyMessage = `You mentioned: "${lastMessage}". How can I help with that?`;

    // Send the reply message
    await pool.query(
        `INSERT INTO messages (sender_id, recipient_id, message)
        VALUES ($1, $2, $3)`,
        [userId, recipientId, replyMessage]
    );

    console.log('Reply message sent:', replyMessage);
};
