// controllers/postsController.js
const pool = require('../config/db');
const witClient = require('../config/witClient'); // Import Wit client

// Create a new post
exports.createPost = async (req, res) => {
    const { content, useAI = false } = req.body; // Accept a flag for AI posting
    const userId = req.user.id; // Get userId from the token

    try {
        let postContent = content;

        // If useAI is true, generate content using Wit.ai
        if (useAI) {
            const witResponse = await witClient.message(content); // Process the input text with Wit.ai
            const entities = witResponse.entities;

            // Generate post content from recognized entities or intents
            if (entities) {
                const entityValues = entities.Content ? entities.Content.map(entity => entity.value).join(' ') : '';
                postContent = entityValues || 'AI generated content based on input.';
            }
        }

        const result = await pool.query(
            `INSERT INTO posts (user_id, content)
            VALUES ($1, $2)
            RETURNING *`,
            [userId, postContent]
        );

        res.status(201).json({
            message: 'Post created successfully',
            post: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Retrieve all posts for a user
exports.getPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            posts: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
};

exports.likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the user already liked the post
        const existingLike = await pool.query(
            `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
            [userId, postId]
        );

        if (existingLike.rowCount > 0) {
            return res.status(400).json({ error: "Post already liked" });
        }

        await pool.query(
            `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
            [userId, postId]
        );

        res.status(201).json({ message: "Post liked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to like the post" });
    }
};

exports.unlikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
            [userId, postId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Like not found" });
        }

        res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to unlike the post" });
    }
};
