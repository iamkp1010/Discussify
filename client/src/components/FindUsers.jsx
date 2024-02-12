import {
  Card,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import {HorizontalStack} from "./HorizontalStack";
import {UserEntry} from "./UserEntry";
import { fetchRandsomUserApi } from "../apis/usersApi";

export const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const query = { size : 5 }
    const data = await fetchRandsomUserApi(query);
    setLoading(false);
    setUsers(data)
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
          <Skeleton variant="rectangular" height="250px" width="100%" style={{marginTop:"20px"}}/>
        ) : (
          users?.length &&
          users.map((user) => (
            <UserEntry username={user.username} key={user.username} />
          ))
        )}
      </Stack>
    </Card>
  );
};
