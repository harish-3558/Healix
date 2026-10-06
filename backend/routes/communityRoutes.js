const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost, addComment } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/posts', getPosts);
router.post('/posts', protect, createPost);
router.put('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comment', protect, addComment);

module.exports = router;
