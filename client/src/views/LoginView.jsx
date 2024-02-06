import { Button, Container, CssBaseline, Stack, ThemeProvider, Typography, createTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import {ErrorAlert} from "../components/ErrorAlert";
import { setUserDataToLocalStorage } from "../helpers/authHelper";
import Divider from '@mui/material/Divider';
import {DarkTextField} from "../components/DarkTextField"
import useTheme from '@mui/system/useTheme';
import { GoogleButton } from "../components/GoogleButton";
import { loginApi } from "../apis/usersApi";
import theme from "../theme";

export const LoginView = () => {
  const navigate = useNavigate();
  const themeconfig = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const data = await loginApi(formData);
      if (data.error) {
        setServerError(data.error);
      } else {
        setUserDataToLocalStorage(data.user);
        navigate("/");
      }
    }
    catch(err){
      console.log(err.message)
    }
  };

  return (
    <ThemeProvider theme={theme('light')}>
    <CssBaseline />
    <Container maxWidth="sm" sx={{ mt: 20}}>
      <Stack alignItems="center">
        <Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} gutterBottom>
        <strong>Login</strong>
        </Typography>
        <Typography sx={{ typography: { sm: 'h6', xs: 'body1' } }} gutterBottom>
        <strong>Welcome back! Let's take you to your account.</strong>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}
          sx={{ 
              [themeconfig.breakpoints.up('xs')]: {
                width: '97%',
              },
           }}
        >
          <DarkTextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            required
            id="email"
            name="email"
            onChange={handleChange}
          />
          <DarkTextField
            label="Password"
            fullWidth
            required
            margin="normal"
            id="password  "
            name="password"
            onChange={handleChange}
            type="password"
          />

          <ErrorAlert error={serverError} />
          <Button type="submit" disableRipple size="large" fullWidth variant="contained" sx={{ my: 2}} style={{backgroundColor:"black"}}>
            <strong>Login</strong>
          </Button>
          <Divider flexItem>OR</Divider>
          <GoogleButton />
          <Typography color="text.secondary" align="center">
            <strong>Don't have an account yet?</strong> <Link  component={RouterLink} to="/signup" underline="hover"><strong>Sign Up</strong></Link>
          </Typography>
        </Box>
          
      </Stack>
    </Container>
    </ThemeProvider>
  );
};

