import { Box, Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";

export const ContentUpdateEditor = (props) => {
  const [content, setContent] = useState(props.originalContent);
  const [error, setError] = useState("");
  const isDarkTheme = localStorage.getItem("isDarkTheme") === "true"

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    let error = null;

    if (props.validate) {
      error = props.validate(content);
    }

    if (error && error.length !== 0) {
      setError(error);
    } else {
      props.handleSubmit(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack>
        <TextField
          value={content}
          fullWidth
          margin="normal"
          name="content"
          sx={{ backgroundColor: isDarkTheme? "#121212" : "white" }}
          onChange={handleChange}
          error={error.length !== 0}
          helperText={error}
          multiline
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{ backgroundColor: isDarkTheme? "#121212" : "white", mt: 1 }}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
};
