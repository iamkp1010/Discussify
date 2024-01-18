import React from "react";
import {HorizontalStack} from "./HorizontalStack";
import {UserAvatar} from "./UserAvatar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const UserEntry = ({ username }) => {
  return (
    <HorizontalStack justifyContent="space-between" key={username}>
      <HorizontalStack>
        <UserAvatar width={30} height={30} username={username} />
        <Typography>{username}</Typography>
      </HorizontalStack>
      <Link to={"/users/" + username}>View</Link>
    </HorizontalStack>
  );
};

