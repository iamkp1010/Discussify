const express = require('express');
const usersRouter = require('./users.router')

const apis = express.Router();

apis.use('/users',(req,res,next) =>{ 
    console.log("USER ROUTE CALLED") 
    next()
}, usersRouter);

module.exports = apis;