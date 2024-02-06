const express = require('express');
const usersRouter = require('./users.router');
const postsRouter = require('./posts.router');
const commentsRouter = require('./comments.router');

const apis = express.Router();

apis.use('/users', usersRouter);
apis.use('/posts', postsRouter)
apis.use('/comments', commentsRouter)

module.exports = apis;