import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";

export const LikeBox = (props) => {
  const { voteCount, onVote } = props;
  const theme = useTheme();
  const [voted, setvoted] = useState(props.voted);

  const navigate = useNavigate();

  const handleLike = (e) => {
    if (getUserDataFromLocalStorage()) {
      const newvotedValue = !voted;
      setvoted(newvotedValue);
      onVote(newvotedValue);
    } else {
      navigate("/login");
    }
  };

  return (
    <Stack alignItems="center">
      <IconButton sx={{ padding: 0.5 }} onClick={handleLike}>
        {voted ? (
          <IconContext.Provider value={{ color: theme.palette.primary.main }}>
            <AiFillLike />
          </IconContext.Provider>
        ) : (
          <AiOutlineLike />
        )}
      </IconButton>
      <Typography>{voteCount}</Typography>
    </Stack>
  );
};
