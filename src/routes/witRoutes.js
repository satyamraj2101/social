const express = require('express');
const { processInput } = require('../controllers/witController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/process-input', verifyToken, processInput);

module.exports = router;