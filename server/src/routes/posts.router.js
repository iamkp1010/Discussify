const express = require("express");
const { verifyToken, optionallyVerifyToken } = require("../middlewares/auth.middleware");
const { createPost, fetchPosts, deletePost, updatePost, votePost, fetchVotedPost} = require("../controllers/posts.controller");

const postsRouter = express.Router();

postsRouter.get("/", optionallyVerifyToken, fetchPosts);
postsRouter.post("/create", verifyToken, createPost);
postsRouter.delete("/:id", verifyToken, deletePost);
postsRouter.put("/:id", verifyToken, updatePost);
postsRouter.post("/:id/vote", verifyToken, votePost);
postsRouter.get("/fetchVotedPost", optionallyVerifyToken, fetchVotedPost)
module.exports = postsRouter;