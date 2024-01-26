const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isUpvoted:{
      type: Boolean,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", votesSchema);