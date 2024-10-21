// controllers/commentController.js
const pool = require('../config/db');

exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`,
            [userId, postId, content]
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add comment" });
    }
};
