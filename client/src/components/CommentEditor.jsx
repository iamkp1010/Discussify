import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { createComment } from "../api/posts";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import {ErrorAlert} from "./ErrorAlert";
import { HorizontalStack } from "./HorizontalStack";
import { createCommentApi } from "../apis/commentApi";

export const CommentEditor = ({ label, comment, addComment, setReplying }) => {
  const [formData, setFormData] = useState({
    content: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDarkTheme = localStorage.getItem("isDarkTheme") === "true"
  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      parentId: comment && comment._id,
      postId: params.id
    };

    setLoading(true);
    const data = await createCommentApi(body);
    setLoading(false);
    if (data.error) {
      setError(data.error);
    } else {
      formData.content = "";
      setReplying && setReplying(false);
      addComment(data);
    }
  };

  const handleFocus = (e) => {
    !getUserDataFromLocalStorage() && navigate("/login");
  };

  return (
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <Typography variant="h5">
            {comment ? <>Reply</> : <>Comment</>}
          </Typography>
        </HorizontalStack>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            multiline
            fullWidth
            label={label}
            rows={5}
            required
            name="content"
            sx={{
              backgroundColor: isDarkTheme? "black": "white",
            }}
            onChange={handleChange}
            onFocus={handleFocus}
            value={formData.content}
          />

          <ErrorAlert error={error} sx={{ my: 4 }} />
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: isDarkTheme? "black": "white",
              mt: 2,
            }}
          >
            {loading ? <div>Submitting</div> : <div>Submit</div>}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};
