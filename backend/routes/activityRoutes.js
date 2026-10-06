const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { logActivity, getMyActivities } = require('../controllers/activityController');

router.post('/', protect, logActivity);
router.get('/my', protect, getMyActivities);

module.exports = router;
