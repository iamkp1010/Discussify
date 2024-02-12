import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from "react-icons/bi";
import { votePostApi } from "../services/postService";

export const VoteBox = (props) => {
  const {post} = props
  const theme = useTheme();
  const isDarkTheme = localStorage.getItem("isDarkTheme") === "true"
  const [voteCount, setvoteCount] = useState(post.voteCount);

  const [upvoted, setUpvoted] = useState(post.isUpvoted !== undefined ? (post.isUpvoted ? true: false) : false)
  const [downvoted, setDownvoted] = useState(post.isUpvoted !== undefined ? (post.isUpvoted ? false: true) : false)

  const navigate = useNavigate();

  const handleUpvote = async (e) => {
    if (getUserDataFromLocalStorage()) {
      const newUpvotedValue = !upvoted;
      setUpvoted(newUpvotedValue);

      if (downvoted && newUpvotedValue) {
        setvoteCount(voteCount + 2);
        setDownvoted(!downvoted)
      } else if (!downvoted && newUpvotedValue) {
        setvoteCount(voteCount + 1);
      } else if (!newUpvotedValue) {
        setvoteCount(voteCount - 1);
      }

      await votePostApi(post._id, {isUpvoted: true});
    } else {
      navigate('/login');
    }
  };

  const handleDownvote = async (e) => {
    if (getUserDataFromLocalStorage()) {
      const newDownvotedValue = !downvoted;
      setDownvoted(newDownvotedValue);

      if (upvoted && newDownvotedValue) {
        setvoteCount(voteCount - 2);
        setUpvoted(!upvoted);

      } else if (!upvoted && newDownvotedValue) {
        setvoteCount(voteCount - 1);
      } else if (!newDownvotedValue) {
        setvoteCount(voteCount + 1);
      }

      await votePostApi(post._id, {isUpvoted: false});
    } else {
      navigate('/login');
    }
  };

  return (
    <Stack alignItems="center" backgroundColor= {isDarkTheme? "#28282B": "grey.100"}>
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
    </Stack>
  );
};
