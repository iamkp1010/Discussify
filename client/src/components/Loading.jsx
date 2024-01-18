import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

export const Loading = ({ label }) => {
  return (
    <Stack alignItems="center">
      <CircularProgress size={50} sx={{ my: 1 }} />
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {label || "Loading"}
      </Typography>
    </Stack>
  );
};

