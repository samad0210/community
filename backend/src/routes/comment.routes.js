const express = require('express');
const { body } = require('express-validator');
const { getCommentsByPost, addComment, addAdminReply, deleteComment } = require('../controllers/comment.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

const contentValidation = [
  body('content').trim().notEmpty().withMessage('Comment cannot be empty').isLength({ max: 1000 }).withMessage('Comment max 1000 characters'),
];

// Get all comments for a post (public)
router.get('/:postId', getCommentsByPost);

// Add a regular comment (any logged-in user)
router.post('/:postId', protect, contentValidation, addComment);

// Add admin official reply (admin only)
router.post('/:postId/admin-reply', protect, adminOnly, contentValidation, addAdminReply);

// Delete a comment
router.delete('/:id', protect, deleteComment);

module.exports = router;
