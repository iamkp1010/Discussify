import { useTheme } from "@emotion/react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import {ContentUpdateEditor} from "./ContentUpdateEditor";
import {UserAvatar} from "./UserAvatar";
import {HorizontalStack} from "./HorizontalStack";

export const MobileProfile = (props) => {
  const [user, setUser] = useState(null);
  const currentUser = getUserDataFromLocalStorage();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  useEffect(() => {
    if (props.profile) {
        console.log(props)
      setUser(props.profile);
    }
  }, [props.profile]);

  return (
    <Card sx={{ display: { sm: "block", md: "none" }, mb: 2 }}>
      {user ? (
        <Stack spacing={2}>
          <HorizontalStack spacing={2} justifyContent="space-between">
            <HorizontalStack>
              <UserAvatar width={50} height={50} username={user.username} />
              <Typography variant="h6" textOverflow="ellipses">
                {user.username}
              </Typography>
            </HorizontalStack>
          </HorizontalStack>
          <Divider />
          <Box>
            {currentUser && user._id === currentUser.userId && (
              <IconButton onClick={props.handleEditing} sx={{ mr: 1 }}>
                {props.editing ? (
                  <MdCancel color={iconColor} />
                ) : (
                  <AiFillEdit color={iconColor} />
                )}
              </IconButton>
            )}
            {user.biography ? (
              <>
                <Typography textAlign="center" variant="p">
                  <b>Bio: </b>
                  {user.biography}
                </Typography>
              </>
            ) : (
              <Typography variant="p">
                <i>
                  No bio yet{" "}
                  {currentUser && user._id === currentUser.userId && (
                    <span>- Tap on the edit icon to add your bio</span>
                  )}
                </i>
              </Typography>
            )}
            {currentUser && user._id !== currentUser.userId && (
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={props.handleMessage}>
                  Message
                </Button>
              </Box>
            )}
            {props.editing && (
              <Box>
                <ContentUpdateEditor
                  handleSubmit={props.handleSubmit}
                  originalContent={user.biography}
                  validate={props.validate}
                />
              </Box>
            )}
          </Box>
        </Stack>
      ) : (
        <>Loading...</>
      )}
    </Card>
  );
};
