import { Card, Tab, Tabs } from "@mui/material";
import React from "react";

export const ProfileTabs = (props) => {
  const handleChange = (e, newValue) => {
    props.setTab(newValue);
  };

  return (
    <Card sx={{ padding: 0 }}>
      <Tabs value={props.tab} onChange={handleChange} variant="scrollable">
        <Tab label="Posts" value="posts" />
        <Tab label="votes" value="votes" />
        <Tab label="Comments" value="comments" />
      </Tabs>
    </Card>
  );
};
