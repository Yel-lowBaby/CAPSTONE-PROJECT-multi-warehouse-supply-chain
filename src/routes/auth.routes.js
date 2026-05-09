const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, profile);

module.exports = router;