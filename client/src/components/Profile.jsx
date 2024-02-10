import { useTheme } from "@emotion/react";
import {
  Button,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import {ContentUpdateEditor} from "./ContentUpdateEditor";
import {Loading} from "./Loading";
import {UserAvatar} from "./UserAvatar";
import {HorizontalStack} from "./HorizontalStack";
import styled from "@emotion/styled";

const UsernameTypo = styled(Typography)({
  fontFamily: '"Courgette", cursive',
  fontWeight: 800,
  fontStyle: 'normal'
});

export const Profile = (props) => {
  const [user, setUser] = useState(null);
  const currentUser = getUserDataFromLocalStorage();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile);
    }
  }, [props.profile]);

  return (
    <Card>
      {user ? (
        <Stack alignItems="center" spacing={2}>
          <Box my={1}>
            <UserAvatar width={150} height={150} username={user.username} />
          </Box>

          <UsernameTypo variant="h5">{user.username}</UsernameTypo>

          {props.editing ? (
            <Box>
              <ContentUpdateEditor
                handleSubmit={props.handleSubmit}
                originalContent={user.biography}
                validate={props.validate}
              />
            </Box>
          ) : user.biography ? (
            <Typography textAlign="center" variant="p">
              <b>Bio: </b>
              {user.biography}
            </Typography>
          ) : (
            <Typography variant="p">
              <i>No bio yet</i>
            </Typography>
          )}

          {currentUser && user._id === currentUser._id && (
            <Box>
              <Button
                startIcon={<AiFillEdit color={iconColor} />}
                onClick={props.handleEditing}
              >
                {props.editing ? <>Cancel</> : <>Edit bio</>}
              </Button>
            </Box>
          )}

          {currentUser && user._id !== currentUser._id && (
            <Button variant="outlined" onClick={props.handleMessage}>
              Message
            </Button>
          )}
        </Stack>
      ) : (
        <Loading label="Loading profile" />
      )}
    </Card>
  );
};
