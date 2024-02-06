import {  Typography } from "@mui/material";
import React from "react";
import {HorizontalStack} from "./HorizontalStack";
import Moment from "react-moment";
import {UserAvatar} from "./UserAvatar";
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import styled from "@emotion/styled";

const UsernameTypo = styled(Typography)({
  fontFamily: '"Courgette", cursive',
  fontWeight: 800,
  fontStyle: 'normal'
});

export const ContentDetails = ({ username, createdAt, edited, preview }) => {
  return (
    <HorizontalStack sx={{}}>
      <UserAvatar width={30} height={30} username={username} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Link
          component={RouterLink}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
          }}
          fontSize="18px"
          to={"/users/" + username}
          underline="hover"
        >
          <b><UsernameTypo display="inline">{username}</UsernameTypo></b>
        </Link>
        {!preview && (
          <>
            {" "}
            · <Moment fromNow>{createdAt}</Moment> {edited && <>(Edited)</>}
          </>
        )}
      </Typography>
    </HorizontalStack>
  );
};

