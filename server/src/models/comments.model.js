const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    content: {
      type: String,
      required: true,
      maxLength: [500, "Content is not provided!"],
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "posts",
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;