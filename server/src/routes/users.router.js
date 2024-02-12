const express = require('express');
const {fetchUserInfo, fetchRandomUsers, updateUser} = require('../controllers/users.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

usersRouter.post('/update', verifyToken, updateUser)
usersRouter.get('/random', fetchRandomUsers)
usersRouter.get('/:username', fetchUserInfo)

module.exports = usersRouter