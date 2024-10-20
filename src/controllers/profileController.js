// controllers/profileController.js
const pool = require('../config/db');

// Create User Profile
exports.createProfile = async (req, res) => {
    const { first_name, last_name, bio, profile_picture, location, interests, website, social_links, preferences } = req.body;
    const userId = req.user.id; // Assume req.user is set by authMiddleware

    try {
        const result = await pool.query(
            `INSERT INTO user_profiles (user_id, first_name, last_name, bio, profile_picture, location, interests, website, social_links, preferences)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [userId, first_name, last_name, bio, profile_picture, location, interests, website, social_links, preferences]
        );

        res.status(201).json({
            message: 'Profile created successfully',
            profile: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    const { first_name, last_name, bio, profile_picture, location, interests, website, social_links, preferences } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `UPDATE user_profiles
            SET first_name = $1, last_name = $2, bio = $3, profile_picture = $4, location = $5,
                interests = $6, website = $7, social_links = $8, preferences = $9, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $10
            RETURNING *`,
            [first_name, last_name, bio, profile_picture, location, interests, website, social_links, preferences, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
// Retrieve User Profile
exports.getProfile = async (req, res) => {
    const userId = req.user.id; // Assume req.userId is set by authMiddleware
    console.log('Fetching profile for userId:', userId);

    try {
        const result = await pool.query(
            `SELECT * FROM user_profiles WHERE user_id = $1`,
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({
            profile: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};