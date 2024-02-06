import React from "react";
import {HorizontalStack} from "./HorizontalStack";
import {UserAvatar} from "./UserAvatar";
import { Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

export const UserEntry = ({ username }) => {
  return (
    <HorizontalStack justifyContent="space-between" key={username}>
      <HorizontalStack>
        <UserAvatar width={30} height={30} username={username} />
        <Typography>{username}</Typography>
      </HorizontalStack>
      <Link to={"/users/" + username} component={RouterLink} underline="hover">View</Link>
    </HorizontalStack>
  );
};

