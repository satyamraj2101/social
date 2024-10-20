// utils/jwt.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

exports.sign = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};
