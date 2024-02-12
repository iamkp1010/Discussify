import { Button, Card, Skeleton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import {CreatePost} from "./CreatePost";
import {PostCard} from "./PostCard";
import {SortBySelect} from "./SortBySelect";
import {HorizontalStack} from "./HorizontalStack";
import { fetchPostsApi, fetchVotedPostApi } from "../services/postService";

export const PostBrowser = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = getUserDataFromLocalStorage();
  const [effect, setEffect] = useState(false);

  const [search] = useSearchParams();

  const searchExists =
    search && search.get("search") && search.get("search").length > 0;

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = page + 1;
    setPage(newPage);

    let query = {
      pageNumber: newPage,
      pageSize: 8,
      sortBy,
    };

    let data;
    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser._id;
      if (searchExists) query.search = search.get("search");
      data = await fetchPostsApi(query);
    } else if (props.contentType === "votes") {
      query.userId = props.profileUser._id
      data = await fetchVotedPostApi(query);
    }

    if (data?.length < 8) {
      setEnd(true);
    }

    setLoading(false);
    if (data && !data.error) {
      setPosts([...posts, ...data]);
      setCount(data.length);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);
  
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect)
  }, [search, props.profileUser]);
  
  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts)?.forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const removePost = (removedPost) => {
    setPosts(posts?.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-voteCount": "Likes",
      "-commentCount": "Comments",
      "createdAt": "Earliest",
    },
    votes: {
      "-createdAt": "Latest",
      "createdAt": "Earliest",
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  return (
    <>
      <Stack spacing={2}>
        <Card>
          <HorizontalStack justifyContent="space-between">
            {props.createPost && <CreatePost />}
            <SortBySelect
              onSortBy={handleSortBy}
              sortBy={sortBy}
              sorts={sorts}
            />
          </HorizontalStack>
        </Card>

        {searchExists && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Showing results for "{search.get("search")}"
            </Typography>
            <Typography color="text.secondary" variant="span">
              {count} results found
            </Typography>
          </Box>
        )}
        {posts?.map((post, i) => (
          <PostCard
            preview="primary"
            key={post._id}
            post={post}
            removePost={removePost}
          />
        ))}

        {loading && <> 
          {Array(5).fill(1).map(()=> <Skeleton variant="rectangular" height="200px" width="100%" style={{marginTop:"20px"}}/>)}
        </>}
        {end ? (
          <Stack py={5} alignItems="center">
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {posts?.length > 0 ? (
                <>All posts have been viewed</>
              ) : (
                <>No posts available</>
              )}
            </Typography>
            <Button variant="text" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Stack>
        ) : (
          loading &&
          posts &&
          posts?.length > 0 && (
            <Stack pt={2} pb={6} alignItems="center" spacing={2}>
              <Button onClick={fetchPosts} variant="contained">
                Load more
              </Button>
              <Button variant="text" size="small" onClick={handleBackToTop}>
                Back to top
              </Button>
            </Stack>
          )
        )}
      </Stack>
    </>
  );
};
