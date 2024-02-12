import { Card, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { AiFillCheckCircle, AiFillEdit, AiFillMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import { ContentDetails } from "./ContentDetails";

import { VoteBox } from "./VoteBox";
import { PostContentBox } from "./PostContentBox";
import { HorizontalStack } from "./HorizontalStack";
import { ContentUpdateEditor } from "./ContentUpdateEditor";
import { Markdown } from "./Markdown";

import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { deletePostApi, updatePostApi } from "../apis/postsApi";
import styled from "@emotion/styled";

const CustomCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.01)",
    borderColor: theme.palette.primary.main,
  },
}));

export const PostCard = (props) => {
  const { preview, removePost } = props;
  let postData = props.post;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = getUserDataFromLocalStorage();
  const isAuthor = user && user.username === postData.username;
  const isDarkTheme = localStorage.getItem("isDarkTheme") === "true"
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);

  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      if(post && post._id) await deletePostApi(post._id)
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate("/");
      }
    }
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();

    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    if(post && post._id) await updatePostApi(post._id, {content})
    setPost({ ...post, content, edited: true });
    setEditing(false);
  };


  return (
    <CustomCard sx={{ padding: 0 }} >
      <Box className={preview}>
        <HorizontalStack spacing={0} alignItems="initial">
          <Stack
            justifyContent="space-between "
            alignItems="center"
            spacing={1}
            sx={{
              backgroundColor: isDarkTheme? "#28282B": "grey.100",
              width: "50px",
              padding: theme.spacing(1),
            }}
          >
            <VoteBox
              post = {post}
            />
          </Stack>
        <PostContentBox clickable={preview} post={post} editing={editing}>
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                username={post.username}
                createdAt={post.createdAt}
                edited={post.edited}
                preview={preview === "secondary"}
              />
              <Box>
                {user &&
                  (isAuthor || user.isAdmin) &&
                  preview !== "secondary" && (
                    <HorizontalStack>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleEditPost}
                      >
                        {editing ? (
                          <MdCancel color={iconColor} />
                        ) : (
                          <AiFillEdit color={iconColor} />
                        )}
                      </IconButton>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleDeletePost}
                      >
                        {confirm ? (
                          <AiFillCheckCircle color={theme.palette.error.main} />
                        ) : (
                          <BiTrash color={theme.palette.error.main} />
                        )}
                      </IconButton>
                    </HorizontalStack>
                  )}
              </Box>
            </HorizontalStack>

            <Typography
              variant="h5"
              gutterBottom
              sx={{ overflow: "hidden", mt: 1, maxHeight: 125 }}
              className="title"
            >
              {post.title}
            </Typography>

            {preview !== "secondary" &&
              (editing ? (
                <ContentUpdateEditor
                  handleSubmit={handleSubmit}
                  originalContent={post.content}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
                >
                  <Markdown content={post.content} />
                </Box>
              ))}

            <HorizontalStack sx={{ mt: 2 }} justifyContent="space-between">
              <HorizontalStack>
                <AiFillMessage />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {post.commentCount}
                </Typography>
              </HorizontalStack>
            </HorizontalStack>
          </PostContentBox>
        </HorizontalStack>
      </Box>
    </CustomCard>
  );
};
