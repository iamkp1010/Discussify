import { createTheme } from "@mui/material";

const theme = (mode) => {
  return createTheme({
    palette: {
      mode,
    },
    components: {
      MuiCard: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...{
              padding: theme.spacing(2),
              borderWidth: "1.5px",
            },
          }),
        },
      },
      MuiContainer: {  // main application width
        defaultProps: {
          // maxWidth: "lg",  
        },
      },
      },
    })
  }

export default theme;