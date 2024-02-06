import { Container } from "@mui/material";
import React from "react";
import { GridLayout } from "../components/GridLayout";
import { Navbar } from "../components/Navbar";
import { PostEditor } from "../components/PostEditor";
import { Sidebar } from "../components/Sidebar";

export const CreatePostView = () => {
  return (
    <Container>
      <GridLayout left={<PostEditor />} right={<Sidebar />} />
    </Container>
  );
};
