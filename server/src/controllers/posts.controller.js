const mongoose = require("mongoose");
const PostModel = require("../models/posts.model");
const VotesModel = require("../models/votes.model");
const UserModel = require("../models/users.model");
const CommentModel = require("../models/comments.model");

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

/*
  - fetch all posts for home page
  - fetch specific post with id
  - fetch post with seach
  - fetch user's posts
*/

async function fetchPosts(req, res) {
  try {
    const loggedUser = req.user;
    let { pageNumber, sortBy, search, postId, author, pageSize } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!pageNumber) pageNumber = 1;
    else pageNumber = Number(pageNumber)
    if (!pageSize) pageSize = 10
    else pageSize = Number(pageSize)

    const [sortField, sortOrder] =
      sortBy[0] === "-" ? [sortBy.slice(1), -1] : [sortBy, 1];

    let pipeline = [];

    if (search) {
      pipeline.push({
        $match: {
          title: { $regex: search, $options: "i" },
        },
      });
    }

    if (postId) {
    if(!mongoose.Types.ObjectId.isValid(postId)) throw new Error("PostId is not valid!")
      const postDoc = await PostModel.findById(postId)
      if(!postDoc) throw new Error("post does not exist!")

      pipeline.push({
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      });
    }

    if (author) {
      const authorDoc = await UserModel.findById(author);
      if(!authorDoc) throw new Error("Author does not exist!")

      pipeline.push({
        $match: {
          author: new mongoose.Types.ObjectId(author),
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
        },
      },
      {
        $addFields: {
          username: "$userInfo.username",
        },
      },
      {
        $project: {
          userInfo: 0,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $skip: (pageNumber - 1) * pageSize,
      },
      {
        $limit: pageSize,
      }
    );

    let posts = await PostModel.aggregate(pipeline);

    if (loggedUser) {
      const loggedUserId = loggedUser._id;
      if(!mongoose.Types.ObjectId.isValid(loggedUserId)) throw new Error("UserId is not valid!")
      const userDoc = await UserModel.findById(loggedUserId);
      if(!userDoc) throw new Error("loggedUser does not exist!")

      posts = await Promise.all(
        posts.map(async (post) => {
          const postVote = await VotesModel.findOne({
            postId: post._id,
            userId: loggedUserId,
            isPost: true
          });

          if (postVote) {
            post.isUpvoted = postVote.isUpvoted;
          }
          return post;
        })
      );
    }

    res.status(200).json(posts);
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
}

//delete post
// -Comment needs to be deleted
async function deletePost(req, res) {
  const mongoSession = await mongoose.startSession();
  try{
    mongoSession.startTransaction();
    const postId = req.params.id;
    
    if(!mongoose.Types.ObjectId.isValid(postId)) throw new Error("PostId is not valid!")
    const postDoc = await PostModel.findById(postId);
    if (!postDoc) throw new Error("Post does not exist!")

    await PostModel.deleteOne({ _id: postId }).session(mongoSession);
    await CommentModel.deleteMany({postId}).session(mongoSession)
    await mongoSession.commitTransaction();
    mongoSession.endSession();
    res.status(200).json({msg: "Post deleted successfully"})

  }catch(err){
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    console.log(err)
    res.status(400).json({ error: err.message });
  }

}

async function updatePost(req, res) {
  try{
    const postId = req.params.id;
    const content = req.body?.content

    if(!mongoose.Types.ObjectId.isValid(postId)) throw new Error("PostId is not valid!")
    const postDoc = await PostModel.findById(postId);
    if(!postDoc) throw new Error("post does not exist!")
    if(!content) throw new Error("Content is not provided!")

    postDoc.content = content
    await postDoc.save()

    res.status(200).json({msg: "Post updated successfully"})

  }catch(err){
    console.log(err)
    res.status(400).json({ error: err.message });
  }
}

async function votePost(req, res){
  const mongoSession = await mongoose.startSession();
  try{
    mongoSession.startTransaction();
    const postId = req.params.id
    const {isUpvoted} = req.body
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("UserId is not valid!")
    const userDoc = await UserModel.findById(userId);
    if(!userDoc) throw new Error("User does not exist!");

    if(!mongoose.Types.ObjectId.isValid(postId)) throw new Error("PostId is not valid!")
    const postDoc = await PostModel.findById(postId);
    if(!postDoc) throw new Error("Post does not exist!");

    const oldVoteDoc = await VotesModel.findOne({ postId, userId, isPost: true }).session(mongoSession)

    if(!oldVoteDoc) {
        await VotesModel.create([{userId, postId, isUpvoted, isPost: true}], { session: mongoSession });
        await PostModel.findByIdAndUpdate({_id:postId},{ $inc: { voteCount: (isUpvoted ? 1 : -1) } }).session(mongoSession)
    }
    else{
      isUpvoted === oldVoteDoc.isUpvoted ? await VotesModel.deleteOne({ postId, userId, isPost: true}).session(mongoSession) && await PostModel.findByIdAndUpdate({_id:postId},{ $inc: { voteCount: (isUpvoted ? -1 : 1) } }).session(mongoSession)
      : await VotesModel.updateOne({postId, userId, isPost: true}, {isUpvoted}).session(mongoSession) && await PostModel.findByIdAndUpdate({_id:postId},{ $inc: { voteCount: (isUpvoted ? 2 : -2) } }).session(mongoSession)
    }
    await mongoSession.commitTransaction();
    mongoSession.endSession();
    res.status(200).json({msg: "voted successfully"})
   }
   catch(err){
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

async function fetchVotedPost(req, res){

  try{
    const loggedUser = req.user;
    let {pageNumber, sortBy, userId, isUpvoted} = req.query

    if(isUpvoted === undefined) isUpvoted = true
    if (!sortBy) sortBy = "-createdAt";
    if (!pageNumber) pageNumber = 1;
  
    const [sortField, sortOrder] = sortBy[0] === "-" ? [sortBy.slice(1), -1] : [sortBy, 1];
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("UserId is not valid!")
    const userDoc = await UserModel.findById(userId);
    if(!userDoc) throw new Error("loggedUser does not exist!")
  
    let posts = await VotesModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isPost: true,
          isUpvoted
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postDoc"
        }
      },
      {
        $unwind:{
          path: "$postDoc",
        }
      },
      {
        $replaceRoot:{
          newRoot: "$postDoc"
        }
      },
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $skip: (pageNumber - 1) * 10,
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "userDoc"
        }
      },
      {
        $unwind:{
          path: "$userDoc",
        }
      },
      {
        $addFields: {
          username: "$userDoc.username",
          userId: "userDoc._id"
        }
      },
      {
        $project: {
          "userDoc": 0
        }
      }
    ])

    if (loggedUser) {
      const loggedUserId = loggedUser._id;
      if(!mongoose.Types.ObjectId.isValid(loggedUserId)) throw new Error("UserId is not valid!")
      const userDoc = await UserModel.findById(loggedUserId);
      if(!userDoc) throw new Error("loggedUser does not exist!")

      posts = await Promise.all(
        posts.map(async (post) => {
          const postVote = await VotesModel.findOne({
            postId: post._id,
            userId: loggedUserId,
            isPost: true
          });

          if (postVote) {
            post.isUpvoted = postVote.isUpvoted;
          }
          return post;
        })
      );
    }
    res.status(200).json(posts);
  }catch(err){
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createPost,
  fetchPosts,
  deletePost,
  updatePost,
  votePost,
  fetchVotedPost
}