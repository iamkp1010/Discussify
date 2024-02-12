import { Button, IconButton, Typography, useTheme } from "@mui/material";
import { Box, compose } from "@mui/system";
import React, { useState } from "react";
import { AiFillEdit, AiOutlineLine, AiOutlinePlus } from "react-icons/ai";
import { Link as RouterLink , useNavigate } from "react-router-dom";
import Link from '@mui/material/Link';
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import {CommentEditor} from "./CommentEditor";
import {ContentDetails} from "./ContentDetails";
import {HorizontalStack} from "./HorizontalStack";
// import { deleteComment, updateComment } from "../api/posts";
import {ContentUpdateEditor} from "./ContentUpdateEditor";
import {Markdown} from "./Markdown";
import { MdCancel } from "react-icons/md";
import { BiDownvote, BiReply, BiSolidDownvote, BiSolidUpvote, BiTrash, BiUpvote } from "react-icons/bi";
import { BsReply, BsReplyFill } from "react-icons/bs";
import Moment from "react-moment";
import { deleteCommentApi, updateCommentApi, voteCommentApi } from "../services/commentService";
import { IconContext } from "react-icons/lib";

export const Comment = (props) => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(commentData);
  const user = getUserDataFromLocalStorage();
  const isDarkTheme = localStorage.getItem("isDarkTheme") === "true"
  const isAuthor = user && user.userId === comment.author._id;
  const navigate = useNavigate();
  
  const handleSetReplying = () => {
    if (getUserDataFromLocalStorage()) {
      setReplying(!replying);
    } else {
      navigate("/login");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const content = e.target.content.value;
    
    await updateCommentApi(comment._id, {content:content});
    
    const newCommentData = { ...comment, content, edited: true };
    
    setComment(newCommentData);
    
    editComment(newCommentData);
    
    setEditing(false);
  };
  
  const handleDelete = async () => {
    await deleteCommentApi(comment._id);
    removeComment(comment);
  };
  
  const [voteCount, setvoteCount] = useState(comment.voteCount);

  const [upvoted, setUpvoted] = useState(comment.isUpvoted !== undefined ? (comment.isUpvoted ? true: false) : false)
  const [downvoted, setDownvoted] = useState(comment.isUpvoted !== undefined ? (comment.isUpvoted ? false: true) : false)
  
  const handleUpvote = async (e) => {
    if (user) {
      const newUpvotedValue = !upvoted;
      setUpvoted(newUpvotedValue);

      if (downvoted && newUpvotedValue) {
        setvoteCount(prevVoteCount => prevVoteCount + 2);
        setDownvoted(!downvoted)
      } else if (!downvoted && newUpvotedValue) {
        setvoteCount(prevVoteCount => prevVoteCount + 1);
      } else if (!newUpvotedValue) {
        setvoteCount(prevVoteCount => prevVoteCount - 1);
      }


      await voteCommentApi(comment._id, {isUpvoted: true});
    } else {
      navigate('/login');
    }
  };

  const handleDownvote = async (e) => {
    if (user) {
      const newDownvotedValue = !downvoted;
      setDownvoted(newDownvotedValue);

      if (upvoted && newDownvotedValue) {
        setvoteCount(prevVoteCount => prevVoteCount - 2);
        setUpvoted(!upvoted);

      } else if (!upvoted && newDownvotedValue) {
        setvoteCount(prevVoteCount => prevVoteCount - 1);
      } else if (!newDownvotedValue) {
        setvoteCount(prevVoteCount => prevVoteCount + 1);
      }

      await voteCommentApi(comment._id, {isUpvoted: false});
    } else {
      navigate('/login');
    }
  };
  
  let style = {
    backgroundColor: theme.palette.grey[100],
    borderRadius: 1.5,
    mb: theme.spacing(2),
    padding: theme.spacing(0),
  };
  
  if (depth % 2 === 1) {
    style.backgroundColor = isDarkTheme? "#121212" : "white";
  }
  else{
    if(isDarkTheme) style.backgroundColor = "#28282B"
  }
  
  return (
    <Box sx={style}>
      <Box
        sx={{
          pl: theme.spacing(2),
          pt: theme.spacing(1),
          pb: theme.spacing(1),
          pr: 1,
        }}
      >
        {props.profile ? (
          <Box>
            <Typography variant="h6">
              <Link component={RouterLink} underline="hover" to={"/posts/" + comment.post._id}>
                {comment.post.title}
              </Link>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <Moment fromNow>{comment.createdAt}</Moment>{" "}
              {comment.edited && <>(Edited)</>}
            </Typography>
          </Box>
        ) : (
          <HorizontalStack justifyContent="space-between">
            <HorizontalStack>
              <ContentDetails
                username={comment.username}
                createdAt={comment.createdAt}
                edited={comment.edited}
              />

              <IconButton
                color="primary"
                onClick={() => setMinimised(!minimised)}
              >
                {minimised ? (
                  <AiOutlinePlus size={15} />
                ) : (
                  <AiOutlineLine size={15} />
                )}
              </IconButton>
            </HorizontalStack>
            {!minimised && (
              <HorizontalStack spacing={1}>
                <IconButton
                  variant="text"
                  size="small"
                  onClick={handleSetReplying}
                >
                  {!replying ? (
                    <BsReplyFill color={iconColor} />
                  ) : (
                    <MdCancel color={iconColor} />
                  )}
                </IconButton>
                {user && (isAuthor) && (
                  <HorizontalStack spacing={1}>
                    <IconButton
                      variant="text"
                      size="small"
                      onClick={() => setEditing(!editing)}
                    >
                      {editing ? (
                        <MdCancel color={iconColor} />
                      ) : (
                        <AiFillEdit color={iconColor} />
                      )}
                    </IconButton>
                    <IconButton
                      variant="text"
                      size="small"
                      onClick={handleDelete}
                    >
                      <BiTrash color={theme.palette.error.main} />
                    </IconButton>
                  </HorizontalStack>
                )}
              </HorizontalStack>
            )}
          </HorizontalStack>
        )}

        {!minimised && (
          <Box sx={{ mt: 1}} overflow="hidden">
            {!editing ? (
              <div style={{paddingLeft:"10px"}}><Markdown content={comment.content}/></div>
            ) : (
              <ContentUpdateEditor
                handleSubmit={handleSubmit}
                originalContent={comment.content}
              />
            )}

            <HorizontalStack>
              <IconButton sx={{ padding: 0.5 }} onClick={handleUpvote}>
                {upvoted ? (
                  <IconContext.Provider value={{ color: theme.palette.primary.main }}>
                  <BiSolidUpvote />
                  </IconContext.Provider>
                ) : (
                  <BiUpvote />
                )}
              </IconButton>
              <Typography>{voteCount}</Typography>
              <IconButton sx={{ padding: 0.5 }} onClick={handleDownvote}>
                {downvoted ? (
                  <IconContext.Provider value={{ color: theme.palette.primary.main }}>
                  <BiSolidDownvote />
                  </IconContext.Provider>
                ) : (
                  <BiDownvote />
                )}
              </IconButton>
            </HorizontalStack>

            {replying && !minimised && (
              <Box sx={{ mt: 2 }}>
                <CommentEditor
                  comment={comment}
                  addComment={addComment}
                  setReplying={setReplying}
                  label="What are your thoughts on this comment?"
                />
              </Box>
            )}
            {comment.children && (
              <Box sx={{ pt: theme.spacing(2) }}>
                {comment.children.map((reply, i) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    depth={depth + 1}
                    addComment={addComment}
                    removeComment={removeComment}
                    editComment={editComment}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
