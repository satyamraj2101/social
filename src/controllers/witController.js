const { Wit } = require('node-wit');
const witClient = require('../config/witClient');
const {createPost} = require("./postsController");

// Process user input with Wit.ai
exports.processInput = async (req, res) => {
    const { inputText } = req.body;

    try {
        const response = await witClient.message(inputText);

        console.log("Wit.ai Full Response:", response);

        // Extract the intent and entities from the response safely
        const intent = response.intents && response.intents.length > 0 ? response.intents[0].name : null;
        const postContent = response.entities && response.entities['PostContent'] ? response.entities['PostContent'][0].value : null;

        // Check if the intent is 'Create_Post' and the post content exists
        if (intent === 'Create_Post' && postContent) {
            // Simulate post creation or call the post creation logic
            const postData = {
                content: postContent,
                userId: req.user.id // Assuming the user ID is in the request
            };

            // Call the post creation logic (replace this with your actual post creation logic)
            await createPost(postData); // Ensure createPost is defined

            return res.status(200).json({
                message: 'Post created successfully',
                postContent: postContent
            });
        }

        // Handle case where the intent is recognized but not valid for this action
        res.status(400).json({
            message: 'Response does not contain valid intent or post content',
            error: {
                intent: intent,
                postContent: postContent,
                fullResponse: response // Log the full Wit.ai response for debugging
            }
        });

    } catch (error) {
        console.error('Error processing input with Wit.ai:', error);
        res.status(500).json({ error: 'Failed to process input with Wit.ai' });
    }
};
