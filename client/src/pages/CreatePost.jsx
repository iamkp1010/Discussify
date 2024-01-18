import { Container } from "@mui/material";
import React from "react";
import { GoBack } from "../components/GoBack";
import { GridLayout } from "../components/GridLayout";
import { Navbar } from "../components/Navbar";
import { PostEditor } from "../components/PostEditor";
import { Sidebar } from "../components/Sidebar";

export const CreatePostView = () => {
  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout left={<PostEditor />} right={<Sidebar />} />
    </Container>
  );
};
