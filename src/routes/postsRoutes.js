// routes/postsRoutes.js
const express = require('express');
const { createPost, getPosts,likePost,unlikePost } = require('../controllers/postsController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create Post
router.post('/', verifyToken, createPost);

// Retrieve User Posts
router.get('/', verifyToken, getPosts);

// Like a post
router.post('/:postId/like', verifyToken, likePost);

// Unlike a post
router.delete('/:postId/unlike', verifyToken, unlikePost);

module.exports = router;
