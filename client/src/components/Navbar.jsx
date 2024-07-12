import { useTheme } from "@emotion/react";
import {
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  withStyles,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import "react-icons/ai";
import "react-icons/ri";
import {
  AiFillFileText,
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { getUserDataFromLocalStorage, removeUserDataFromLocalStorage } from "../helpers/authHelper";
import {UserAvatar} from "./UserAvatar";
import {HorizontalStack} from "./HorizontalStack";
import { logoutApi, protectedApi } from "../services/authService";
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import logo from '../images/logo.png'

const CustomTypo = styled(Typography)({
  fontFamily: '"Protest Riot", sans-serif',
  fontWeight: 400,
  fontStyle: 'normal',
});

const SearchBox = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '25px',
    height: '50px'
  },
}));

export const Navbar = (props) => {
  const navigate = useNavigate();
  const user = getUserDataFromLocalStorage();
  const theme = useTheme();
  const username = user && getUserDataFromLocalStorage().username;
  const userId = user && getUserDataFromLocalStorage()._id;
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 868;
  const navbarWidth = width < 868;
  const logoVisible = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleLogout = async (e) => {
    removeUserDataFromLocalStorage();
    await logoutApi(userId);
    navigate("/login");
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?" + new URLSearchParams({ search }));
  };

  const handleSearchIcon = (e) => {
    setSearchIcon(!searchIcon);
  };

  const protectedFunCall = async() => {
    const res = await protectedApi()
    if(res?.status === 403){
      navigate("/login")
    }
    navigate("/messenger")
  }
      
  return (
    <Stack mb={2} ml={!mobile? 4 : 0} mr={!mobile? 4 : 1}>
  
      <Stack 
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 2,
          pb: 0,
        }}
        spacing={!mobile ? 2 : 0}
      >

        <Button onClick={() => navigate("/")} style={{ backgroundColor: 'transparent' }} disableRipple>
          <HorizontalStack>
            <img
              src={logo}
              alt="logo"
              height={mobile? 35 :45}
              width={mobile? 35: 45}
            />

            <CustomTypo
              sx={{ display: logoVisible ? "none" : "block"  } }
              variant={navbarWidth ? "h5" : "h4"}
              mr={1}
              color={theme.palette.primary.main}
              className="vast-shadow-regular" 
            >
                Discussify
            </CustomTypo>
          </HorizontalStack>
        </Button>
        {!navbarWidth && (
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={9}>
                <Box component="form" onSubmit={handleSubmit} >
                  <SearchBox
                    size="small"
                    label="Search for posts"
                    sx={{ flexGrow: 1}}
                    onChange={handleChange}
                    value={search}
                    fullWidth
                  />
                </Box>
            </Grid>
          </Grid>
        )}

        <Stack direction="row" alignItems="center" spacing={mobile? 1 :2}>
          {mobile && (
            <IconButton onClick={handleSearchIcon} style={{marginLeft: "10px"}}>
              <AiOutlineSearch />
            </IconButton>
          )}

          <IconButton 
          onClick={props.toggleTheme}
          >
          {props.isDarkTheme ? <FaSun /> : <FaMoon />}
          </IconButton>

          <IconButton component={Link} to={"/"}>
            <AiFillHome />
          </IconButton>
          {user ? (
            <>
              {/* <IconButton component={Link} to={"/messenger"} /> */}
              <IconButton onClick={protectedFunCall}>
                <AiFillMessage />
              </IconButton>
              <IconButton component={Link}  to={"/users/" + username}>
                <UserAvatar width={30} height={30} username={user.username} />
              </IconButton>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="text" sx={{ minWidth: 85 }} href="/signup">
                Sign Up
              </Button>
              <Button variant="text" sx={{ minWidth: 85 }} href="/login">
                Login
              </Button>
            </>
          )}
        </Stack>
        
      </Stack>

      {navbarWidth && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <SearchBox
            size="small"
            label="Search for posts"
            fullWidth
            onChange={handleChange}
            value={search}
          />
        </Box>
      )}
    </Stack>
  );
};

