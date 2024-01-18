import { Stack } from "@mui/material";
import React from "react";
import {FindUsers} from "./FindUsers";
import {TopPosts} from "./TopPosts";

export const Sidebar = () => {
  return (
    <Stack spacing={2}>
      <TopPosts />
      <FindUsers />
    </Stack>
  );
};

