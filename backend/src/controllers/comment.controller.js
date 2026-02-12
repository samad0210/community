const { validationResult } = require('express-validator');
const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');

// @route GET /api/comments/:postId  - Get all comments for a post (public)
const getCommentsByPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username role')
      .sort({ isAdminReply: -1, createdAt: 1 }); // Admin replies first

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/comments/:postId  - Add a comment (any logged-in user)
const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id,
      isAdminReply: false,
    });

    await comment.populate('author', 'username role');

    // Increment comment count on post
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/comments/:postId/admin-reply  - Add admin reply (admin only)
const addAdminReply = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id,
      isAdminReply: true, // Mark as official admin reply
    });

    await comment.populate('author', 'username role');

    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/comments/:id  - Delete comment (author or admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCommentsByPost, addComment, addAdminReply, deleteComment };
