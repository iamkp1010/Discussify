const express = require('express');
const {register, login, loginWithGoogle, logout, protected} = require('../controllers/users.controller');
const { refresh } = require('../controllers/token.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

usersRouter.post('/register', register)
usersRouter.post('/login', login)
usersRouter.post('/auth/google/', loginWithGoogle)
usersRouter.post('/tokenRefresh', refresh)
usersRouter.post('/logout', logout)
usersRouter.post('/protected', verifyToken, protected)
module.exports = usersRouter