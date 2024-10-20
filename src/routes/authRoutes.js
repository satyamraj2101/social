// routes/authRoutes.js
const express = require('express');
const { signup, login, recoverPassword, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/recover-password', recoverPassword);
router.post('/logout', logout);

module.exports = router;
