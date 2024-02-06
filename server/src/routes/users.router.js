const express = require('express');
const {register, login, loginWithGoogle, logout, protected, fetchUserInfo, fetchRandomUsers, updateUser} = require('../controllers/users.controller');
const { refresh } = require('../controllers/token.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

//auth
usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.post('/auth/google/', loginWithGoogle)
usersRouter.post('/tokenRefresh', refresh)
usersRouter.post('/logout', logout)
//users
usersRouter.post('/update', verifyToken, updateUser)
usersRouter.get('/random', fetchRandomUsers)
usersRouter.post('/protected', verifyToken, protected)
usersRouter.get('/:username', fetchUserInfo)

module.exports = usersRouter