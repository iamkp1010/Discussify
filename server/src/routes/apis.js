const express = require("express");
const usersRouter = require("./users.router");
const postsRouter = require("./posts.router");
const commentsRouter = require("./comments.router");
const authRouter = require("./auth.router");
const messagesRouter = require("./messages.router");

const apis = express.Router();

apis.use("/users", usersRouter);
apis.use("/posts", postsRouter);
apis.use("/comments", commentsRouter);
apis.use("/messages", messagesRouter);
apis.use("/auth", authRouter);

module.exports = apis;