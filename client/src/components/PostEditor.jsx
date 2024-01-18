import {
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "./ErrorAlert";
  import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import { HorizontalStack } from "./HorizontalStack";
import { UserAvatar } from "./UserAvatar";

export const PostEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const user = getUserDataFromLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    // api call
    const data = {
      "_id": "65968facbc477d76f84858d5",
      "poster": {
          "_id": "65968f9cbc477d76f84858bd",
          "username": "bikram",
          "email": "dhimanbikram1914@gmail.com",
          "biography": "",
          "isAdmin": false,
          "createdAt": "2024-01-04T10:59:40.022Z",
          "updatedAt": "2024-01-04T10:59:40.022Z",
          "__v": 0
      },
      "title": "merk",
      "content": "jai mata di",
      "likeCount": 1,
      "commentCount": 3,
      "edited": false,
      "createdAt": "2024-01-04T10:59:56.756Z",
      "updatedAt": "2024-01-05T14:03:54.952Z",
      "__v": 0,
      "userLikePreview": [
          {
              "_id": "6596a90bbc477d76f848595d",
              "username": "vvv333"
          }
      ]
  }
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
    }
  };

  const validate = () => {
    const errors = {};

    return errors;
  };

  return (
    <Card>
      <Stack spacing={1}>
        {user && (
          <HorizontalStack spacing={2}>
            <UserAvatar width={50} height={50} username={user.username} />
            <Typography variant="h5">
              What would you like to post today {user.username}?
            </Typography>
          </HorizontalStack>
        )}

        <Typography>
          <a href="https://commonmark.org/help/" target="_blank">
            Markdown Help
          </a>
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            required
            name="title"
            margin="normal"
            onChange={handleChange}
            error={errors.title !== undefined}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={10}
            name="content"
            margin="normal"
            onChange={handleChange}
            error={errors.content !== undefined}
            helperText={errors.content}
            required
          />
          <ErrorAlert error={serverError} />
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
            }}
          >
            {loading ? <>Submitting</> : <>Submit</>}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

