import { Card, Container, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {CommentBrowser} from "../components/CommentBrowser";
import {ErrorAlert} from "../components/ErrorAlert";
import {FindUsers} from "../components/FindUsers";
import {GridLayout} from "../components/GridLayout";
import {Loading} from "../components/Loading";
// import{ MobileProfile} from "../components/MobileProfile";
import {Navbar} from "../components/Navbar";
import {PostBrowser} from "../components/PostBrowser";
import {Profile} from "../components/Profile";
import {ProfileTabs} from "../components/ProfileTabs";
import { getUserDataFromLocalStorage } from "../helpers/authHelper";
import { fetchUserInfoApi, updateUserApi } from "../apis/usersApi";

export const ProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("posts");
  const user = getUserDataFromLocalStorage();
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    setLoading(true);
    if(params?.id){
      const data = await fetchUserInfoApi(params.id);
      setLoading(false);
      if (data?.error) {
        setError(data.error);
      } else if(data) {
        setProfile(data);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    await updateUserApi({ biography: content });
    setProfile({ ...profile,biography: content });
    setEditing(false);
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const handleMessage = () => {
    navigate("/messenger", { state: { user: profile.user } });
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const validate = (content) => {
    let error = "";

    if (content.length > 250) {
      error = "Bio cannot be longer than 250 characters";
    }

    return error;
  };

  let tabs;
  if (profile) {
    tabs = {
      posts: (
        <PostBrowser
          profileUser={profile}
          contentType="posts"
          key="posts"
        />
      ),
      liked: (
        <PostBrowser
          profileUser={profile}
          contentType="liked"
          key="liked"
        />
      ),
      comments: <CommentBrowser profileUser={profile} />,
    };
  }

  return (
    <Container>
      <GridLayout
        left={
          <>
            {/* <MobileProfile
              profile={profile}
              editing={editing}
              handleSubmit={handleSubmit}
              handleEditing={handleEditing}
              handleMessage={handleMessage}
              validate={validate}
            /> */}
            <Stack spacin g={2}>
              {!error ? (profile ?(
                <>
                  <ProfileTabs tab={tab} setTab={setTab} />

                  {tabs[tab]}
                </>
              ) : (
                <Loading />
              )) : <ErrorAlert error={error} />}
            </Stack>
          </>
        }
        right={
          <Stack spacing={2}>
            {!error && 
              <>
                <Profile
                  profile={profile}
                  editing={editing}
                  handleSubmit={handleSubmit}
                  handleEditing={handleEditing}
                  handleMessage={handleMessage}
                  validate={validate}
                />
                <FindUsers />
              </>
            }
          </Stack>
        }
      />
    </Container>
  );
};

