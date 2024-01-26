const mongoose = require("mongoose");

//! Filter out bad words 

const postSchema = new mongoose.Schema({
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
      maxLength: [50,'must be no more than 50 characters'],
    },
    content: {
      type: String,
      required: true,
      maxLength: [500,'must be no more than 500 characters'],
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    edited:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
