import React from 'react'
import { Container } from "@mui/material";
import { GridLayout } from '../components/GridLayout';
import { Navbar } from '../components/Navbar';
import { PostBrowser } from '../components/PostBrowser';
import { Sidebar } from '../components/Sidebar';

export const ExploreView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>                  
  )                 
}                 
                  