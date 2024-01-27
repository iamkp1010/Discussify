import { Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GoBack } from "../components/GoBack";
import { GridLayout } from "../components/GridLayout";
import { Loading } from "../components/Loading";
import { Navbar } from "../components/Navbar";
import { PostCard } from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { ErrorAlert } from "../components/ErrorAlert";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import { fetchPostsApi } from "../apis/postsApi";

export const PostView = () => {
  const params = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getUserDataFromLocalStorage();

  const fetchPost = async () => {
    setLoading(true);
    const data = await fetchPostsApi({postId:params?.id});
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        left={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />

              {/* <Comments /> */}
            </Stack>
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />}
      />
    </Container>
  );
};
