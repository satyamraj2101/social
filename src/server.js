// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Add this line
const { checkBlacklist } = require('./controllers/authController');
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
