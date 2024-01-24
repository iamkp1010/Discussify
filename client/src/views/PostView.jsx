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

export const PostView = () => {
  const params = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getUserDataFromLocalStorage();

  const fetchPost = async () => {
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
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

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
