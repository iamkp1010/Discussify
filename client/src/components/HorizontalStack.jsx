import { Stack } from "@mui/material";
import React from "react";

export const HorizontalStack = (props) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} {...props}>
      {props.children}
    </Stack>
  );
};

