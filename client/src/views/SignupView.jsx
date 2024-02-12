import { Button, Container, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { setUserDataToLocalStorage } from "../helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../components/ErrorAlert";
import { isLength, isEmail, contains } from "validator";
import { DarkTextField } from "../components/DarkTextField";
import Divider from "@mui/material/Divider";
import useTheme from "@mui/system/useTheme";
import { GoogleButton } from "../components/GoogleButton";
import { registerApi } from "../services/authService";
import theme from "../theme";

export const SignupView = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const themeConfig = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0) return;
    
    try{
      const data = await registerApi(formData);
      if (data.error) {
        setServerError(data.error);
      } else {
        setUserDataToLocalStorage(data);
        navigate("/login");
      }
    }
    catch(err){
      console.log(err.message)
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Must contain only valid characters";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Must be at least 8 characters long";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }

    setErrors(errors);

    return errors;
  };

  return (
    <ThemeProvider theme={theme('light')}>
    <CssBaseline />
    <Container maxWidth="sm" sx={{ mt: 20 }}>
      <Stack alignItems="center">
        <Typography sx={{ typography: { sm: "h2", xs: "h3" } }} gutterBottom>
          <strong>Sign Up</strong>
        </Typography>
        <Typography sx={{ typography: { sm: "h6", xs: "body1" } }} gutterBottom>
          <strong>Welcome to DISCUSSIFY!</strong>
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            [themeConfig.breakpoints.up("xs")]: {
              width: "97%",
            },
          }}
        >
          <DarkTextField
            label="Username"
            fullWidth
            margin="normal"
            autoFocus
            required
            id="username"
            name="username"
            onChange={handleChange}
            error={errors.username !== undefined}
            helperText={errors.username}
          />
          <DarkTextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            required
            id="email"
            name="email"
            onChange={handleChange}
            error={errors.email !== undefined}
            helperText={errors.email}
          />
          <DarkTextField
            label="Password"
            fullWidth
            required
            margin="normal"
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            error={errors.password !== undefined}
            helperText={errors.password}
          />
          <ErrorAlert error={serverError} />
          <Button
            type="submit"
            disableRipple
            size="large"
            fullWidth
            variant="contained"
            sx={{ my: 2 }}
            style={{ backgroundColor: "black" }}
          >
            <strong>Sign Up</strong>
          </Button>
          <Divider flexItem>OR</Divider>
          <GoogleButton />
          <Typography
            color="text"
            align="center"
          >
            <strong>Already have an account?</strong>{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              {" "}
              <strong>Login</strong>{" "}
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Container>
    </ThemeProvider>
  );
};
