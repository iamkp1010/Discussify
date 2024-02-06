import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExploreView } from "./views/ExploreView";
import { CreatePostView } from "./views/CreatePostView";
import { LoginView } from "./views/LoginView";
import { PostView } from "./views/PostView";
import { ProfileView } from "./views/ProfileView";
import { SearchView } from "./views/SearchView";
import { SignupView } from "./views/SignupView";
import { MessageView } from "./views/MessageView";
import { CssBaseline } from "@mui/material";
import {GoogleOAuthProvider} from "@react-oauth/google"
import {GOOGLE_CLIENT_ID} from "./config"
import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";

function App() {
  const [isDarkTheme, setDarkTheme] = useState(localStorage.getItem("isDarkTheme") === "true" || false);
  const toggleTheme = () => {
    localStorage.setItem("isDarkTheme", !isDarkTheme)
    setDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    
    <ThemeProvider theme={theme(isDarkTheme ? 'dark' : 'light')}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CssBaseline/>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<ExploreView />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/posts/create" element={<CreatePostView />}/>
          <Route path="/messenger" element={<MessageView />}/>
          <Route path="/search" element={<SearchView />} />
          <Route path="/users/:id" element={<ProfileView />} /> */}
          
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
          <Route
          path="/*"
          element={
            <>
              <Navbar isDarkTheme={isDarkTheme} toggleTheme={toggleTheme}/>
              <Routes>
                <Route path="/" element={<ExploreView />} />
                <Route path="/posts/:id" element={<PostView />} />
                <Route path="/posts/create" element={<CreatePostView />} />
                <Route path="/messenger" element={<MessageView />} />
                <Route path="/search" element={<SearchView />} />
                <Route path="/users/:id" element={<ProfileView />} />
              </Routes>
            </>
          }
        />
        </Routes>
      </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;