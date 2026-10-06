const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['meditation', 'exercise', 'strategy'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in seconds
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for efficient user queries
activitySchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
