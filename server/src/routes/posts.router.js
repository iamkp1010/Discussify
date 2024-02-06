const express = require("express");

const { verifyToken, optionallyVerifyToken } = require("../middlewares/auth.middleware");
const { createPost, fetchPosts, deletePost, updatePost, votePost, fetchVotedPost} = require("../controllers/posts.controller");

const postsRouter = express.Router();

postsRouter.get("/", optionallyVerifyToken, fetchPosts);
postsRouter.post("/create", verifyToken, createPost);
postsRouter.post("/vote/:id", verifyToken, votePost);
postsRouter.get("/fetchVotedPost", optionallyVerifyToken, fetchVotedPost)
postsRouter.delete("/:id", verifyToken, deletePost);
postsRouter.patch("/:id", verifyToken, updatePost);
module.exports = postsRouter;