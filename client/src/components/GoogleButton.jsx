import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogleApi } from "../services/authService";
import { Button } from "@mui/material";
import { setUserDataToLocalStorage } from "../helpers/authHelper";
import { useNavigate } from "react-router-dom";

export const GoogleButton = () => {
  const navigate = useNavigate();
  const handleGoogleLoginSuccess = async(code) => {
    try{
        const data = await loginWithGoogleApi(code);
        if (data) {
          setUserDataToLocalStorage(data.user);
          navigate("/");
        }
      }
      catch(err){
        console.log(err.message)
      }
  }
  const googleLogin = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess, flow: 'auth-code', }); // if only frontend we can use implicit flow

  return (
    <Button
      disableRipple
      fullWidth
      size="large"
      variant="outlined"
      sx={{ my: 2 }}
      onClick={() => googleLogin()}
      style={{ color: "black", borderColor: "black" }}
    >
      <FcGoogle size={25} style={{ marginRight: "3%" }} />
      <strong>Continue With Google</strong>
    </Button>
  );
};
