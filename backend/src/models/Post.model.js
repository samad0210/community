const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: 5,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      minlength: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{ type: String, trim: true }],
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
