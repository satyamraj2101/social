// controllers/aiPostController.js
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import the Gemini API client
const pool = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use your API key here

// Create a new AI-generated post
exports.createAIPost = async (req, res) => {
    const { prompt } = req.body; // Get the prompt from the request body
    const userId = req.user.id; // Get userId from the token

    try {
        // Generate content using the Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                }
            ],
            generationConfig: {
                maxOutputTokens: 500, // Set your desired max output tokens
                temperature: 0.7, // Adjust the creativity level as needed
            },
        });

        const aiPostContent = result.response.text(); // Extract the generated text

        // Insert the generated post into the database
        const insertResult = await pool.query(
            `INSERT INTO posts (user_id, content)
            VALUES ($1, $2)
            RETURNING *`,
            [userId, aiPostContent]
        );

        res.status(201).json({
            message: 'AI post created successfully',
            post: insertResult.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create AI post' });
    }
};

