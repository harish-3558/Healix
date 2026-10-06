const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'counselor', 'admin'],
        default: 'student'
    },
    speciality: {
        type: String,
        required: false // Only for counselors
    },
    credentials: {
        type: String,
        required: false // Link or text proof for counselors
    },
    isApproved: {
        type: Boolean,
        default: true // Student/Admin approved by default (Admin logic handled in controller)
    },
    passwordResetOtpHash: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    passwordResetAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    passwordResetGrantHash: {
        type: String,
        select: false
    },
    passwordResetGrantExpires: {
        type: Date,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
