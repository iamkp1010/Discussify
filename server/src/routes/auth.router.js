const express = require('express');
const {register, login, loginWithGoogle, logout, protected,} = require('../controllers/auth.controller');
const { refresh } = require('../controllers/token.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/google', loginWithGoogle)
authRouter.post('/tokenRefresh', refresh)
authRouter.post('/logout', logout)
authRouter.post('/protected', verifyToken, protected)

module.exports = authRouter
