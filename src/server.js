// src/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Add this line
const friendRoutes = require('./routes/friendRoutes');
const postsRoutes = require('./routes/postsRoutes');
const commentRoutes = require('./routes/commentRoutes');
const postRoutes = require('./routes/postsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const witRoutes = require('./routes/witRoutes');
const { checkBlacklist } = require('./controllers/authController');
const aiPostRoutes = require('./routes/aiPostRoutes');
const aiMessageRoutes = require('./routes/aiMessageRoutes');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Logger middleware
app.use(morgan('dev'));

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', checkBlacklist, authRoutes);
app.use('/profile', checkBlacklist, profileRoutes);
app.use('/friends', checkBlacklist, friendRoutes);
app.use('/posts', checkBlacklist, postsRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/messages', checkBlacklist, messageRoutes);
app.use('/notifications', checkBlacklist, notificationRoutes);
app.use('/ai/create', aiPostRoutes);
app.use('/ai/message', checkBlacklist, aiMessageRoutes);

app.use('/wit', witRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Not found middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
