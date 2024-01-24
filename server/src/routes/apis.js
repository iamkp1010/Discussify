const express = require('express');
const usersRouter = require('./users.router');
const postsRouter = require('./posts.router');

const apis = express.Router();

apis.use('/users',(req,res,next) =>{ 
    console.log("USER ROUTE CALLED") 
    next()
}, usersRouter);

apis.use('/posts', (req,res,next) => {
    console.log("POST ROUTE CALLED");
    next()
},postsRouter)

module.exports = apis;