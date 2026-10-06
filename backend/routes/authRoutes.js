const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, verifyResetOtp, resetPassword, getCounselors, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.get('/counselors', getCounselors);
router.get('/me', protect, getMe);

module.exports = router;
