// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "Token required" });

    jwt.verify(token.split(' ')[1], jwtSecret, (err, decoded) => { // Split to get the token
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = { id: decoded.id }; // Set req.user instead of req.userId
        next();
    });
};
