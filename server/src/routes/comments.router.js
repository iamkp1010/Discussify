const express = require('express');

const { createComment, fetchPostComments, updateComment, deleteComment, voteComment} = require('../controllers/comments.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const commentsRouter = express.Router();

commentsRouter.get('/', verifyToken, fetchPostComments);
commentsRouter.post('/', verifyToken, createComment);
commentsRouter.post('/vote/:id', verifyToken, voteComment);
commentsRouter.patch('/:id', verifyToken, updateComment);
commentsRouter.delete('/:id', verifyToken, deleteComment);
module.exports = commentsRouter;