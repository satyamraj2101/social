// controllers/authController.js
const User = require('../models/User');
const jwt = require('../utils/jwt');
const bcrypt = require('bcrypt');
const { jwtSecret } = require('../config/config');
const blacklist = new Set();

exports.signup = async (req, res) => {
    const { username, email, securityQuestion, securityAnswer, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.createUser({
            username,
            email,
            securityQuestion,
            securityAnswer,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "User already exists or validation failed" });
    }
};

exports.login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        const user = await User.findUserByUsernameOrEmail(usernameOrEmail);
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, jwtSecret);
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.recoverPassword = async (req, res) => {
    const { usernameOrEmail, securityAnswer, newPassword } = req.body;
    try {
        const user = await User.findUserByUsernameOrEmail(usernameOrEmail);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.security_answer !== securityAnswer) return res.status(400).json({ error: "Incorrect security answer" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(user.id, hashedPassword);
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.logout = (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(400).json({ error: "Token required" });

    blacklist.add(token); // Add token to blacklist
    res.status(200).json({ message: 'Logout successful' });
};

// Middleware to check if the token is blacklisted
exports.checkBlacklist = (req, res, next) => {
    const token = req.headers['authorization'];
    if (blacklist.has(token)) {
        return res.status(401).json({ error: 'Token is invalid' });
    }
    next();
};
