const mongoose = require("mongoose");
const PostModel = require("../models/posts.model");
const VotesModel = require("../models/votes.model");
const UserModel = require("../models/users.model");

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
  console.log("In Fetch Posts");
  try {
    const user = req.user;
    let { pageNumber, sortBy, search, postId, author } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!pageNumber) pageNumber = 1;

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
        $skip: (pageNumber - 1) * 10,
      },
      {
        $limit: 10,
      }
    );

    let posts = await PostModel.aggregate(pipeline);

    if (user) {
      const userId = user._id;
      const userDoc = await UserModel.findById(userId);
      if(!userDoc) throw new Error("user does not exist!")

      posts = await Promise.all(
        posts.map(async (post) => {
          const postVote = await VotesModel.findOne({
            postId: post._id,
            userId,
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
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
}

//delete post
async function deletePost(req, res) {
  const mongoSession = await mongoose.startSession();
  try{
    mongoSession.startTransaction();
    const postId = req.params.id;
    
    const postDoc = await PostModel.findById(postId);
    if (!postDoc) throw new Error("Post does not exist!")

    await PostModel.deleteOne({ _id: postId }, { session: mongoSession });

    // const deletedComments = await CommentModel.deleteOne({postId}, { session: mongoSession })
    await mongoSession.commitTransaction();
    mongoSession.endSession();
    res.status(200).json({msg: "Post deleted successfully"})

  }catch(err){
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }

}

//update post
async function updatePost(req, res) {
  try{
    const postId = req.params.id;
    const content = req.body?.content

    const postDoc = await PostModel.findById(postId);
    if(!postDoc) throw new Error("post does not exist!")
    if(!content) throw new Error("Content is not provided!")

    postDoc.content = content
    await postDoc.save()

    res.status(200).json({msg: "Post updated successfully"})

  }catch(err){
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
}

//upvote, downvote post
async function votePost(req, res){
  try{
    const postId = req.params.id
    const {userId, isUpvoted} = req.body
    const oldVoteDoc = await VotesModel.findOne({ postId, userId })
    // add testcase for first time vote

    console.log(oldVoteDoc)
    isUpvoted === oldVoteDoc.isUpvoted ? await VotesModel.deleteOne({ postId, userId }) && await PostModel.findByIdAndUpdate({_id:postId},{ $inc: { voteCount: (isUpvoted ? -1 : 1) } })
    : await VotesModel.updateOne({postId, userId}, {isUpvoted}) && (await PostModel.findByIdAndUpdate({_id:postId},{ $inc: { voteCount: (isUpvoted ? 2 : -2) } }))

    res.status(200).json({msg: "voted successfully"})
   }
   catch(err){
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
}

//fetch post with most likes

module.exports = {
  createPost,
  fetchPosts,
  deletePost,
  updatePost,
  votePost
};

//comments
// comment mvc
