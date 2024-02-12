const express = require('express');

const { createComment, fetchPostComments, updateComment, deleteComment, voteComment, fetchUserComments} = require('../controllers/comments.controller');
const { verifyToken, optionallyVerifyToken } = require('../middlewares/auth.middleware');

const commentsRouter = express.Router();

commentsRouter.post('/', verifyToken, createComment);
commentsRouter.get('/post/:id', optionallyVerifyToken, fetchPostComments);
commentsRouter.get('/user/:id', optionallyVerifyToken, fetchUserComments);
commentsRouter.post('/vote/:id', verifyToken, voteComment);
commentsRouter.patch('/:id', verifyToken, updateComment);
commentsRouter.delete('/:id', verifyToken, deleteComment);
module.exports = commentsRouter;