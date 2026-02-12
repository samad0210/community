const express = require('express');
const { body } = require('express-validator');
const { getAllPosts, getPostById, createPost, deletePost } = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);

router.post(
  '/',
  protect,
  [
    body('title').trim().isLength({ min: 5, max: 150 }).withMessage('Title must be 5-150 characters'),
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  ],
  createPost
);

router.delete('/:id', protect, deletePost);

module.exports = router;
