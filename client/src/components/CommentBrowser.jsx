import { Button, Card, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {Comment} from "./Comment";
import {SortBySelect} from "./SortBySelect";
import { fetchUserCommentsApi } from "../apis/commentApi";

export const CommentBrowser = (props) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [end, setEnd] = useState(false);

  const fetchComments = async () => {
    setLoading(true);

    const newPage = page + 1;
    setPage(newPage);

    let comments = await fetchUserCommentsApi(
      props.profileUser._id,
      { sortBy, pageSize: 10 , pageNumber: newPage});
    
    if (comments?.length < 10) {
      setEnd(true);
    }
    setComments(comments);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [sortBy]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setComments([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sorts = {
    "-createdAt": "Latest",
    createdAt: "Earliest",
  };

  return (
    <Stack spacing={2}>
      <Card>
        <SortBySelect onSortBy={handleSortBy} sortBy={sortBy} sorts={sorts} />
      </Card>
      {loading ? (
        Array(5).fill(1).map(()=> <Skeleton variant="rectangular" height="150px" width="100%" style={{marginTop:"20px"}}/>)
      ) : (
        <>
          {comments &&
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} profile />
            ))}

          {end ? <Stack py={5} alignItems="center">
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {comments.length > 0 ? (
                <>All comments have been viewed</>
              ) : (
                <>No comments available</>
              )}
            </Typography>
          </Stack>
            : <Stack pt={2} pb={6} alignItems="center" spacing={2}><Button onClick={fetchComments} variant="contained">
                Load more
            </Button>
            <Button variant="text" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
            </Stack>
          }
        </>
      )}
    </Stack>
  );
};
