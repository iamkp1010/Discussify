import React, { useEffect, useState } from "react";
import { Container, Stack, Typography } from "@mui/material";
import {GridLayout} from "../components/GridLayout";
import {Navbar} from "../components/Navbar";
import {PostBrowser} from "../components/PostBrowser";
import {Sidebar} from "../components/Sidebar";

export const SearchView = () => {
  return (
    <Container>
      <GridLayout
        left={
          <Stack spacing={2}>
            <PostBrowser createPost contentType="posts" />
          </Stack>
        }
        right={<Sidebar />}
      />
    </Container>
  );
};
