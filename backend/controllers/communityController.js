const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

// Helper to anonymize a post
const anonymizePost = (post, userId) => {
    const postObj = post.toObject ? post.toObject() : post;
    return {
        _id: postObj._id,
        content: postObj.content,
        authorName: postObj.authorName,
        createdAt: postObj.createdAt,
        likesCount: postObj.likes.length,
        isLiked: userId ? postObj.likes.some(id => id.toString() === userId.toString()) : false,
        comments: postObj.comments.map(c => ({
            content: c.content,
            authorName: c.authorName,
            createdAt: c.createdAt
        }))
    };
};

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        let userId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-123');
                userId = decoded.id;
            } catch (err) { }
        }

        const anonymizedPosts = posts.map(post => anonymizePost(post, userId));
        res.status(200).json({ success: true, count: anonymizedPosts.length, data: anonymizedPosts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const { content, authorName } = req.body;
        if (!content) return res.status(400).json({ success: false, message: 'Content required' });

        const post = await Post.create({
            content,
            author: req.user._id,
            authorName: authorName || 'Anonymous'
        });

        res.status(201).json({ success: true, data: anonymizePost(post, req.user._id) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle like on a post
// @route   PUT /api/community/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const likedIndex = post.likes.indexOf(req.user._id);
        if (likedIndex === -1) post.likes.push(req.user._id);
        else post.likes.splice(likedIndex, 1);

        await post.save();
        res.status(200).json({ success: true, data: anonymizePost(post, req.user._id) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/community/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { content, authorName } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        if (!content) return res.status(400).json({ success: false, message: 'Comment required' });

        post.comments.push({
            content,
            author: req.user._id,
            authorName: authorName || 'Anonymous'
        });
        await post.save();

        res.status(201).json({ success: true, data: anonymizePost(post, req.user._id) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
