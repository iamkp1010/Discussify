import { Avatar } from "@mui/material";
import React from "react";

export const UserAvatar = ({ username, height, width }) => {
  return (
    <Avatar
      sx={{
        height: height,
        width: width,
        backgroundColor: "lightgray",
      }}
      src={"https://robohash.org/" + username}
    />
  );
};

