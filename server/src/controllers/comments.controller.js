const mongoose = require("mongoose");
const PostModel = require("../models/posts.model");
const VotesModel = require("../models/votes.model");
const UserModel = require("../models/users.model");
const CommentModel = require("../models/comments.model");

async function createComment(req, res) {
  const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();

    const { content, postId, parentId } = req.body;
    const user = req.user;
    const postDoc = await PostModel.findById(postId);
    if (!postDoc) throw new Error("Post does not exist!");

    if (parentId) {
      const parentComment = await CommentModel.findById(parentId);
      if (!parentComment) throw new Error("Invalid parent comment!");
    }

    let commentDoc = await CommentModel.create(
      [
        {
          author: user._id,
          content: content,
          postId: postId,
          parent: parentId,
        },
      ],
      { session: mongoSession }
    );
    postDoc.commentCount++;
    await postDoc.save({ session: mongoSession });
    commentDoc[0]._doc.username = user.username;

    await mongoSession.commitTransaction();
    mongoSession.endSession();
    res.status(201).json(commentDoc[0]);
  } catch (err) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

async function fetchPostComments(req, res) {
  try {
    const loggedUser = req.user
    const postId = req.query.id;

    const postDoc = await PostModel.findById(postId);
    if (!postDoc) throw new Error("Post does not exist!");

    let commentDoc = await CommentModel.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
        },
      },
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          authorInfo: 0,
        },
      },
    ]);

    if(loggedUser) {
      const loggedUserId = loggedUser._id;
      if(!mongoose.Types.ObjectId.isValid(loggedUserId)) throw new Error("UserId is not valid!")
      const userDoc = await UserModel.findById(loggedUserId);
      if(!userDoc) throw new Error("loggedUser does not exist!")

      commentDoc = await Promise.all(
        commentDoc.map(async (comment) => {
          const commentVote = await VotesModel.findOne({
            commentId: comment._id,
            userId: loggedUserId,
            isPost: false
          });

          if (commentVote) {
            comment.isUpvoted = commentVote.isUpvoted;
          }
          return comment;
        })
      );
    }

    let commentMap = new Map();

    commentDoc.forEach((comment) =>{
        commentMap.set(comment._id.toString(), comment)
        comment.children = []
      }
    );

    let finalCommmentsDoc = [];

    commentDoc.forEach((comment) => {
      if (comment.parent) {
        let parentDoc = commentMap.get(comment.parent.toString());
        parentDoc.children.push(comment);
      } else finalCommmentsDoc.push(comment);
    });
    res.status(200).json(finalCommmentsDoc);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

async function updateComment(req, res) {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const commentDoc = await CommentModel.findById(commentId);
    if (!commentDoc) throw new Error("comment does not exist!");

    commentDoc.content = content;
    commentDoc.edited = true;

    await commentDoc.save();
    res.status(200).json(commentDoc);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

async function deleteCommentTree(id, mongoSession) {
    await CommentModel.deleteOne({ _id: id }, { session: mongoSession });
    const children = await CommentModel.find({ parent: id });
    for (const child of children) {
        await deleteCommentTree(child._id, mongoSession);
    }
}

async function deleteComment(req, res) {
  const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();
    const commentId = req.params.id;
    const commentDoc = await CommentModel.findById(commentId);
    if (!commentDoc) throw new Error("comment does not exist!");

    const postDoc = await PostModel.findById(commentDoc.postId);
    if (!postDoc) throw new Error("Post does not exist!");

    await deleteCommentTree(commentId, mongoSession);

    postDoc.commentCount = (await CommentModel.find({ postId: postDoc._id }).session(mongoSession)).length;

    await postDoc.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    res.status(200).json({ msg: "Comment deleted successfully!" });
  } catch (err) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

async function voteComment(req, res){
  const mongoSession = await mongoose.startSession();
  try{
    mongoSession.startTransaction();
    const commentId = req.params.id
    const { isUpvoted } = req.body
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("UserId is not valid!")
    const userDoc = await UserModel.findById(userId);
    if(!userDoc) throw new Error("User does not exist!");

    if(!mongoose.Types.ObjectId.isValid(commentId)) throw new Error("commentId is not valid!")
    const commentDoc = await CommentModel.findById(commentId);
    if(!commentDoc) throw new Error("Post does not exist!");

    const oldVoteDoc = await VotesModel.findOne({ commentId, userId, isPost: false }).session(mongoSession)

    if(!oldVoteDoc) {
        await VotesModel.create([{userId, commentId, isUpvoted, isPost: false}], { session: mongoSession });
        await CommentModel.findByIdAndUpdate({_id:commentId},{ $inc: { voteCount: (isUpvoted ? 1 : -1) } }).session(mongoSession)
    }
    else{
      isUpvoted === oldVoteDoc.isUpvoted ? await VotesModel.deleteOne({ commentId, userId, isPost: false}).session(mongoSession) && await CommentModel.findByIdAndUpdate({_id:commentId},{ $inc: { voteCount: (isUpvoted ? -1 : 1) } }).session(mongoSession)
      : await VotesModel.updateOne({commentId, userId, isPost: false}, {isUpvoted}).session(mongoSession) && await CommentModel.findByIdAndUpdate({_id:commentId},{ $inc: { voteCount: (isUpvoted ? 2 : -2) } }).session(mongoSession)
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

module.exports = {
  createComment,
  fetchPostComments,
  updateComment,
  deleteComment,
  voteComment
};
