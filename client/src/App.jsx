import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExploreView } from "./pages/Explore";
import { CreatePostView } from "./pages/CreatePost";
import { LoginView } from "./pages/Login";
import { PostView } from "./pages/Post";
import { Profile } from "./pages/Profile";
import { SearchView } from "./pages/Search";
import { SignupView } from "./pages/Signup";
import { MessageView } from "./pages/Message";
import { CssBaseline } from "@mui/material";
import {GoogleOAuthProvider} from "@react-oauth/google"
import {GOOGLE_CLIENT_ID} from "./config"

function App() {
  return (
    <ThemeProvider theme={theme}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <CssBaseline/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExploreView />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/posts/create" element={<CreatePostView />}/>
          <Route path="/messenger" element={<MessageView />}/>
          <Route path="/search" element={<SearchView />} />
          <Route path="/users/:id" element={<Profile />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
        </Routes>
      </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;