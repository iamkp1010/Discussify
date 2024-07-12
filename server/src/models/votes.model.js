const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "posts",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: "comments",
    },
    isUpvoted:{
      type: Boolean,
      required: true
    },
    isPost: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

votesSchema.pre('save', async function (next) {
  if((this.postId === undefined && this.commentId === undefined) || 
     (this.postId !== undefined && this.commentId !== undefined )){
      throw new Error("Either there should be postId or commentId");
    }
  next()
})


module.exports = mongoose.model("Vote", votesSchema);