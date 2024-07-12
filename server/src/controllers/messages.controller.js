const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const ChatModel = require("../models/chats.model");
const UserModel = require("../models/users.model");
const MessageModel = require("../models/messages.model");

const sendMessage = async (req, res) => {
  try {
    console.log(req.body, req.params);
    const recipientId = req.params.id;
    const { content } = req.body;
    const userId = req.user._id;

    const recipient = await UserModel.findById(recipientId);

    if (!recipient) {
      throw new Error("Recipient not found");
    }

    let conversation = await ChatModel.findOne({
      recipients: {
        $all: [userId, recipientId],
      },
    });

    if (!conversation) {
      conversation = await ChatModel.create({
        recipients: [userId, recipientId],
      });
    }

    await MessageModel.create({
      chatId: conversation._id,
      sender: userId,
      content,
    });

    conversation.lastMessageAt = Date.now();

    conversation.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    const conversation = await ChatModel.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messages = await MessageModel.aggregate([
      {
        $match: {
          chatId: conversation._id,
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for the User model
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $project: {
          "sender.password": 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);
    return res.json(messages);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await ChatModel.aggregate([
      {
        $match: {
          recipients: {
            $in: [userId],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipients",
          foreignField: "_id",
          as: "recipients",
        },
      },
      {
        $project: {
          "recipients.password": 0,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    for (let i = 0; i < conversations.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (!conversations[i].recipients[j]._id.equals(userId)) {
          conversations[i].recipient = conversations[i].recipients[j];
        }
      }
    }

    return res.json(conversations);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getConversations,
  sendMessage,
  getMessages,
};
