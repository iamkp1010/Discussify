const mongoose = require("mongoose");
const PostModel = require("../models/posts.model");

async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const userId = req?.user?._id;
    if (!title || !content) throw new Error("Title and content are required");

    const post = await PostModel.create({
      title,
      content,
      author: userId,
    });

    res.status(200).json({ post });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

async function fetchAllPosts(req, res) {
  try {
    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: {
          path: "$authorInfo",
        },
      },
      {
        $addFields: {
          username: "$authorInfo.username",
        },
      },
      {
        $project: {
            authorInfo: 0,
        }  
      }
    ]);
    console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createPost,
  fetchAllPosts,
};
