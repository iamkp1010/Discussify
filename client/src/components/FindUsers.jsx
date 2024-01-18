import {
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import {Loading} from "./Loading";
import {HorizontalStack} from "./HorizontalStack";
import {UserEntry} from "./UserEntry";

export const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    // call api for fetch users
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClick = () => {
    fetchUsers();
  };

  return (
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack>
            <AiOutlineUser />
            <Typography>Find Others</Typography>
          </HorizontalStack>
          <IconButton
            sx={{ padding: 0 }}
            disabled={loading}
            onClick={handleClick}
          >
            <MdRefresh />
          </IconButton>
        </HorizontalStack>

        <Divider />

        {loading ? (
          <Loading />
        ) : (
          users &&
          users.map((user) => (
            <UserEntry username={user.username} key={user.username} />
          ))
        )}
      </Stack>
    </Card>
  );
};
