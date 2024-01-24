const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { createPost, fetchAllPosts } = require('../controllers/posts.controller');

const postsRouter = express.Router();

postsRouter.get('/',fetchAllPosts)
postsRouter.post('/create', verifyToken, createPost)
module.exports = postsRouter