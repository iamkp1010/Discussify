import { Card, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import {Loading} from "./Loading";
import {PostCard} from "./PostCard";
import {HorizontalStack} from "./HorizontalStack";
import "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { fetchPostsApi } from "../apis/postsApi";

export const TopPosts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const user = getUserDataFromLocalStorage();

  const fetchPosts = async () => {
    const query = { sortBy: "-voteCount", pageSize: 3};
    let data
    data = await fetchPostsApi(query);
    if(data && !data.error) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Stack spacing={2}>
      <Card sx={{height: 75}}>
        <HorizontalStack mt="5px">
          <MdLeaderboard />
          <Typography>Top Posts</Typography>
        </HorizontalStack>
      </Card>
      {!loading ? (
        posts &&
        posts.map((post) => (
          <PostCard preview="secondary" post={post} key={post._id} />
        ))
      ) : (
        <Loading />
      )}
    </Stack>
  );
};
