const express = require("express");

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
  getConversations,
} = require("../controllers/messages.controller");

const messagesRouter = express.Router();

messagesRouter.get("/chats", verifyToken, getConversations);
messagesRouter.get("/chat/:id", verifyToken, getMessages);
messagesRouter.post("/send/:id", verifyToken, sendMessage);
module.exports = messagesRouter;