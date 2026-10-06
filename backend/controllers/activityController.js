const Activity = require('../models/Activity');

// @desc    Log a completed activity
// @route   POST /api/activity
// @access  Private
const logActivity = async (req, res) => {
    try {
        const { type, name, slug, duration } = req.body;

        if (!type || !name || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Type, name, and slug are required'
            });
        }

        const activity = await Activity.create({
            userId: req.user._id,
            type,
            name,
            slug,
            duration: duration || 0
        });

        res.status(201).json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to log activity'
        });
    }
};

// @desc    Get current user's activities
// @route   GET /api/activity/my
// @access  Private
const getMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user._id })
            .sort({ completedAt: -1 })
            .limit(50);

        // Also compute summary stats
        const allActivities = await Activity.find({ userId: req.user._id });

        const stats = {
            totalSessions: allActivities.length,
            totalMinutes: Math.round(allActivities.reduce((sum, a) => sum + (a.duration || 0), 0) / 60),
            meditationCount: allActivities.filter(a => a.type === 'meditation').length,
            exerciseCount: allActivities.filter(a => a.type === 'exercise').length,
            strategyCount: allActivities.filter(a => a.type === 'strategy').length,
            // Current streak (consecutive days)
            streak: calculateStreak(allActivities),
        };

        res.json({
            success: true,
            data: activities,
            stats
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activities'
        });
    }
};

// Helper: Calculate streak of consecutive days with activity
function calculateStreak(activities) {
    if (activities.length === 0) return 0;

    const dates = [...new Set(
        activities.map(a => new Date(a.completedAt).toISOString().split('T')[0])
    )].sort().reverse();

    let streak = 1;
    const today = new Date().toISOString().split('T')[0];

    // Check if user has activity today or yesterday (to not break streak mid-day)
    if (dates[0] !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (dates[0] !== yesterday) return 0;
    }

    for (let i = 0; i < dates.length - 1; i++) {
        const curr = new Date(dates[i]);
        const prev = new Date(dates[i + 1]);
        const diff = (curr - prev) / 86400000;
        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

module.exports = { logActivity, getMyActivities };
