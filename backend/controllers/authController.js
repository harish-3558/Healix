const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const { sendPasswordResetEmail, isEmailConfigured } = require('../utils/email');

// @desc    Register a new user (Student/Counselor only)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, speciality, credentials } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        // Admins must be seeded or created through a protected administrative process.
        if (!['student', 'counselor'].includes(role)) {
            return res.status(403).json({ success: false, message: 'Only student and counselor registration is available.' });
        }

        // Counselor Validation
        let isApproved = true;
        if (role === 'counselor') {
            if (!speciality || !credentials) {
                return res.status(400).json({ success: false, message: 'Counselors must provide speciality and credentials.' });
            }
            isApproved = false; // Pending approval
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            speciality,
            credentials,
            isApproved
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.role === 'counselor' && !user.isApproved) {
                return res.status(401).json({ success: false, message: 'Your account is pending approval by an administrator.' });
            }

            res.json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Send a password reset OTP email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    if (!isEmailConfigured()) {
        return res.status(503).json({ success: false, message: 'Password reset email is not configured on the server.' });
    }

    try {
        const normalizedEmail = email.trim();
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const user = await User.findOne({ email: new RegExp(`^${escapedEmail}$`, 'i') });

        if (user) {
            const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
            user.passwordResetOtpHash = await bcrypt.hash(otp, 10);
            user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
            user.passwordResetAttempts = 0;
            user.passwordResetGrantHash = undefined;
            user.passwordResetGrantExpires = undefined;
            await user.save();

            try {
                await sendPasswordResetEmail(user.email, otp);
            } catch (error) {
                user.passwordResetOtpHash = undefined;
                user.passwordResetExpires = undefined;
                user.passwordResetAttempts = 0;
                user.passwordResetGrantHash = undefined;
                user.passwordResetGrantExpires = undefined;
                await user.save();
                console.error('Failed to send password reset OTP:', error.message);
                return res.status(500).json({ success: false, message: 'Could not send the verification code. Please try again later.' });
            }
        }

        res.status(200).json({
            success: true,
            message: 'If an account exists for that email, a six-digit verification code has been sent.'
        });
    } catch (error) {
        console.error('Password reset request failed:', error);
        res.status(500).json({ success: false, message: 'Could not process the password reset request.' });
    }
};

// @desc    Verify a password reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (typeof email !== 'string' || !email.trim() || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ success: false, message: 'Enter the account email and the six-digit code.' });
    }

    try {
        const normalizedEmail = email.trim();
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const user = await User.findOne({
            email: new RegExp(`^${escapedEmail}$`, 'i'),
            passwordResetExpires: { $gt: new Date() },
            passwordResetAttempts: { $lt: 5 }
        }).select('+passwordResetOtpHash +passwordResetExpires +passwordResetAttempts');

        if (!user || !user.passwordResetOtpHash) {
            return res.status(400).json({ success: false, message: 'The code is invalid or expired. Request a new code and try again.' });
        }

        const otpMatches = await bcrypt.compare(otp, user.passwordResetOtpHash);
        if (!otpMatches) {
            await User.updateOne(
                { _id: user._id, passwordResetAttempts: { $lt: 5 } },
                { $inc: { passwordResetAttempts: 1 } }
            );
            return res.status(400).json({ success: false, message: 'The code is incorrect or expired. Check it and try again.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: user._id,
                passwordResetOtpHash: user.passwordResetOtpHash,
                passwordResetExpires: { $gt: new Date() },
                passwordResetAttempts: { $lt: 5 }
            },
            {
                $set: {
                    passwordResetGrantHash: crypto.createHash('sha256').update(resetToken).digest('hex'),
                    passwordResetGrantExpires: new Date(Date.now() + 10 * 60 * 1000)
                },
                $unset: {
                    passwordResetOtpHash: 1,
                    passwordResetExpires: 1,
                    passwordResetAttempts: 1
                }
            },
            { returnDocument: 'after' }
        );

        if (!updatedUser) {
            return res.status(400).json({ success: false, message: 'The code is invalid or expired. Request a new code and try again.' });
        }

        res.status(200).json({ success: true, resetToken, message: 'Code verified. You can now choose a new password.' });
    } catch (error) {
        console.error('Password reset code verification failed:', error);
        res.status(500).json({ success: false, message: 'Could not verify the code. Please try again.' });
    }
};

// @desc    Reset password after OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, resetToken, password } = req.body;

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    if (typeof email !== 'string' || !email.trim() || typeof resetToken !== 'string' || !/^[a-f\d]{64}$/i.test(resetToken)) {
        return res.status(400).json({ success: false, message: 'Verify your code before changing the password.' });
    }

    try {
        const normalizedEmail = email.trim();
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const grantHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            {
                email: new RegExp(`^${escapedEmail}$`, 'i'),
                passwordResetGrantHash: grantHash,
                passwordResetGrantExpires: { $gt: new Date() }
            },
            {
                $set: { password: hashedPassword },
                $unset: {
                    passwordResetGrantHash: 1,
                    passwordResetGrantExpires: 1
                }
            },
            { runValidators: true, returnDocument: 'after' }
        );

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset authorization is invalid or expired. Verify a new code and try again.' });
        }

        res.status(200).json({ success: true, message: 'Your password has been reset. You can now log in.' });
    } catch (error) {
        console.error('Password reset failed:', error);
        res.status(500).json({ success: false, message: 'Could not reset your password. Please try again.' });
    }
};

// @desc    Get all counselors
// @route   GET /api/auth/counselors
// @access  Public
const getCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor', isApproved: true }).select('-password');
        res.status(200).json({ success: true, count: counselors.length, data: counselors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    getCounselors,
    getMe
};
